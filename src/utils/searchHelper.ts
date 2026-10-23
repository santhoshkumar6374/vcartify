import { StoreItem, StoreCategory } from "@/types/store";

/**
 * Remove special characters, normalize units (70gsm -> 70 gsm), collapse spaces.
 */
export function normalizeSearchText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    // Separate numbers and units for matching (e.g., 70gsm -> 70 gsm, 0.7mm -> 0.7 mm)
    .replace(/(\d+)(gsm|mm|cm|m|kg|g|ml|l|pack|pcs|pc)/gi, "$1 $2")
    // Replace punctuation and symbols with a single space
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Common English plurals / singular stems for ecommerce product search.
 */
function getStemVariants(word: string): string[] {
  const variants = new Set<string>([word]);

  if (word.length > 3) {
    if (word.endsWith("ies")) {
      variants.add(word.slice(0, -3) + "y"); // diaries -> diary
    } else if (word.endsWith("es")) {
      variants.add(word.slice(0, -2)); // boxes -> box
      variants.add(word.slice(0, -1));
    } else if (word.endsWith("s")) {
      variants.add(word.slice(0, -1)); // pens -> pen, sheets -> sheet
    } else {
      // Singular to plural variants
      variants.add(word + "s");
      variants.add(word + "es");
    }
  }

  return Array.from(variants);
}

export interface ScoredProduct {
  item: StoreItem;
  score: number;
}

/**
 * Smart relevance scoring algorithm for an ecommerce product.
 * Evaluates item name, category name, brand, and description against the query tokens.
 */
export function scoreProductSearch(
  item: StoreItem,
  query: string,
  categoryName?: string
): number {
  const normQuery = normalizeSearchText(query);
  if (!normQuery) return 0;

  const queryTokens = normQuery.split(" ").filter((t) => t.length > 0);
  if (queryTokens.length === 0) return 0;

  const rawName = item.ItemName || "";
  const normName = normalizeSearchText(rawName);
  const nameWords = normName.split(" ").filter(Boolean);

  const rawDesc = item.Description || "";
  const normDesc = normalizeSearchText(rawDesc);

  const rawBrand = item.StoreName || item.VendorName || "";
  const normBrand = normalizeSearchText(rawBrand);

  const normCat = normalizeSearchText(categoryName || "");

  let score = 0;

  // 1. EXACT & PHRASE MATCHES ON ITEM NAME (Highest Priority)
  if (normName === normQuery) {
    score += 1500; // Perfect full title match
  } else if (normName.startsWith(normQuery)) {
    score += 700; // Title starts with query
  } else if (normName.includes(normQuery)) {
    score += 400; // Exact multi-word substring match inside title
  }

  // 2. TOKEN-LEVEL MATCHING ON ITEM NAME
  let matchedTokensInName = 0;
  let matchedTokensOverall = 0;

  for (const token of queryTokens) {
    const stems = getStemVariants(token);
    let tokenMatched = false;
    let tokenMatchedInName = false;

    // A. Check against words in ItemName
    for (const nameWord of nameWords) {
      if (stems.includes(nameWord)) {
        score += 160; // Exact word match in title
        tokenMatchedInName = true;
        break;
      } else if (nameWord.startsWith(token) || stems.some((s) => nameWord.startsWith(s))) {
        score += 90; // Word starts with token (e.g. "ball" matches "ballpoint")
        tokenMatchedInName = true;
        break;
      } else if (token.length >= 4 && nameWord.includes(token)) {
        // Internal substring only if token has at least 4 letters (avoids "pen" matching "dispenser")
        score += 30;
        tokenMatchedInName = true;
        break;
      }
    }

    if (tokenMatchedInName) {
      matchedTokensInName++;
      tokenMatched = true;
    }

    // B. Check against Brand / Vendor
    if (normBrand) {
      if (stems.some((s) => normBrand.includes(s))) {
        score += 80;
        tokenMatched = true;
      }
    }

    // C. Check against Category Name
    if (normCat) {
      if (stems.some((s) => normCat.includes(s))) {
        score += 70;
        tokenMatched = true;
      }
    }

    // D. Check against Description
    if (normDesc) {
      if (stems.some((s) => normDesc.includes(s))) {
        score += 35;
        tokenMatched = true;
      }
    }

    if (tokenMatched) {
      matchedTokensOverall++;
    }
  }

  // 3. MULTI-TOKEN BONUSES
  // If all query tokens matched in the product name
  if (queryTokens.length > 1 && matchedTokensInName === queryTokens.length) {
    score += 350;
  }
  // If all query tokens matched somewhere in the product (name, category, brand, desc)
  if (queryTokens.length > 1 && matchedTokensOverall === queryTokens.length) {
    score += 200;
  }

  // If none of the tokens matched at all, return 0
  if (matchedTokensOverall === 0) {
    return 0;
  }

  // If query had multiple words, but only a fraction matched, require at least 50% match
  if (queryTokens.length >= 2 && matchedTokensOverall < Math.ceil(queryTokens.length / 2)) {
    return 0;
  }

  return score;
}

/**
 * Filter and rank items by search relevance.
 */
export function searchProducts(
  items: StoreItem[],
  query: string,
  categories?: StoreCategory[]
): StoreItem[] {
  const trimmed = query.trim();
  if (!trimmed) return items;

  // Build category ID to name lookup map
  const categoryMap = new Map<number, string>();
  if (categories) {
    categories.forEach((c) => {
      categoryMap.set(c.Value, c.Text);
    });
  }

  const scored: ScoredProduct[] = [];

  for (const item of items) {
    const catName = categoryMap.get(item.CategoryId);
    const score = scoreProductSearch(item, trimmed, catName);
    if (score > 0) {
      scored.push({ item, score });
    }
  }

  // Sort descending by relevance score
  scored.sort((a, b) => b.score - a.score);

  return scored.map((s) => s.item);
}

/**
 * Generates smart keyword autocomplete suggestions for the search dropdown.
 */
export function getKeywordSuggestions(
  items: StoreItem[],
  categories: StoreCategory[] = [],
  query: string,
  maxResults = 8
): string[] {
  const normQuery = normalizeSearchText(query);
  if (!normQuery) return [];

  const stems = getStemVariants(normQuery);
  const suggestionScores = new Map<string, number>();

  // 1. Check categories
  for (const cat of categories) {
    if (!cat.Text || cat.Text.toLowerCase() === "all") continue;
    const normCat = normalizeSearchText(cat.Text);
    if (stems.some((s) => normCat.startsWith(s) || normCat === s)) {
      suggestionScores.set(cat.Text, 500);
    } else if (stems.some((s) => normCat.includes(s))) {
      suggestionScores.set(cat.Text, 300);
    }
  }

  // 2. Check item names
  for (const item of items) {
    const rawName = item.ItemName;
    const normName = normalizeSearchText(rawName);

    if (normName === normQuery) {
      suggestionScores.set(rawName, 1000);
    } else if (normName.startsWith(normQuery)) {
      suggestionScores.set(rawName, 600);
    } else if (normName.includes(normQuery)) {
      suggestionScores.set(rawName, 350);
    } else {
      // Check multi-token match
      const queryTokens = normQuery.split(" ").filter(Boolean);
      const nameWords = normName.split(" ").filter(Boolean);
      const allTokensMatch = queryTokens.every((qt) => {
        const tokenStems = getStemVariants(qt);
        return nameWords.some((nw) =>
          tokenStems.some((s) => nw.startsWith(s) || nw === s)
        );
      });
      if (allTokensMatch) {
        suggestionScores.set(rawName, 250);
      }
    }

    if (suggestionScores.size >= maxResults * 3) break;
  }

  return Array.from(suggestionScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxResults)
    .map(([term]) => term);
}

/**
 * Category-scoped suggestions: e.g. "search 'pen' in Stationaries"
 */
export function getCategoryScopedSuggestions(
  items: StoreItem[],
  categories: StoreCategory[],
  query: string,
  maxResults = 2
): { query: string; categoryName: string; categoryId: number }[] {
  const trimmed = query.trim();
  const normQuery = normalizeSearchText(trimmed);
  if (!normQuery || normQuery.length < 2) return [];

  const matches: { query: string; categoryName: string; categoryId: number }[] = [];

  for (const cat of categories) {
    if (!cat.Text || cat.Text.toLowerCase() === "all") continue;

    // Check if there are any products matching this query in this category
    const hasMatch = items.some((item) => {
      if (item.CategoryId !== cat.Value) return false;
      const score = scoreProductSearch(item, trimmed, cat.Text);
      return score > 0;
    });

    if (hasMatch) {
      matches.push({
        query: trimmed,
        categoryName: cat.Text,
        categoryId: cat.Value,
      });
    }

    if (matches.length >= maxResults) break;
  }

  return matches;
}

/**
 * Top suggested products for instant dropdown preview.
 */
export function getTopSuggestedProducts(
  items: StoreItem[],
  query: string,
  categories: StoreCategory[] = [],
  limit = 4
): StoreItem[] {
  return searchProducts(items, query, categories).slice(0, limit);
}
