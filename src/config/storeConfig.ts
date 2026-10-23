export type PageView =
  | "home" | "products" | "detail" | "cart" | "success" | "wishlist" | "policy";

export function getStoreCode(): string {
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0]?.toLowerCase();
  const second = segments[1]?.toLowerCase();

  // Visiting root, home, or any /home subroute ALWAYS uses the master store vCartify ("")
  if (!first || first === "home" || second === "home") {
    return '';
  }

  // Generic routes on root:
  if (["cart", "wishlist", "products", "all", "shop", "privacy-policy", "terms", "refund-policy", "shipping-policy", "contact", "policy"].includes(first)) {
    return '';
  }

  const queryStore = new URLSearchParams(window.location.search).get('store');
  if (queryStore) return queryStore;

  return first;
}

export function getInitialRoute(): { view: PageView; category: string } {
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0]?.toLowerCase();
  const second = segments[1]?.toLowerCase();

  // Root URL: http://localhost:5173/ -> Home page
  if (!first) {
    const queryCat = new URLSearchParams(window.location.search).get('category') || 'all';
    const queryView = (new URLSearchParams(window.location.search).get('view')?.toLowerCase() as PageView) || 'home';
    if (new URLSearchParams(window.location.search).get('policy')) {
      return { view: "policy", category: queryCat };
    }
    return { view: queryView, category: queryCat };
  }

  // Direct policy routes:
  if (["privacy-policy", "terms", "refund-policy", "shipping-policy", "contact", "policy"].includes(first)) {
    return { view: "policy", category: "all" };
  }

  // Standard generic routes:
  if (first === "home") {
    return { view: "home", category: "all" };
  }
  if (first === "products" || first === "all" || first === "shop") {
    const cat = second || new URLSearchParams(window.location.search).get('category') || 'all';
    return { view: "products", category: cat };
  }
  if (first === "cart") {
    return { view: "cart", category: "all" };
  }
  if (first === "wishlist") {
    return { view: "wishlist", category: "all" };
  }

  // Sub-routes under a store slug (e.g. /cherni/home, /cherni/cart, /cherni/wishlist)
  if (second === "home") {
    return { view: "home", category: "all" };
  }
  if (second === "cart") {
    return { view: "cart", category: "all" };
  }
  if (second === "wishlist") {
    return { view: "wishlist", category: "all" };
  }

  // Entering a store slug directly (e.g. /cherni) opens its products page
  return { view: "products", category: "all" };
}

export function getInitialCategory(): string {
  return getInitialRoute().category;
}