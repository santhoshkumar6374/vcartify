import { Search, MapPin, ChevronDown, ShoppingCart, Menu, X, Heart, ArrowRight, Tag, TrendingUp, Flame, Sparkles, Clock, Trash2 } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { Logo } from "@/components/ui/Logo";
import { ProfileDropdown } from "@/components/layout/ProfileDropdown";
import { StoreItem, StoreCategory } from "@/types/store";
import {
  getKeywordSuggestions,
  getCategoryScopedSuggestions,
  getTopSuggestedProducts,
} from "@/utils/searchHelper";

interface HeaderProps {
  storeName?: string;
  storeImage?: string;
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  categories?: StoreCategory[];
  items?: StoreItem[];
  isCartBouncing?: boolean;
  user?: { name: string; mobile: string } | null;
  deliveryLocation?: { city: string; pincode: string };
  onSearchChange: (v: string) => void;
  onSearchSubmit?: (v: string) => void;
  onSearchCancel?: () => void;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onProfileClick: () => void;
  onProductClick?: (item: StoreItem) => void;
  onCategoryClick?: (id: string) => void;
  onOrdersClick?: () => void;
  onAddressesClick?: () => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  onLogoClick: () => void;
  onMobileMenuClick?: () => void;
  onLocationClick?: () => void;
}

export function Header({
  storeName = "vCartify",
  storeImage,
  cartCount,
  wishlistCount,
  searchQuery,
  categories = [],
  items = [],
  isCartBouncing = false,
  user,
  deliveryLocation = { city: "Tirupur", pincode: "641604" },
  onSearchChange,
  onSearchSubmit,
  onSearchCancel,
  onCartClick,
  onWishlistClick,
  onProfileClick,
  onProductClick,
  onCategoryClick,
  onOrdersClick,
  onAddressesClick,
  onNotificationsClick,
  onSettingsClick,
  onLogout,
  onLogoClick,
  onMobileMenuClick,
  onLocationClick,
}: HeaderProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside either desktop or mobile search container
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      const inDesktop = searchContainerRef.current?.contains(target) ?? false;
      const inMobile = mobileSearchRef.current?.contains(target) ?? false;
      if (!inDesktop && !inMobile) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Recent searches state (stored in localStorage, max 5 items)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("vcartify_recent_searches");
      return saved ? JSON.parse(saved) : ["A4 Paper", "Pencil", "Masala"];
    } catch {
      return ["A4 Paper", "Pencil", "Masala"];
    }
  });

  const saveRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches((prev) => {
      const updated = [clean, ...prev.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
      try {
        localStorage.setItem("vcartify_recent_searches", JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
    });
  };

  const removeRecentSearch = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== termToRemove);
      try {
        localStorage.setItem("vcartify_recent_searches", JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
    });
  };

  const clearAllRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem("vcartify_recent_searches");
    } catch {
      /* ignore */
    }
  };

  const trimmedQuery = searchQuery.trim().toLowerCase();

  // ─── FLIPKART-STYLE AUTO SEARCH SUGGESTIONS ───
  // 1. Keyword completions (e.g. "a4" -> "a4 paper", "a4 sheet")
  const keywordSuggestions = useMemo(() => {
    return getKeywordSuggestions(items, categories, searchQuery, 8);
  }, [items, categories, searchQuery]);

  // 2. Category-scoped suggestions (e.g. "search 'a4' in Papers", "search 'pen' in Stationaries")
  const categoryScopedSuggestions = useMemo(() => {
    return getCategoryScopedSuggestions(items, categories, searchQuery, 2);
  }, [categories, items, searchQuery]);

  // 3. Product thumbnail suggestions (up to 4 products)
  const suggestedProducts = useMemo(() => {
    return getTopSuggestedProducts(items, searchQuery, categories, 4);
  }, [items, searchQuery, categories]);

  const suggestedCategories = useMemo(() => {
    if (!trimmedQuery) return [];
    return categories
      .filter(
        (c) =>
          c.Text.toLowerCase().includes(trimmedQuery) &&
          c.Text.toLowerCase() !== "all"
      )
      .slice(0, 3);
  }, [categories, trimmedQuery]);

  // Popular Searches & Curated Suggestion Categories
  const popularSearches = useMemo(() => {
    return [
      "A4 Paper 70GSM",
      "Masala & Spices",
      "Chess Board Big",
      "Cutter",
      "Apsara Platinum Pencil",
      "Notebook Set",
      "Cloth Courier Cover",
      "Dictionary",
    ];
  }, []);

  const topSuggestionCategories = useMemo(() => {
    return categories
      .filter((c) => c && c.Text && c.Text.toLowerCase() !== "all")
      .slice(0, 8);
  }, [categories]);

  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  useEffect(() => {
    setSelectedSuggestionIndex(-1);
  }, [searchQuery, isSearchFocused]);

  // Combined suggestions list for seamless keyboard arrow navigation
  const desktopSuggestionsList = useMemo(() => {
    if (!trimmedQuery) return [];
    const list: {
      type: "category-scope" | "keyword" | "product";
      payload: string | StoreItem;
    }[] = [];

    categoryScopedSuggestions.forEach((s) => {
      list.push({ type: "category-scope", payload: s.categoryName });
    });
    keywordSuggestions.slice(0, 6).forEach((k) => {
      list.push({ type: "keyword", payload: k });
    });
    suggestedProducts.forEach((p) => {
      list.push({ type: "product", payload: p });
    });
    return list;
  }, [trimmedQuery, categoryScopedSuggestions, keywordSuggestions, suggestedProducts]);

  // Show suggestions dropdown whenever user clicks / focuses the search bar
  const showSuggestions = isSearchFocused;

  const handleSelectProduct = (product: StoreItem) => {
    saveRecentSearch(product.ItemName);
    setIsSearchFocused(false);
    setShowMobileSearch(false);
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const handleSelectCategory = (catText: string) => {
    saveRecentSearch(catText);
    setIsSearchFocused(false);
    setShowMobileSearch(false);
    onSearchChange("");
    if (onCategoryClick) {
      onCategoryClick(catText.toLowerCase());
    }
  };

  const handleSearchSubmit = () => {
    const q = searchQuery.trim();
    if (q) {
      saveRecentSearch(q);
      if (onSearchSubmit) {
        onSearchSubmit(q);
      }
    }
    setIsSearchFocused(false);
    setShowMobileSearch(false);
  };

  const logoUrl = storeImage
    ? `data:image/png;base64,${storeImage}`
    : undefined;

  const hasBackendLogo = Boolean(logoUrl);

  const handleProfileButtonClick = () => {
    if (user) {
      setShowProfileDropdown(!showProfileDropdown);
    } else {
      onProfileClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 shadow-sm border-b border-[#e5ddd0] bg-[#faf7f2]/95 backdrop-blur-md">
      <div className="text-[#20291e]">
        <div className="mx-auto w-full max-w-[1920px] px-2.5 sm:px-4 lg:px-6 xl:px-8">

          {/* Desktop Row */}
          <div className="hidden sm:flex items-center h-[62px] gap-2 lg:gap-3">
            {/* Logo */}
            <button
              onClick={onLogoClick}
              className="shrink-0 p-1.5 rounded-lg border border-transparent hover:border-[#384a35] transition-colors"
              aria-label="Home"
            >
              {hasBackendLogo ? (
                <img
                  src={logoUrl}
                  alt={storeName}
                  className="h-9 lg:h-10 w-auto object-contain"
                />
              ) : (
                <div className="flex items-center gap-1.5">
                  <Logo size="sm" variant="image-only" />
                  <span className="text-xl lg:text-2xl font-serif font-bold text-[#20291e] tracking-tight">
                    {storeName}
                  </span>
                </div>
              )}
            </button>

            {/* ✨ Deliver to — CLICKABLE */}
            <button
              onClick={onLocationClick}
              className="hidden xl:flex items-center gap-1.5 h-11 px-2.5 rounded-lg border border-transparent hover:border-[#384a35] hover:bg-[#f0ebe1] transition-all group"
            >
              <MapPin size={18} className="text-[#455840] shrink-0 mt-3 group-hover:text-[#2d3a2a] transition-colors" strokeWidth={2.5} />
              <div className="flex flex-col items-start leading-tight text-left">
                <span className="text-[11px] text-[#6d7568] font-semibold">
                  Delivering to {deliveryLocation.city}
                </span>
                <span className="text-sm font-bold text-[#20291e] flex items-center gap-0.5">
                  {deliveryLocation.pincode}
                  <ChevronDown size={12} className="text-[#6d7568]" strokeWidth={2.5} />
                </span>
              </div>
            </button>

            {/* Clean Search Bar with Suggestions */}
            <div ref={searchContainerRef} className="relative flex-1 min-w-0">
              <div className="flex items-stretch h-11 rounded-lg overflow-hidden shadow-xs min-w-0 border border-[#d8cfbf] focus-within:border-[#384a35] focus-within:ring-2 focus-within:ring-[#384a35]/20 transition-all bg-white">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      if (desktopSuggestionsList.length > 0) {
                        e.preventDefault();
                        setSelectedSuggestionIndex((prev) =>
                          prev < desktopSuggestionsList.length - 1 ? prev + 1 : 0
                        );
                      }
                    } else if (e.key === "ArrowUp") {
                      if (desktopSuggestionsList.length > 0) {
                        e.preventDefault();
                        setSelectedSuggestionIndex((prev) =>
                          prev > 0 ? prev - 1 : desktopSuggestionsList.length - 1
                        );
                      }
                    } else if (e.key === "Enter") {
                      if (
                        selectedSuggestionIndex >= 0 &&
                        selectedSuggestionIndex < desktopSuggestionsList.length
                      ) {
                        e.preventDefault();
                        const selected = desktopSuggestionsList[selectedSuggestionIndex];
                        if (selected.type === "category-scope") {
                          handleSelectCategory(selected.payload as string);
                        } else if (selected.type === "keyword") {
                          const term = selected.payload as string;
                          onSearchChange(term);
                          saveRecentSearch(term);
                          if (onSearchSubmit) onSearchSubmit(term);
                          setIsSearchFocused(false);
                        } else if (selected.type === "product") {
                          handleSelectProduct(selected.payload as StoreItem);
                        }
                      } else {
                        handleSearchSubmit();
                      }
                      (e.target as HTMLInputElement).blur();
                    } else if (e.key === "Escape") {
                      setIsSearchFocused(false);
                      setSelectedSuggestionIndex(-1);
                      (e.target as HTMLInputElement).blur();
                      if (searchQuery) {
                        onSearchChange("");
                        onSearchCancel?.();
                      }
                    }
                  }}
                  placeholder={`Search curated products in ${storeName}...`}
                  className="flex-1 min-w-0 px-4 text-sm font-medium text-[#20291e] placeholder:text-[#9c9586] focus:outline-none bg-white"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      onSearchChange("");
                      setIsSearchFocused(false);
                      onSearchCancel?.();
                    }}
                    className="px-2 text-[#7f8a7a] hover:text-[#20291e] transition-colors cursor-pointer"
                    title="Cancel search"
                  >
                    <X size={16} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  aria-label="Search"
                  className="shrink-0 w-12 lg:w-14 bg-[#384a35] hover:bg-[#283626] flex items-center justify-center transition-colors text-[#faf7f2] cursor-pointer"
                >
                  <Search size={19} className="text-[#faf7f2]" strokeWidth={2.5} />
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#fcfaf6] rounded-2xl border border-[#d8cfbf] shadow-2xl z-50 overflow-hidden animate-page-entrance max-h-[480px] overflow-y-auto">
                  {/* ─── EMPTY QUERY: RECENT SEARCHES (MAX 5) FOLLOWED BY POPULAR SEARCHES ─── */}
                  {!trimmedQuery ? (
                    <div className="p-4 space-y-4">
                      {/* 1. Recent Searches (Maximum 5 items) */}
                      {recentSearches.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#384a35]">
                              <Clock size={13} strokeWidth={2.3} />
                              <span>Recent Searches</span>
                            </div>
                            <button
                              type="button"
                              onClick={clearAllRecentSearches}
                              className="text-[11px] font-semibold text-[#8a8275] hover:text-[#9c4124] transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 size={11} />
                              <span>Clear all</span>
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {recentSearches.slice(0, 5).map((term) => (
                              <div
                                key={term}
                                onClick={() => {
                                  onSearchChange(term);
                                  saveRecentSearch(term);
                                  if (onSearchSubmit) onSearchSubmit(term);
                                  setIsSearchFocused(false);
                                }}
                                className="group inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl bg-white hover:bg-[#384a35] text-[#20291e] hover:text-[#faf7f2] text-xs font-semibold border border-[#d8cfbf] hover:border-[#384a35] transition-all cursor-pointer shadow-2xs"
                              >
                                <Clock size={12} className="text-[#6d7568] group-hover:text-[#faf7f2]" />
                                <span>{term}</span>
                                <button
                                  type="button"
                                  onClick={(e) => removeRecentSearch(term, e)}
                                  className="p-0.5 rounded-md hover:bg-black/10 text-[#8a8275] group-hover:text-white transition-colors"
                                  title={`Remove ${term}`}
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 2. Followed by Popular Searches */}
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9c4124] mb-2.5">
                          <Flame size={14} className="fill-[#9c4124]" />
                          <span>Popular Searches</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {popularSearches.map((term) => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => {
                                onSearchChange(term);
                                saveRecentSearch(term);
                                if (onSearchSubmit) onSearchSubmit(term);
                                setIsSearchFocused(false);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f5f0e6] hover:bg-[#384a35] hover:text-[#faf7f2] text-[#20291e] text-xs font-semibold border border-[#d8cfbf] hover:border-[#384a35] transition-all cursor-pointer group shadow-2xs"
                            >
                              <TrendingUp size={12} className="text-[#384a35] group-hover:text-[#faf7f2]" />
                              <span>{term}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 3. Followed by Suggestion Categories */}
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#384a35] mb-2.5">
                          <Sparkles size={14} />
                          <span>Suggested Categories</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {topSuggestionCategories.map((c) => (
                            <button
                              key={c.Value}
                              type="button"
                              onClick={() => handleSelectCategory(c.Text)}
                              className="flex items-center gap-2 p-2.5 rounded-xl bg-white hover:bg-[#ede5d7] border border-[#d8cfbf] text-left transition-all group cursor-pointer shadow-2xs"
                            >
                              <div className="h-7 w-7 rounded-lg bg-[#384a35]/10 group-hover:bg-[#384a35] group-hover:text-[#faf7f2] text-[#384a35] flex items-center justify-center shrink-0 transition-colors">
                                <Tag size={13} />
                              </div>
                              <span className="text-xs font-bold text-[#20291e] truncate group-hover:text-[#384a35]">
                                {c.Text}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ─── FLIPKART-STYLE LIVE SEARCH SUGGESTIONS WHILE TYPING ─── */
                    <div className="py-2 divide-y divide-[#e5ddd0]/60">
                      {/* 1. Category-Scoped Suggestions: "search 'query' in Category" */}
                      {categoryScopedSuggestions.length > 0 && (
                        <div className="py-1">
                          {categoryScopedSuggestions.map((scope, scopeIdx) => {
                            const isSelected = selectedSuggestionIndex === scopeIdx;
                            return (
                              <button
                                key={scope.categoryName}
                                type="button"
                                onClick={() => {
                                  handleSelectCategory(scope.categoryName);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-[#ede5d7] text-left transition-colors cursor-pointer group ${
                                  isSelected ? "bg-[#ede5d7] ring-1 ring-[#384a35]/30" : ""
                                }`}
                              >
                                <Search size={15} className="text-[#384a35] shrink-0" />
                                <span className="text-xs sm:text-sm text-[#20291e] flex-1">
                                  <span className="font-bold text-[#384a35]">"{searchQuery}"</span> in{" "}
                                  <span className="font-semibold text-[#8b3a2b]">{scope.categoryName}</span>
                                </span>
                                <span className="text-[11px] font-semibold text-[#5c6e56] uppercase tracking-wider group-hover:text-[#384a35]">
                                  in category →
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* 2. Direct Keyword Auto-Completions with matched text highlight */}
                      {keywordSuggestions.length > 0 && (
                        <div className="py-1">
                          {keywordSuggestions.slice(0, 6).map((term, termIdx) => {
                            const globalIdx = categoryScopedSuggestions.length + termIdx;
                            const isSelected = selectedSuggestionIndex === globalIdx;
                            const matchIndex = term.toLowerCase().indexOf(trimmedQuery);
                            const before = matchIndex >= 0 ? term.slice(0, matchIndex) : term;
                            const match = matchIndex >= 0 ? term.slice(matchIndex, matchIndex + trimmedQuery.length) : "";
                            const after = matchIndex >= 0 ? term.slice(matchIndex + trimmedQuery.length) : "";

                            return (
                              <button
                                key={term}
                                type="button"
                                onClick={() => {
                                  onSearchChange(term);
                                  saveRecentSearch(term);
                                  if (onSearchSubmit) onSearchSubmit(term);
                                  setIsSearchFocused(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-[#ede5d7] text-left transition-colors cursor-pointer group ${
                                  isSelected ? "bg-[#ede5d7] ring-1 ring-[#384a35]/30" : ""
                                }`}
                              >
                                <Search size={14} className="text-[#8c9787] group-hover:text-[#384a35] shrink-0" />
                                <span className="text-xs sm:text-sm text-[#20291e] flex-1 truncate">
                                  {matchIndex >= 0 ? (
                                    <>
                                      {before}
                                      <strong className="text-[#384a35] font-extrabold">{match}</strong>
                                      {after}
                                    </>
                                  ) : (
                                    <span>{term}</span>
                                  )}
                                </span>
                                <ArrowRight size={13} className="text-[#8c9787] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* 3. Product Cards Preview with Price & Discount */}
                      {suggestedProducts.length > 0 && (
                        <div className="p-2 bg-[#fcfaf6]">
                          <p className="text-[10px] font-bold text-[#5c6e56] uppercase tracking-wider px-2 py-1">
                            Products
                          </p>
                          <div className="space-y-1">
                            {suggestedProducts.map((p, prodIdx) => {
                              const globalIdx =
                                categoryScopedSuggestions.length +
                                Math.min(keywordSuggestions.length, 6) +
                                prodIdx;
                              const isSelected = selectedSuggestionIndex === globalIdx;
                              const disc =
                                p.MRP > p.SellingPrice
                                  ? Math.round(((p.MRP - p.SellingPrice) / p.MRP) * 100)
                                  : 0;
                              return (
                                <button
                                  key={p.ItemName}
                                  onClick={() => handleSelectProduct(p)}
                                  className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#ede5d7] transition-all text-left group cursor-pointer ${
                                    isSelected ? "bg-[#ede5d7] ring-1 ring-[#384a35]/30" : ""
                                  }`}
                                >
                                  <div className="h-10 w-10 rounded-lg bg-white border border-[#d8cfbf] flex items-center justify-center p-1 shrink-0 overflow-hidden">
                                    {p.FileUrl ? (
                                      <img
                                        src={p.FileUrl}
                                        alt={p.ItemName}
                                        className="h-full w-full object-contain group-hover:scale-110 transition-transform"
                                      />
                                    ) : (
                                      <span className="text-xs">📦</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm font-semibold text-[#20291e] truncate group-hover:text-[#384a35] transition-colors">
                                      {p.ItemName}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-xs font-bold text-[#384a35]">
                                        ₹{p.SellingPrice.toLocaleString()}
                                      </span>
                                      {disc > 0 && (
                                        <span className="text-[10px] text-[#9c4124] font-bold bg-[#9c4124]/10 px-1.5 rounded">
                                          {disc}% OFF
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <ArrowRight
                                    size={14}
                                    className="text-[#8c9787] group-hover:text-[#384a35] group-hover:translate-x-1 transition-all shrink-0"
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* No matches */}
                      {keywordSuggestions.length === 0 &&
                        suggestedProducts.length === 0 &&
                        suggestedCategories.length === 0 && (
                          <div className="p-6 text-center text-[#6f7a6b]">
                            <p className="text-sm font-medium">No direct suggestions for "{searchQuery}"</p>
                            <p className="text-xs mt-1 text-[#8b9586]">
                              Press Enter or click the search icon to search all items
                            </p>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist button (Desktop) */}
            <button
              onClick={onWishlistClick}
              aria-label={`Wishlist, ${wishlistCount} items`}
              className="hidden md:flex items-center h-11 px-2.5 rounded-lg border border-transparent hover:border-[#384a35] hover:bg-[#f0ebe1] transition-colors text-[#20291e] relative"
            >
              <div className="relative">
                <Heart
                  size={23}
                  strokeWidth={2}
                  className="text-[#2d3a2a]"
                  fill={wishlistCount > 0 ? "#8b3a2b" : "none"}
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[18px] h-4 px-1 rounded-full bg-[#8b3a2b] text-white text-[10px] font-bold flex items-center justify-center leading-none border border-white">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </button>

            {/* Sign in / User with Dropdown */}
            <div className="hidden md:block relative">
              <button
                onClick={handleProfileButtonClick}
                className="flex flex-col items-start justify-center h-11 px-2.5 rounded-lg border border-transparent hover:border-[#384a35] hover:bg-[#f0ebe1] transition-colors leading-tight text-[#20291e]"
              >
                <span className="text-[11px] text-[#6d7568] whitespace-nowrap font-medium">
                  {user ? "Hello," : "Welcome"}
                </span>
                <span className="text-sm font-bold text-[#20291e] flex items-center gap-0.5 whitespace-nowrap">
                  {user ? user.name.split(" ")[0] : "Account & Lists"}
                  <ChevronDown
                    size={11}
                    className={`transition-transform ${
                      showProfileDropdown ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              {user && (
                <ProfileDropdown
                  isOpen={showProfileDropdown}
                  user={user}
                  onClose={() => setShowProfileDropdown(false)}
                  onOrdersClick={onOrdersClick || (() => {})}
                  onWishlistClick={onWishlistClick}
                  onAddressesClick={onAddressesClick || (() => {})}
                  onNotificationsClick={onNotificationsClick || (() => {})}
                  onSettingsClick={onSettingsClick || (() => {})}
                  onLogout={onLogout || (() => {})}
                />
              )}
            </div>

            {/* Cart */}
            <button
              id="desktop-cart-button"
              onClick={onCartClick}
              aria-label={`Cart, ${cartCount} items`}
              className={`flex items-center h-11 px-3 rounded-lg bg-[#384a35] hover:bg-[#283626] transition-all text-[#faf7f2] shadow-xs cursor-pointer active:scale-95 ${
                isCartBouncing ? "animate-cart-bounce" : ""
              }`}
            >
              <div className="relative flex items-center">
                <ShoppingCart size={21} className="text-[#faf7f2]" strokeWidth={2} />
                {cartCount > 0 && (
                  <span
                    className={`absolute -top-2 -right-2 min-w-[18px] h-4.5 px-1 rounded-full bg-[#c89b3c] text-[#1b241a] text-[11px] font-extrabold flex items-center justify-center leading-none border border-[#faf7f2] ${
                      isCartBouncing ? "animate-badge-pop" : ""
                    }`}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline text-sm font-semibold ml-2 text-[#faf7f2]">
                Cart
              </span>
            </button>
          </div>

          {/* Mobile Row */}
          <div className="flex sm:hidden items-center justify-between h-14 gap-2">
            <button
              onClick={onMobileMenuClick}
              aria-label="Menu"
              className="p-2 rounded-lg hover:bg-[#f0ebe1] transition-colors"
            >
              <Menu size={24} strokeWidth={2.5} className="text-[#20291e]" />
            </button>

            <button
              onClick={onLogoClick}
              className="flex-1 flex justify-center"
              aria-label="Home"
            >
              {hasBackendLogo ? (
                <img
                  src={logoUrl}
                  alt={storeName}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <div className="flex items-center gap-1">
                  <Logo size="sm" variant="image-only" />
                  <span className="text-lg font-serif font-bold text-[#20291e]">
                    {storeName}
                  </span>
                </div>
              )}
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (showMobileSearch) {
                    if (searchQuery) {
                      onSearchChange("");
                      onSearchCancel?.();
                    }
                    setShowMobileSearch(false);
                    setIsSearchFocused(false);
                  } else {
                    setShowMobileSearch(true);
                  }
                }}
                aria-label="Search"
                className="p-2 rounded-lg hover:bg-[#f0ebe1] transition-colors text-[#20291e]"
              >
                {showMobileSearch ? (
                  <X size={22} strokeWidth={2.5} />
                ) : (
                  <Search size={22} strokeWidth={2.5} />
                )}
              </button>

              <button
                onClick={onWishlistClick}
                aria-label={`Wishlist, ${wishlistCount} items`}
                className="relative p-2 rounded-lg hover:bg-[#f0ebe1] transition-colors text-[#20291e]"
              >
                <Heart
                  size={22}
                  strokeWidth={2}
                  className="text-[#20291e]"
                  fill={wishlistCount > 0 ? "#8b3a2b" : "none"}
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-4 px-1 rounded-full bg-[#8b3a2b] text-white text-[10px] font-bold flex items-center justify-center leading-none border border-white">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                id="mobile-cart-button"
                onClick={onCartClick}
                aria-label={`Cart, ${cartCount} items`}
                className={`relative p-2 rounded-lg hover:bg-[#f0ebe1] transition-all text-[#20291e] active:scale-95 ${
                  isCartBouncing ? "animate-cart-bounce" : ""
                }`}
              >
                <ShoppingCart size={22} strokeWidth={2} className="text-[#20291e]" />
                {cartCount > 0 && (
                  <span
                    className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-4 px-1 rounded-full bg-[#384a35] text-[#faf7f2] text-[10px] font-bold flex items-center justify-center leading-none border border-white ${
                      isCartBouncing ? "animate-badge-pop" : ""
                    }`}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ✨ Mobile Location Bar */}
          <button
            onClick={onLocationClick}
            className="sm:hidden w-full flex items-center gap-2 py-2 border-t border-[#e5ddd0] hover:bg-[#f0ebe1] transition-colors px-1"
          >
            <MapPin size={15} className="text-[#455840] shrink-0" strokeWidth={2.5} />
            <span className="text-xs text-[#525a4e] font-medium">
              Deliver to {deliveryLocation.city} <span className="font-bold text-[#20291e]">{deliveryLocation.pincode}</span>
            </span>
            <ChevronDown size={14} className="text-[#6d7568] ml-auto" strokeWidth={2.5} />
          </button>

          {/* Mobile Search Bar with Suggestions */}
          {showMobileSearch && (
            <div ref={mobileSearchRef} className="sm:hidden pb-3 pt-1 relative">
              <div className="flex items-stretch h-10 rounded-lg overflow-hidden border border-[#384a35] bg-white shadow-xs">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchSubmit();
                      (e.target as HTMLInputElement).blur();
                    } else if (e.key === "Escape") {
                      setIsSearchFocused(false);
                      (e.target as HTMLInputElement).blur();
                      if (searchQuery) {
                        onSearchChange("");
                        onSearchCancel?.();
                      }
                    }
                  }}
                  placeholder="Search products..."
                  autoFocus
                  className="flex-1 min-w-0 px-3 text-sm font-medium text-[#20291e] placeholder:text-[#9c9586] focus:outline-none bg-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      onSearchChange("");
                      setIsSearchFocused(false);
                      setShowMobileSearch(false);
                      onSearchCancel?.();
                    }}
                    className="px-2 text-[#7f8a7a] hover:text-[#20291e] transition-colors"
                    title="Cancel search"
                  >
                    <X size={15} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  aria-label="Search"
                  className="shrink-0 w-12 bg-[#384a35] text-[#faf7f2] flex items-center justify-center cursor-pointer"
                >
                  <Search size={18} className="text-[#faf7f2]" strokeWidth={2.5} />
                </button>
              </div>

              {/* Mobile Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#fcfaf6] rounded-xl border border-[#d8cfbf] shadow-2xl z-50 overflow-hidden animate-page-entrance max-h-[380px] overflow-y-auto">
                  {!trimmedQuery ? (
                    <div className="p-3 space-y-3">
                      {/* 1. Recent Searches (Maximum 5 items) */}
                      {recentSearches.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#384a35]">
                              <Clock size={12} strokeWidth={2.3} />
                              <span>Recent Searches</span>
                            </div>
                            <button
                              type="button"
                              onClick={clearAllRecentSearches}
                              className="text-[10px] font-semibold text-[#8a8275] hover:text-[#9c4124]"
                            >
                              Clear
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {recentSearches.slice(0, 5).map((term) => (
                              <div
                                key={term}
                                onClick={() => {
                                  onSearchChange(term);
                                  saveRecentSearch(term);
                                  if (onSearchSubmit) onSearchSubmit(term);
                                  setIsSearchFocused(false);
                                  setShowMobileSearch(false);
                                }}
                                className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg bg-white border border-[#d8cfbf] text-xs font-semibold text-[#20291e]"
                              >
                                <Clock size={11} className="text-[#6d7568]" />
                                <span>{term}</span>
                                <button
                                  type="button"
                                  onClick={(e) => removeRecentSearch(term, e)}
                                  className="p-0.5 text-[#8a8275] hover:text-[#9c4124]"
                                >
                                  <X size={11} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 2. Popular Searches */}
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#9c4124] mb-2">
                          <Flame size={13} className="fill-[#9c4124]" />
                          <span>Popular Searches</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {popularSearches.map((term) => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => {
                                onSearchChange(term);
                                saveRecentSearch(term);
                                if (onSearchSubmit) onSearchSubmit(term);
                                setIsSearchFocused(false);
                                setShowMobileSearch(false);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f5f0e6] text-[#20291e] text-xs font-semibold border border-[#d8cfbf]"
                            >
                              <TrendingUp size={11} className="text-[#384a35]" />
                              <span>{term}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Suggested Categories */}
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#384a35] mb-2">
                          <Sparkles size={13} />
                          <span>Suggested Categories</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {topSuggestionCategories.map((c) => (
                            <button
                              key={c.Value}
                              type="button"
                              onClick={() => handleSelectCategory(c.Text)}
                              className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-[#d8cfbf] text-left text-xs font-bold text-[#20291e]"
                            >
                              <Tag size={12} className="text-[#384a35] shrink-0" />
                              <span className="truncate">{c.Text}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ─── FLIPKART-STYLE LIVE SEARCH SUGGESTIONS WHILE TYPING (MOBILE) ─── */
                    <div className="py-2 divide-y divide-[#e5ddd0]/60">
                      {/* 1. Category-Scoped Suggestions: "search 'query' in Category" */}
                      {categoryScopedSuggestions.length > 0 && (
                        <div className="py-1">
                          {categoryScopedSuggestions.map((scope) => (
                            <button
                              key={scope.categoryName}
                              type="button"
                              onClick={() => {
                                handleSelectCategory(scope.categoryName);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#ede5d7] text-left transition-colors cursor-pointer group"
                            >
                              <Search size={14} className="text-[#384a35] shrink-0" />
                              <span className="text-xs text-[#20291e] flex-1">
                                <span className="font-bold text-[#384a35]">"{searchQuery}"</span> in{" "}
                                <span className="font-semibold text-[#8b3a2b]">{scope.categoryName}</span>
                              </span>
                              <span className="text-[10px] font-semibold text-[#5c6e56] uppercase tracking-wider">
                                in category →
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* 2. Direct Keyword Auto-Completions with matched text highlight */}
                      {keywordSuggestions.length > 0 && (
                        <div className="py-1">
                          {keywordSuggestions.slice(0, 5).map((term) => {
                            const matchIndex = term.toLowerCase().indexOf(trimmedQuery);
                            const before = matchIndex >= 0 ? term.slice(0, matchIndex) : term;
                            const match = matchIndex >= 0 ? term.slice(matchIndex, matchIndex + trimmedQuery.length) : "";
                            const after = matchIndex >= 0 ? term.slice(matchIndex + trimmedQuery.length) : "";

                            return (
                              <button
                                key={term}
                                type="button"
                                onClick={() => {
                                  onSearchChange(term);
                                  saveRecentSearch(term);
                                  if (onSearchSubmit) onSearchSubmit(term);
                                  setIsSearchFocused(false);
                                  setShowMobileSearch(false);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#ede5d7] text-left transition-colors cursor-pointer group"
                              >
                                <Search size={13} className="text-[#8c9787] group-hover:text-[#384a35] shrink-0" />
                                <span className="text-xs text-[#20291e] flex-1 truncate">
                                  {matchIndex >= 0 ? (
                                    <>
                                      {before}
                                      <strong className="text-[#384a35] font-extrabold">{match}</strong>
                                      {after}
                                    </>
                                  ) : (
                                    <span>{term}</span>
                                  )}
                                </span>
                                <ArrowRight size={12} className="text-[#8c9787] shrink-0" />
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* 3. Product Cards Preview with Price & Discount */}
                      {suggestedProducts.length > 0 && (
                        <div className="p-2 bg-[#fcfaf6]">
                          <p className="text-[10px] font-bold text-[#5c6e56] uppercase tracking-wider px-1 py-1">
                            Products
                          </p>
                          <div className="space-y-1">
                            {suggestedProducts.map((p) => {
                              const disc =
                                p.MRP > p.SellingPrice
                                    ? Math.round(((p.MRP - p.SellingPrice) / p.MRP) * 100)
                                    : 0;
                              return (
                                <button
                                  key={p.ItemName}
                                  onClick={() => handleSelectProduct(p)}
                                  className="w-full flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#ede5d7] transition-all text-left group cursor-pointer"
                                >
                                  <div className="h-9 w-9 rounded-md bg-white border border-[#d8cfbf] flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
                                    {p.FileUrl ? (
                                      <img
                                        src={p.FileUrl}
                                        alt={p.ItemName}
                                        className="h-full w-full object-contain"
                                      />
                                    ) : (
                                      <span className="text-xs">📦</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-[#20291e] truncate group-hover:text-[#384a35]">
                                      {p.ItemName}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <span className="text-xs font-bold text-[#384a35]">
                                        ₹{p.SellingPrice.toLocaleString()}
                                      </span>
                                      {disc > 0 && (
                                        <span className="text-[9px] text-[#9c4124] font-bold bg-[#9c4124]/10 px-1 rounded">
                                          {disc}% OFF
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <ArrowRight size={12} className="text-[#8c9787] shrink-0" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* No matches */}
                      {keywordSuggestions.length === 0 &&
                        suggestedProducts.length === 0 &&
                        suggestedCategories.length === 0 && (
                          <div className="p-4 text-center text-[#6f7a6b]">
                            <p className="text-xs font-medium">No direct suggestions for "{searchQuery}"</p>
                            <p className="text-[11px] mt-1 text-[#8b9586]">
                              Press Enter or search icon to search all items
                            </p>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}