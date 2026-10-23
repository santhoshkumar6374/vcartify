import { useState, useMemo, useEffect } from "react";
import {
  LayoutGrid,
  List,
  Package,
  SlidersHorizontal,
  X,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Flame,
  Zap,
  Tag,
  Timer,
  ShoppingBag,
  ArrowRight,
  Star,
  BadgePercent,
} from "lucide-react";
import { StoreItem, StoreCategory } from "@/types/store";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import {
  ProductCard,
  ProductCardSkeleton,
  getProductRating,
  getProductReviews,
} from "@/components/products/ProductCard";
import {
  ProductFilters,
  FilterState,
  INITIAL_FILTER_STATE,
  matchesPriceRange,
  getPriceRangeLabel,
  extractPackSizesForItems,
  matchesPackSize,
  getPackSizeLabel,
  countActiveFilters,
} from "@/components/products/ProductFilters";
import {
  getCategoryIconComponent,
  getSubcategoriesForItems,
} from "@/components/layout/CategoryNav";
import { scoreProductSearch } from "@/utils/searchHelper";

interface Props {
  items: StoreItem[];
  allItems?: StoreItem[];
  categories?: StoreCategory[];
  activeCategory?: string;
  categoryName: string;
  searchQuery?: string;
  wishlist: string[];
  onAddToCart: (item: StoreItem, e?: React.MouseEvent) => void;
  onToggleWishlist: (name: string) => void;
  onProductClick: (item: StoreItem) => void;
  onQuickView?: (item: StoreItem) => void;
  onCategorySelect?: (id: string) => void;
  onSearchChange?: (q: string) => void;
  onSearchCancel?: () => void;
  onHomeClick: () => void;
}

export const SORT_OPTIONS = [
  { id: "relevance", label: "Relevance" },
  { id: "popularity", label: "Popularity" },
  { id: "newest", label: "Newest Arrivals" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "rating", label: "Customer Rating" },
  { id: "discount", label: "Highest Discount" },
];

const PAGE_SIZE = 18;

function getProductImageUrl(item?: StoreItem | null): string | null {
  if (!item) return null;
  const raw = item.FileUrl || item.ImageUrl;
  if (!raw || !raw.trim()) return null;
  if (
    raw.startsWith("data:") ||
    raw.startsWith("http") ||
    raw.startsWith("/")
  ) {
    return raw;
  }
  return `data:image/jpeg;base64,${raw}`;
}

export function ProductListPage({
  items,
  allItems = [],
  activeCategory = "all",
  categoryName,
  searchQuery = "",
  wishlist,
  onAddToCart,
  onToggleWishlist,
  onProductClick,
  onQuickView,
  onCategorySelect,
  onSearchChange,
  onSearchCancel,
  onHomeClick,
}: Props) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isFiltering, setIsFiltering] = useState(false);
  const [dealSlide, setDealSlide] = useState(0);
  const [isAdPaused, setIsAdPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 45,
    seconds: 19,
  });

  // Reset category-specific filters and deal slide when switching category
  useEffect(() => {
    setDealSlide(0);
    setFilters((prev) => ({
      ...prev,
      subcategory: null,
      packSize: null,
    }));
  }, [activeCategory]);

  // Live countdown timer for category deal banner
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 30, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute top discounted / best deal items specifically for this category
  const categoryDeals = useMemo(() => {
    const source = items.length > 0 ? items : allItems;
    const inStock = source.filter((item) => (item.AvailableStock ?? 10) > 0);
    const pool = inStock.length > 0 ? inStock : source;

    return [...pool]
      .map((item) => {
        const discount =
          item.MRP > item.SellingPrice
            ? Math.round(((item.MRP - item.SellingPrice) / item.MRP) * 100)
            : 18;
        const fakeOriginal =
          item.MRP > item.SellingPrice
            ? item.MRP
            : Math.round(item.SellingPrice * 1.22);
        const savings = Math.max(10, fakeOriginal - item.SellingPrice);
        return {
          item,
          discount,
          fakeOriginal,
          savings,
          rating: getProductRating(item),
          reviews: getProductReviews(item),
        };
      })
      .sort((a, b) => b.discount - a.discount || b.savings - a.savings);
  }, [items, allItems]);

  const sliderDeals = useMemo(
    () => categoryDeals.slice(0, 4),
    [categoryDeals]
  );

  const sideOfferDeals = useMemo(() => {
    if (categoryDeals.length >= 6) return categoryDeals.slice(4, 6);
    if (categoryDeals.length >= 3) return categoryDeals.slice(1, 3);
    return categoryDeals.slice(0, 2);
  }, [categoryDeals]);

  const maxCategoryDiscount = useMemo(() => {
    if (categoryDeals.length === 0) return 30;
    return Math.max(20, categoryDeals[0].discount);
  }, [categoryDeals]);

  // Auto-advance category deal banner every 4.2s
  useEffect(() => {
    if (isAdPaused || sliderDeals.length <= 1) return;
    const t = setInterval(() => {
      setDealSlide((prev) => (prev + 1) % sliderDeals.length);
    }, 4200);
    return () => clearInterval(t);
  }, [isAdPaused, sliderDeals.length]);

  // Brief skeleton shimmer when category or filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setIsFiltering(true);
    const t = setTimeout(() => setIsFiltering(false), 160);
    return () => clearTimeout(t);
  }, [activeCategory, filters, sortBy]);

  // Dynamic subcategories & pack sizes based on the current category's items
  const availableSubcategories = useMemo(
    () => getSubcategoriesForItems(items),
    [items]
  );

  const availablePackSizes = useMemo(
    () => extractPackSizesForItems(items),
    [items]
  );

  const availableBrands = useMemo(() => {
    const source = items.length > 0 ? items : allItems;
    const set = new Set<string>();
    source.forEach((item) => {
      const b = item.StoreName || item.VendorName;
      if (b && b.trim()) set.add(b.trim());
    });
    return Array.from(set).slice(0, 8);
  }, [allItems, items]);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (filters.subcategory) {
      const subRule = availableSubcategories.find(
        (s) => s.id === filters.subcategory
      );
      if (subRule) {
        result = result.filter((item) => {
          const text = `${item.ItemName} ${item.Description || ""}`.toLowerCase();
          return subRule.keywords.some((kw) =>
            text.includes(kw.toLowerCase())
          );
        });
      }
    }

    if (filters.inStockOnly) {
      result = result.filter((item) => (item.AvailableStock ?? 10) > 0);
    }

    if (filters.vcratifyAssured) {
      result = result.filter((item) => getProductRating(item) >= 4.0);
    }

    if (filters.packSize) {
      result = result.filter((item) => matchesPackSize(item, filters.packSize));
    }

    if (filters.brand) {
      result = result.filter((item) => {
        const itemBrand =
          item.StoreName || item.VendorName || "VCartify Exclusive";
        return itemBrand.toLowerCase().includes(filters.brand!.toLowerCase());
      });
    }

    if (filters.priceRange) {
      result = result.filter((item) =>
        matchesPriceRange(item.SellingPrice, filters.priceRange)
      );
    }

    if (filters.minRating) {
      result = result.filter(
        (item) => getProductRating(item) >= (filters.minRating ?? 0)
      );
    }

    if (filters.discount) {
      const minDiscount = parseInt(filters.discount, 10);
      result = result.filter((item) => {
        if (item.MRP <= item.SellingPrice) return false;
        const disc = ((item.MRP - item.SellingPrice) / item.MRP) * 100;
        return disc >= minDiscount;
      });
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.SellingPrice - b.SellingPrice);
        break;
      case "price-high":
        result.sort((a, b) => b.SellingPrice - a.SellingPrice);
        break;
      case "rating":
        result.sort((a, b) => getProductRating(b) - getProductRating(a));
        break;
      case "popularity":
        result.sort((a, b) => getProductReviews(b) - getProductReviews(a));
        break;
      case "discount":
        result.sort((a, b) => {
          const discA =
            a.MRP > a.SellingPrice ? (a.MRP - a.SellingPrice) / a.MRP : 0;
          const discB =
            b.MRP > b.SellingPrice ? (b.MRP - b.SellingPrice) / b.MRP : 0;
          return discB - discA;
        });
        break;
      case "newest":
        result.reverse();
        break;
      case "relevance":
      default:
        if (searchQuery && searchQuery.trim()) {
          const q = searchQuery.trim();
          result.sort((a, b) => {
            const scoreB = scoreProductSearch(b, q, categoryName);
            const scoreA = scoreProductSearch(a, q, categoryName);
            return scoreB - scoreA;
          });
        }
        break;
    }

    return result;
  }, [items, availableSubcategories, filters, sortBy, searchQuery, categoryName]);

  const displayedItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount]
  );

  const hasMore = visibleCount < filteredItems.length;
  const activeFilterCount = countActiveFilters(filters);

  const handleResetAll = () => {
    setFilters(INITIAL_FILTER_STATE);
    if (searchQuery) {
      if (onSearchCancel) {
        onSearchCancel();
      } else if (onSearchChange) {
        onSearchChange("");
      }
    }
  };

  const activeSubcategoryLabel = availableSubcategories.find(
    (s) => s.id === filters.subcategory
  )?.label;

  return (
    <div className="bg-gradient-to-b from-[#f5f0e6]/70 via-[#f9f6f0] to-[#f9f6f0] min-h-screen animate-page-entrance">
      <div className="mx-auto w-full max-w-[1920px] px-2.5 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", onClick: onHomeClick },
            ...(searchQuery.trim()
              ? [
                  ...(activeCategory !== "all"
                    ? [{ label: categoryName, onClick: () => onCategorySelect?.(activeCategory) }]
                    : []),
                  { label: `Search: "${searchQuery.trim()}"` },
                ]
              : activeCategory !== "all"
              ? [
                  { label: "All Products", onClick: () => onCategorySelect?.("all") },
                  { label: categoryName },
                ]
              : [{ label: categoryName }]),
          ]}
        />

        {/* TOP OF PRODUCT LISTING: Category-Specific Product Deals & Offers Animated Ad Showcase */}
        {!searchQuery.trim() && sliderDeals.length > 0 && (
          <div
            className="mt-3 sm:mt-4 mb-5 rounded-3xl overflow-hidden border border-[#d8cfbf] bg-[#fcfaf6] shadow-md"
            onMouseEnter={() => setIsAdPaused(true)}
            onMouseLeave={() => setIsAdPaused(false)}
          >
            {/* 1. Animated Moving Offer Marquee Ticker for this Particular Category */}
            <div className="bg-gradient-to-r from-[#20291e] via-[#384a35] to-[#20291e] text-[#faf7f2] py-2 px-3 overflow-hidden border-b border-[#4a6046]/40">
              <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-[11px] sm:text-xs font-bold tracking-wider uppercase">
                {[0, 1].map((dup) => (
                  <div key={dup} className="flex items-center gap-8 shrink-0">
                    <span className="inline-flex items-center gap-1.5 text-[#f3d179]">
                      <Flame size={13} className="text-[#e38c6b]" />
                      {categoryName} Mega Deal Event — Save Up To{" "}
                      {maxCategoryDiscount}% OFF Today!
                    </span>
                    <span className="text-[#8a9e84]">•</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Zap size={13} className="text-[#f3d179]" />
                      Special Offer on {sliderDeals[0]?.item.ItemName} — Only ₹
                      {sliderDeals[0]?.item.SellingPrice}
                    </span>
                    <span className="text-[#8a9e84]">•</span>
                    <span className="inline-flex items-center gap-1.5 text-[#dce8d8]">
                      <BadgePercent size={13} className="text-[#f3d179]" />
                      Extra Instant Savings Across {items.length}{" "}
                      {categoryName} Products
                    </span>
                    <span className="text-[#8a9e84]">•</span>
                    <span className="inline-flex items-center gap-1.5 text-[#f3d179]">
                      <Sparkles size={13} />
                      VCartify Assured Quality & Fast Doorstep Delivery
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Main Animated Category Product Deal Ad + Particular Category Side Offer Ads */}
            <div className="p-3.5 sm:p-5 bg-gradient-to-br from-[#f6f1e6] via-[#fcfaf6] to-[#eef2ec]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                {/* Left (7 cols): Auto-Sliding Category Deal Banner with Moving Animations */}
                <div className="lg:col-span-7 relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#20291e] via-[#2d3b2a] to-[#384a35] text-[#faf7f2] p-4 sm:p-6 flex flex-col justify-between shadow-lg border border-[#4a6046]/50 min-h-[250px] sm:min-h-[270px]">
                  {/* Animated Shine Sweep */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="animate-shine-sweep absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>

                  {/* Decorative Glow Orbs */}
                  <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#c89b3c]/20 blur-2xl" />
                  <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#9c4124]/25 blur-2xl" />

                  {(() => {
                    const currentDeal =
                      sliderDeals[dealSlide % sliderDeals.length] ||
                      sliderDeals[0];
                    const CategoryIcon = getCategoryIconComponent(categoryName);

                    return (
                      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-auto">
                        {/* Ad Copy & Deal Action */}
                        <div className="sm:col-span-7 space-y-2.5 text-left">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#9c4124] text-[#faf7f2] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                              <Flame size={12} className="animate-bounce" />
                              {categoryName} Deal Ad
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-[#f3d179] text-[11px] font-bold border border-white/15">
                              <Timer size={11} />
                              {String(timeLeft.hours).padStart(2, "0")}h :{" "}
                              {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
                              {String(timeLeft.seconds).padStart(2, "0")}s
                            </span>
                          </div>

                          <h2
                            onClick={() => onProductClick(currentDeal.item)}
                            className="text-lg sm:text-xl lg:text-2xl font-serif font-bold text-[#faf7f2] hover:text-[#f3d179] transition-colors line-clamp-2 cursor-pointer leading-snug"
                          >
                            {currentDeal.item.ItemName}
                          </h2>

                          <div className="flex items-center gap-2 text-xs text-[#d6e0d3]">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 text-[#f3d179] font-bold">
                              <Star
                                size={11}
                                className="fill-[#f3d179] text-[#f3d179]"
                              />
                              {currentDeal.rating.toFixed(1)}
                            </span>
                            <span>({currentDeal.reviews} verified reviews)</span>
                            <span className="inline-flex items-center gap-1 text-[#c5d4c0]">
                              • <CategoryIcon size={12} /> {categoryName}
                            </span>
                          </div>

                          {/* Deal Pricing */}
                          <div className="flex flex-wrap items-baseline gap-2.5 pt-1">
                            <span className="text-2xl sm:text-3xl font-extrabold text-[#f3d179] tracking-tight">
                              ₹{currentDeal.item.SellingPrice}
                            </span>
                            <span className="text-xs sm:text-sm text-[#b2c2ae] line-through font-medium">
                              MRP ₹{currentDeal.fakeOriginal}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-lg bg-[#f3d179]/20 border border-[#f3d179]/40 text-[#f3d179] text-xs font-extrabold">
                              SAVE ₹{currentDeal.savings} ({currentDeal.discount}
                              % OFF)
                            </span>
                          </div>

                          {/* CTA Buttons */}
                          <div className="flex flex-wrap items-center gap-2.5 pt-2">
                            <button
                              type="button"
                              onClick={(e) => onAddToCart(currentDeal.item, e)}
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#c89b3c] to-[#b08328] hover:from-[#d4a849] hover:to-[#bc8e30] text-[#20291e] font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
                            >
                              <ShoppingBag size={15} strokeWidth={2.4} />
                              <span>Grab Deal Now</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onProductClick(currentDeal.item)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#faf7f2] font-bold text-xs border border-white/15 transition-all cursor-pointer"
                            >
                              <span>View Offer</span>
                              <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Floating Animated Product Card Image */}
                        <div className="sm:col-span-5 flex items-center justify-center relative">
                          <div
                            onClick={() => onProductClick(currentDeal.item)}
                            className="animate-deal-float relative h-36 w-36 sm:h-44 sm:w-44 rounded-2xl bg-[#fcfaf6] p-3 shadow-xl border-2 border-[#c89b3c]/50 flex items-center justify-center cursor-pointer group overflow-hidden"
                          >
                            {getProductImageUrl(currentDeal.item) ? (
                              <img
                                src={getProductImageUrl(currentDeal.item)!}
                                alt={currentDeal.item.ItemName}
                                className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500"
                              />
                            ) : (
                              <Package size={48} className="text-[#384a35]" />
                            )}

                            {/* Floating Discount Seal */}
                            <div className="absolute -top-2.5 -right-2.5 h-12 w-12 rounded-full bg-gradient-to-br from-[#9c4124] to-[#7c2f16] text-[#faf7f2] flex flex-col items-center justify-center shadow-lg border-2 border-[#fcfaf6] leading-none">
                              <span className="text-xs font-extrabold">
                                {currentDeal.discount}%
                              </span>
                              <span className="text-[8px] font-bold uppercase tracking-wider">
                                OFF
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Slider Dots & Prev/Next Controls */}
                  {sliderDeals.length > 1 && (
                    <div className="relative z-10 flex items-center justify-between pt-3 mt-3 border-t border-white/10">
                      <div className="flex items-center gap-1.5">
                        {sliderDeals.map((d, idx) => (
                          <button
                            key={d.item.ItemName}
                            type="button"
                            onClick={() => setDealSlide(idx)}
                            aria-label={`Show deal ${idx + 1}`}
                            className={`h-2 rounded-full transition-all cursor-pointer ${
                              idx === dealSlide % sliderDeals.length
                                ? "w-7 bg-[#f3d179]"
                                : "w-2 bg-white/30 hover:bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setDealSlide(
                              (prev) =>
                                (prev - 1 + sliderDeals.length) %
                                sliderDeals.length
                            )
                          }
                          aria-label="Previous category deal"
                          className="h-7 w-7 rounded-lg bg-white/10 hover:bg-white/20 text-[#faf7f2] flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDealSlide(
                              (prev) => (prev + 1) % sliderDeals.length
                            )
                          }
                          aria-label="Next category deal"
                          className="h-7 w-7 rounded-lg bg-white/10 hover:bg-white/20 text-[#faf7f2] flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right (5 cols): Particular Category Product Offer Cards + One-Click Best Deals Sort */}
                <div className="lg:col-span-5 flex flex-col justify-between gap-3">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-1.5">
                      <Tag size={14} className="text-[#9c4124]" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-[#20291e]">
                        Top {categoryName} Offers
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSortBy("discount")}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                        sortBy === "discount"
                          ? "bg-[#9c4124] text-[#faf7f2] shadow-xs"
                          : "bg-[#f3e2dc] text-[#9c4124] hover:bg-[#e8cfc7]"
                      }`}
                    >
                      <Flame size={11} />
                      <span>
                        {sortBy === "discount"
                          ? "Sorted by Highest Discount ✓"
                          : "Sort Grid by Highest Discount"}
                      </span>
                    </button>
                  </div>

                  {/* Two Stacked Category Offer Ad Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 flex-1">
                    {sideOfferDeals.map((offer, idx) => (
                      <div
                        key={offer.item.ItemName}
                        onClick={() => onProductClick(offer.item)}
                        className="group relative rounded-2xl bg-[#fcfaf6] hover:bg-white border border-[#d8cfbf] hover:border-[#384a35] p-3 sm:p-3.5 shadow-2xs hover:shadow-md transition-all flex items-center gap-3.5 cursor-pointer overflow-hidden"
                      >
                        {/* Subtle Corner Ribbon */}
                        <span
                          className={`absolute top-0 right-0 px-2.5 py-0.5 rounded-bl-xl text-[10px] font-extrabold uppercase tracking-wider ${
                            idx === 0
                              ? "bg-[#9c4124] text-[#faf7f2]"
                              : "bg-[#384a35] text-[#faf7f2]"
                          }`}
                        >
                          Save {offer.discount}%
                        </span>

                        {/* Product Thumbnail */}
                        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-[#f4efe4] border border-[#e5ddd0] p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                          {getProductImageUrl(offer.item) ? (
                            <img
                              src={getProductImageUrl(offer.item)!}
                              alt={offer.item.ItemName}
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <Package size={26} className="text-[#384a35]" />
                          )}
                        </div>

                        {/* Offer Info */}
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6e4f12] block">
                            {idx === 0 ? "⚡ Flash Category Pick" : "🌟 Best Value Deal"}
                          </span>
                          <h3 className="text-xs sm:text-sm font-bold text-[#20291e] group-hover:text-[#384a35] truncate mt-0.5">
                            {offer.item.ItemName}
                          </h3>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-sm sm:text-base font-extrabold text-[#20291e]">
                              ₹{offer.item.SellingPrice}
                            </span>
                            <span className="text-[11px] text-[#8a8275] line-through">
                              ₹{offer.fakeOriginal}
                            </span>
                            <span className="text-[11px] font-bold text-[#9c4124]">
                              (-₹{offer.savings})
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-[#5c6e56] inline-flex items-center gap-1">
                              <Star
                                size={11}
                                className="fill-[#c89b3c] text-[#c89b3c]"
                              />
                              {offer.rating.toFixed(1)}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(offer.item, e);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#eef2ec] group-hover:bg-[#384a35] text-[#384a35] group-hover:text-[#faf7f2] text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              + Add Deal
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Header + Inline Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-3 sm:mt-4 mb-5 bg-[#fcfaf6] rounded-2xl border border-[#d8cfbf] p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-[#384a35] to-[#20291e] flex items-center justify-center shrink-0 shadow-md shadow-[#20291e]/20 text-[#faf7f2]">
              <Package size={24} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#20291e] tracking-tight truncate">
                  {searchQuery.trim()
                    ? (activeCategory !== "all"
                        ? `${categoryName}: "${searchQuery.trim()}"`
                        : `Results for "${searchQuery.trim()}"`)
                    : categoryName}
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#e3ebe0] text-[#384a35] border border-[#c5d4c0]">
                  {filteredItems.length}{" "}
                  {filteredItems.length === 1 ? "Product" : "Products"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#5c6e56] font-medium mt-0.5">
                {searchQuery.trim()
                  ? `Showing matching products for "${searchQuery.trim()}" ${activeCategory !== "all" ? `in ${categoryName}` : ""}`
                  : "Explore authentic curations with instant filters, ratings, and quick-view previews"}
              </p>
            </div>
          </div>

          {onSearchChange && (
            <div className="relative w-full md:w-80">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6f7a6b] pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={`Search in ${categoryName}...`}
                className="w-full h-10 pl-9 pr-8 rounded-xl border border-[#d8cfbf] bg-[#f5f0e6]/70 focus:bg-white text-xs sm:text-sm text-[#20291e] placeholder:text-[#8a8275] focus:outline-none focus:border-[#384a35] focus:ring-3 focus:ring-[#384a35]/10 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    if (onSearchCancel) {
                      onSearchCancel();
                    } else if (onSearchChange) {
                      onSearchChange("");
                    }
                  }}
                  aria-label="Cancel search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-[#e9e1d2] hover:bg-[#f3e2dc] text-[#5c6e56] hover:text-[#9c4124] flex items-center justify-center cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Slide-Out Filter Drawer — Opens when clicking the Filters button */}
        <ProductFilters
          mode="drawer-only"
          filters={filters}
          brands={availableBrands}
          packSizes={availablePackSizes}
          subcategories={availableSubcategories}
          totalResults={filteredItems.length}
          onFilterChange={setFilters}
          onClearAll={() => setFilters(INITIAL_FILTER_STATE)}
          isMobileOpen={mobileFiltersOpen}
          onCloseMobile={() => setMobileFiltersOpen(false)}
        />

        <div>
          {/* Main Content */}
          <div className="w-full min-w-0">
            {/* ═══ Unified Filter Button, Product Count, Sort & View Toolbar ═══ */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-[#fcfaf6] rounded-2xl border border-[#d8cfbf] p-3 sm:px-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className={`relative flex items-center gap-2 h-10 px-4 rounded-xl border font-bold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer ${
                    activeFilterCount > 0
                      ? "bg-[#384a35] text-[#faf7f2] border-[#384a35]"
                      : "bg-[#f5f0e6] hover:bg-[#e3ebe0] text-[#20291e] border-[#d8cfbf]"
                  }`}
                >
                  <SlidersHorizontal
                    size={15}
                    strokeWidth={2.3}
                    className={
                      activeFilterCount > 0 ? "text-[#faf7f2]" : "text-[#384a35]"
                    }
                  />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#faf7f2] text-[#384a35] text-xs font-extrabold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <p className="hidden sm:block text-xs sm:text-sm text-[#5c6e56] font-medium">
                  Showing{" "}
                  <span className="font-bold text-[#20291e]">
                    {displayedItems.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-[#20291e]">
                    {filteredItems.length}
                  </span>{" "}
                  products
                </p>
              </div>

              <div className="flex items-center gap-2.5 ml-auto">
                <label className="hidden md:inline text-xs font-semibold text-[#5c6e56] uppercase tracking-wider">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 text-xs sm:text-sm font-semibold text-[#20291e] border border-[#d8cfbf] rounded-xl px-3 focus:outline-none focus:border-[#384a35] bg-[#f5f0e6] cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <div className="hidden sm:flex items-center gap-1.5 ml-1 pl-3 border-l border-[#d8cfbf]">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                    className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-[#384a35] text-[#faf7f2] shadow-xs"
                        : "border border-[#d8cfbf] text-[#5c6e56] hover:border-[#384a35] bg-white"
                    }`}
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                    className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      viewMode === "list"
                        ? "bg-[#384a35] text-[#faf7f2] shadow-xs"
                        : "border border-[#d8cfbf] text-[#5c6e56] hover:border-[#384a35] bg-white"
                    }`}
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* ═══ Active Filters Chips Row ═══ */}
            {(activeFilterCount > 0 || searchQuery.trim()) && (
              <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-[#eef2ec] rounded-2xl border border-[#c5d4c0] shadow-2xs">
                <span className="text-xs font-bold text-[#384a35] mr-1">
                  Active Filters:
                </span>

                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onSearchCancel) {
                        onSearchCancel();
                      } else if (onSearchChange) {
                        onSearchChange("");
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcfaf6] border border-[#b6c9b0] text-[#20291e] text-xs font-semibold hover:bg-[#f7ebe6] transition-all cursor-pointer"
                  >
                    <span>Search: "{searchQuery}"</span>
                    <X size={12} strokeWidth={2.5} />
                  </button>
                )}

                {activeSubcategoryLabel && (
                  <button
                    type="button"
                    onClick={() =>
                      setFilters({ ...filters, subcategory: null })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcfaf6] border border-[#b6c9b0] text-[#20291e] text-xs font-semibold hover:bg-[#f7ebe6] transition-all cursor-pointer"
                  >
                    <span>Type: {activeSubcategoryLabel}</span>
                    <X size={12} strokeWidth={2.5} />
                  </button>
                )}

                {filters.vcratifyAssured && (
                  <button
                    type="button"
                    onClick={() =>
                      setFilters({ ...filters, vcratifyAssured: false })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcfaf6] border border-[#b6c9b0] text-[#20291e] text-xs font-semibold hover:bg-[#f7ebe6] transition-all cursor-pointer"
                  >
                    <span>Assured ✓</span>
                    <X size={12} strokeWidth={2.5} />
                  </button>
                )}

                {filters.inStockOnly && (
                  <button
                    type="button"
                    onClick={() =>
                      setFilters({ ...filters, inStockOnly: false })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcfaf6] border border-[#b6c9b0] text-[#20291e] text-xs font-semibold hover:bg-[#f7ebe6] transition-all cursor-pointer"
                  >
                    <span>In Stock Only</span>
                    <X size={12} strokeWidth={2.5} />
                  </button>
                )}

                {filters.packSize && (
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, packSize: null })}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcfaf6] border border-[#b6c9b0] text-[#20291e] text-xs font-semibold hover:bg-[#f7ebe6] transition-all cursor-pointer"
                  >
                    <span>Size: {getPackSizeLabel(filters.packSize)}</span>
                    <X size={12} strokeWidth={2.5} />
                  </button>
                )}

                {filters.brand && (
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, brand: null })}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcfaf6] border border-[#b6c9b0] text-[#20291e] text-xs font-semibold hover:bg-[#f7ebe6] transition-all cursor-pointer"
                  >
                    <span>Brand: {filters.brand}</span>
                    <X size={12} strokeWidth={2.5} />
                  </button>
                )}

                {filters.priceRange && (
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, priceRange: null })}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcfaf6] border border-[#b6c9b0] text-[#20291e] text-xs font-semibold hover:bg-[#f7ebe6] transition-all cursor-pointer"
                  >
                    <span>Price: {getPriceRangeLabel(filters.priceRange)}</span>
                    <X size={12} strokeWidth={2.5} />
                  </button>
                )}

                {filters.minRating && (
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, minRating: null })}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcfaf6] border border-[#e3d1a8] text-[#6e4f12] text-xs font-semibold hover:bg-[#f7ebe6] transition-all cursor-pointer"
                  >
                    <span>Rating: {filters.minRating}★+</span>
                    <X size={12} strokeWidth={2.5} />
                  </button>
                )}

                {filters.discount && (
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, discount: null })}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcfaf6] border border-[#d69b88] text-[#9c4124] text-xs font-semibold hover:bg-[#f7ebe6] transition-all cursor-pointer"
                  >
                    <span>Discount: {filters.discount}%+</span>
                    <X size={12} strokeWidth={2.5} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetAll}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#9c4124] hover:underline ml-auto cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span>Clear All</span>
                </button>
              </div>
            )}

            {/* Products, Skeleton, or Empty State */}
            {isFiltering ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-3.5 lg:gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-[#fcfaf6] rounded-3xl border border-[#d8cfbf] py-16 sm:py-20 px-6 text-center shadow-2xs">
                <div className="h-16 w-16 rounded-2xl bg-[#e3ebe0] text-[#384a35] flex items-center justify-center mx-auto mb-4">
                  <Package size={34} />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#20291e] mb-2">
                  {searchQuery.trim()
                    ? (activeCategory !== "all"
                        ? `No products found for "${searchQuery.trim()}" in ${categoryName}`
                        : `No products found for "${searchQuery.trim()}"`)
                    : "No matching products found"}
                </h3>
                <p className="text-[#5c6e56] mb-4 font-medium text-xs sm:text-sm max-w-md mx-auto">
                  {searchQuery.trim()
                    ? (activeCategory !== "all"
                        ? `No items in ${categoryName} matched your search. Check for typos or try searching across all categories.`
                        : "Check for typos or try searching with general keywords like pen, paper, notebook, pencil.")
                    : "We couldn't find any products matching your current filters. Try clearing some filters to see more items."}
                </p>
                {activeCategory !== "all" && searchQuery.trim() && onCategorySelect && (
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() => onCategorySelect("all")}
                      className="px-4 py-2 rounded-xl bg-[#e3ebe0] hover:bg-[#384a35] text-[#384a35] hover:text-[#faf7f2] text-xs font-bold transition-all cursor-pointer border border-[#c5d4c0]"
                    >
                      Search in all categories instead →
                    </button>
                  </div>
                )}
                {searchQuery.trim() && onSearchChange && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-5 max-w-md mx-auto">
                    <span className="text-xs text-[#6d7568] w-full block">Popular searches:</span>
                    {["A4 Paper", "Ball Pen", "Notebook", "Pencil", "Masala"].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => onSearchChange(term)}
                        className="px-3 py-1 rounded-xl bg-white border border-[#d8cfbf] text-xs font-semibold text-[#20291e] hover:bg-[#384a35] hover:text-[#faf7f2] hover:border-[#384a35] transition-all cursor-pointer shadow-2xs"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#384a35] to-[#20291e] text-[#faf7f2] text-sm font-bold hover:opacity-95 transition-all shadow-md cursor-pointer"
                >
                  {searchQuery.trim() ? "Clear Search & All Filters" : "Reset All Filters"}
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-3.5 lg:gap-4"
                      : "flex flex-col gap-3 sm:gap-4"
                  }
                >
                  {displayedItems.map((item) => (
                    <ProductCard
                      key={item.ItemName}
                      item={item}
                      brand="VCartify Exclusive"
                      isWishlisted={wishlist.includes(item.ItemName)}
                      viewMode={viewMode}
                      onAddToCart={(e) => onAddToCart(item, e)}
                      onToggleWishlist={() => onToggleWishlist(item.ItemName)}
                      onQuickView={() =>
                        onQuickView ? onQuickView(item) : onProductClick(item)
                      }
                      onClick={() => onProductClick(item)}
                    />
                  ))}
                </div>

                {/* Pagination / Load More Footer */}
                {filteredItems.length > PAGE_SIZE && (
                  <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3 bg-[#fcfaf6] rounded-2xl border border-[#d8cfbf] p-5 shadow-2xs">
                    <p className="text-xs sm:text-sm text-[#5c6e56] font-medium">
                      Showing{" "}
                      <span className="font-bold text-[#20291e]">
                        {displayedItems.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-[#20291e]">
                        {filteredItems.length}
                      </span>{" "}
                      products
                    </p>
                    <div className="w-48 h-1.5 bg-[#e5ddd0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#384a35] to-[#c89b3c] rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              (displayedItems.length / filteredItems.length) *
                                100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                    {hasMore && (
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleCount((prev) => prev + PAGE_SIZE)
                        }
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#384a35] to-[#20291e] hover:opacity-95 text-[#faf7f2] text-xs sm:text-sm font-bold shadow-md shadow-[#20291e]/20 transition-all cursor-pointer active:scale-98"
                      >
                        <span>Load More Products</span>
                        <ChevronDown size={15} />
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}