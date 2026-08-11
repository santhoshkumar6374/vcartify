import { useState, useMemo } from "react";
import { LayoutGrid, List, Package, SlidersHorizontal } from "lucide-react";
import { StoreItem } from "@/types/store";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters, FilterState } from "@/components/products/ProductFilters";

interface Props {
  items: StoreItem[];
  categoryName: string;
  wishlist: string[];
  onAddToCart: (item: StoreItem) => void;
  onToggleWishlist: (name: string) => void;
  onProductClick: (item: StoreItem) => void;
  onHomeClick: () => void;
}

const SORT_OPTIONS = [
  { id: "relevance", label: "Relevance" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "newest", label: "Newest First" },
  { id: "rating", label: "Customer Rating" },
];

export function ProductListPage({
  items,
  categoryName,
  wishlist,
  onAddToCart,
  onToggleWishlist,
  onProductClick,
  onHomeClick,
}: Props) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    vcratifyAssured: false,
    priceRange: null,
    minRating: null,
    discount: null,
  });

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (filters.priceRange) {
      result = result.filter((item) => {
        const p = item.SellingPrice;
        switch (filters.priceRange) {
          case "under-500":
            return p < 500;
          case "500-1000":
            return p >= 500 && p <= 1000;
          case "1000-5000":
            return p > 1000 && p <= 5000;
          case "5000-10000":
            return p > 5000 && p <= 10000;
          case "above-10000":
            return p > 10000;
          default:
            return true;
        }
      });
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
    }

    return result;
  }, [items, filters, sortBy]);

  // Count active filters (for mobile badge)
  const activeFilterCount =
    (filters.vcratifyAssured ? 1 : 0) +
    (filters.priceRange ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.discount ? 1 : 0);

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-[1500px] px-3 sm:px-4 py-4 sm:py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", onClick: onHomeClick },
            { label: categoryName },
          ]}
        />

        {/* Category Header */}
        <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4 mb-4 sm:mb-6">
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-black flex items-center justify-center shrink-0">
            <Package size={20} className="text-white sm:w-6 sm:h-6" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-black text-black tracking-tight truncate">
              {categoryName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-semibold">
              {filteredItems.length} products found
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Filters — Desktop sidebar, Mobile drawer */}
          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
            onClearAll={() =>
              setFilters({
                vcratifyAssured: false,
                priceRange: null,
                minRating: null,
                discount: null,
              })
            }
            isMobileOpen={mobileFiltersOpen}
            onCloseMobile={() => setMobileFiltersOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* ═══ Mobile: Filter + Sort Bar ═══ */}
            <div className="flex lg:hidden items-center gap-2 mb-4">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="relative flex items-center gap-2 h-10 px-4 rounded-lg border-2 border-black bg-white text-black font-black text-sm hover:bg-gray-100 transition-colors"
              >
                <SlidersHorizontal size={16} strokeWidth={2.5} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="min-w-[20px] h-5 px-1 rounded-full bg-black text-white text-xs font-black flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 h-10 px-3 rounded-lg border-2 border-gray-300 text-sm font-bold text-black focus:outline-none focus:border-black bg-white"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    Sort: {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* ═══ Desktop: Sort Bar ═══ */}
            <div className="hidden lg:flex items-center justify-end gap-3 mb-6 bg-white rounded-lg border-2 border-gray-200 p-3">
              <label className="text-sm text-black font-bold">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm font-bold text-black border-2 border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:border-black bg-white"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                    viewMode === "grid"
                      ? "bg-black text-white"
                      : "border border-gray-300 text-black hover:border-black"
                  }`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                    viewMode === "list"
                      ? "bg-black text-white"
                      : "border border-gray-300 text-black hover:border-black"
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* Products or Empty */}
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-gray-200 py-16 sm:py-20 px-6 text-center">
                <Package size={48} className="mx-auto text-black mb-4" />
                <h3 className="text-xl font-black text-black mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6 font-semibold text-sm">
                  Try adjusting your filters
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      vcratifyAssured: false,
                      priceRange: null,
                      minRating: null,
                      discount: null,
                    })
                  }
                  className="bg-black text-white px-6 py-2.5 rounded-lg font-black hover:bg-gray-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
             <div
  className={
    viewMode === "grid"
      ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4"
      : "flex flex-col gap-3 sm:gap-4"
  }
>
  {filteredItems.map((item) => (
    <ProductCard
      key={item.ItemName}
      item={item}
      brand="vCARTIFY EXCLUSIVE"
      isWishlisted={wishlist.includes(item.ItemName)}
      rating={4}
      reviewCount={2543}
      viewMode={viewMode}
      onAddToCart={() => onAddToCart(item)}
      onToggleWishlist={() => onToggleWishlist(item.ItemName)}
      onClick={() => onProductClick(item)}
    />
  ))}
</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}