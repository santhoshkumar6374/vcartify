import {
  Star,
  X,
  SlidersHorizontal,
  Check,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { StoreItem } from "@/types/store";

export interface FilterState {
  vcratifyAssured: boolean;
  inStockOnly?: boolean;
  brand?: string | null;
  packSize?: string | null;
  subcategory?: string | null;
  priceRange: string | null;
  minRating: number | null;
  discount: string | null;
}

export const INITIAL_FILTER_STATE: FilterState = {
  vcratifyAssured: false,
  inStockOnly: false,
  brand: null,
  packSize: null,
  subcategory: null,
  priceRange: null,
  minRating: null,
  discount: null,
};

export interface PackSizeOption {
  id: string;
  label: string;
  keywords: string[];
  count: number;
}

const PACK_SIZE_RULES: Array<{ id: string; label: string; keywords: string[] }> = [
  { id: "small-pack", label: "50g – 100g Pack", keywords: ["50 g", "50g", "100 g", "100g"] },
  { id: "medium-pack", label: "200g – 500g Pack", keywords: ["200 g", "200g", "250 g", "250g", "500 g", "500g"] },
  { id: "bulk-kg", label: "1 Kg / Bulk Pack", keywords: ["1 kg", "1 kgs", "1kg", "kg", "bulk"] },
  { id: "combo-set", label: "Box / Multi-Piece Set", keywords: ["box", "pieces", "set", "pack", "combo", "10 pcs"] },
  { id: "standard-size", label: "Standard / King Size", keywords: ["king", "long", "a4", "full", "large", "big"] },
];

export function extractPackSizesForItems(items: StoreItem[]): PackSizeOption[] {
  if (!items || items.length === 0) return [];
  const options: PackSizeOption[] = [];
  for (const rule of PACK_SIZE_RULES) {
    const count = items.filter((item) => {
      const text = `${item.ItemName} ${item.Description || ""}`.toLowerCase();
      return rule.keywords.some((kw) => text.includes(kw));
    }).length;
    if (count > 0) {
      options.push({ ...rule, count });
    }
  }
  return options;
}

export function matchesPackSize(item: StoreItem, packSizeId: string | null | undefined): boolean {
  if (!packSizeId) return true;
  const rule = PACK_SIZE_RULES.find((r) => r.id === packSizeId);
  if (!rule) return true;
  const text = `${item.ItemName} ${item.Description || ""}`.toLowerCase();
  return rule.keywords.some((kw) => text.includes(kw));
}

export function getPackSizeLabel(packSizeId: string | null | undefined): string {
  if (!packSizeId) return "";
  return PACK_SIZE_RULES.find((r) => r.id === packSizeId)?.label || packSizeId;
}

interface Props {
  filters: FilterState;
  brands?: string[];
  packSizes?: PackSizeOption[];
  subcategories?: Array<{ id: string; label: string; count: number }>;
  totalResults?: number;
  mode?: "sidebar" | "drawer-only";
  onFilterChange: (filters: FilterState) => void;
  onClearAll: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const PRICE_RANGES = [
  { id: "under-100", label: "Under ₹100" },
  { id: "100-500", label: "₹100 - ₹500" },
  { id: "500-1000", label: "₹500 - ₹1,000" },
  { id: "1000-5000", label: "₹1,000 - ₹5,000" },
  { id: "above-5000", label: "Above ₹5,000" },
];

const RATINGS = [4, 3, 2];

export const DISCOUNTS = [
  { id: "10", label: "10% or more" },
  { id: "25", label: "25% or more" },
  { id: "50", label: "50% or more" },
];

export function matchesPriceRange(
  price: number,
  rangeId: string | null
): boolean {
  if (!rangeId) return true;
  switch (rangeId) {
    case "under-100":
      return price < 100;
    case "100-500":
      return price >= 100 && price <= 500;
    case "under-500":
      return price <= 500;
    case "500-1000":
      return price > 500 && price <= 1000;
    case "1000-5000":
      return price > 1000 && price <= 5000;
    case "5000-10000":
      return price > 5000 && price <= 10000;
    case "above-5000":
    case "above-10000":
      return price > 5000;
    default:
      return true;
  }
}

export function getPriceRangeLabel(rangeId: string | null): string {
  if (!rangeId) return "";
  return PRICE_RANGES.find((r) => r.id === rangeId)?.label || rangeId;
}

export function countActiveFilters(filters: FilterState): number {
  return (
    (filters.vcratifyAssured ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.brand ? 1 : 0) +
    (filters.packSize ? 1 : 0) +
    (filters.subcategory ? 1 : 0) +
    (filters.priceRange ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.discount ? 1 : 0)
  );
}

// ═══════════════════════════════════════════════════
// MAIN COMPONENT — handles desktop sidebar + slide-out drawer
// ═══════════════════════════════════════════════════
export function ProductFilters({
  filters,
  brands = [],
  packSizes = [],
  subcategories = [],
  totalResults,
  mode = "sidebar",
  onFilterChange,
  onClearAll,
  isMobileOpen = false,
  onCloseMobile,
}: Props) {
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const activeCount = countActiveFilters(filters);

  return (
    <>
      {/* ═══ DESKTOP: Sidebar (when mode === "sidebar") ═══ */}
      {mode === "sidebar" && (
        <aside className="hidden lg:block w-64 shrink-0 bg-[#fcfaf6] rounded-2xl border border-[#e5ddd0] p-5 h-fit sticky top-28 shadow-xs">
          <FilterHeader activeCount={activeCount} onClearAll={onClearAll} />
          <FilterContent
            filters={filters}
            brands={brands}
            packSizes={packSizes}
            subcategories={subcategories}
            onFilterChange={onFilterChange}
          />
        </aside>
      )}

      {/* ═══ SLIDE-OUT FILTER DRAWER (Mobile, or Desktop when mode === "drawer-only") ═══ */}
      <div
        onClick={onCloseMobile}
        className={`${
          mode === "sidebar" ? "lg:hidden" : ""
        } fixed inset-0 bg-[#20291e]/55 backdrop-blur-xs z-[80] transition-opacity duration-300 ${
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`${
          mode === "sidebar" ? "lg:hidden" : ""
        } fixed inset-y-0 left-0 z-[90] w-[88vw] max-w-sm bg-[#fcfaf6] shadow-2xl transition-transform duration-300 ease-out flex flex-col border-r border-[#d8cfbf] ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5ddd0] bg-[#f5f0e6] shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-[#e3ebe0] text-[#384a35] flex items-center justify-center">
              <SlidersHorizontal size={16} strokeWidth={2.3} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#20291e] leading-tight">
                Refine Products
              </h2>
              {typeof totalResults === "number" && (
                <p className="text-[11px] text-[#5c6e56] font-medium">
                  {totalResults} matching items
                </p>
              )}
            </div>
            {activeCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#384a35] text-[#faf7f2]">
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs font-bold text-[#9c4124] hover:underline px-2 py-1 cursor-pointer"
              >
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close filters"
              className="h-8 w-8 rounded-full hover:bg-[#e9e1d2] flex items-center justify-center transition-colors text-[#20291e] cursor-pointer"
            >
              <X size={19} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <FilterContent
            filters={filters}
            brands={brands}
            packSizes={packSizes}
            subcategories={subcategories}
            onFilterChange={onFilterChange}
          />
        </div>

        {/* Sticky bottom Apply & Clear controls */}
        <div className="border-t border-[#e5ddd0] p-4 shrink-0 bg-[#f5f0e6] flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClearAll}
            className="px-4 h-11 rounded-xl border border-[#d8cfbf] bg-[#fcfaf6] text-[#20291e] font-bold text-xs sm:text-sm hover:bg-[#ebe4d6] transition-colors cursor-pointer"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#384a35] to-[#20291e] text-[#faf7f2] font-bold text-xs sm:text-sm hover:opacity-95 transition-all shadow-md shadow-[#20291e]/20 cursor-pointer"
          >
            {typeof totalResults === "number"
              ? `Show ${totalResults} Products`
              : "Apply Filters"}
          </button>
        </div>
      </div>
    </>
  );
}

function FilterHeader({
  activeCount,
  onClearAll,
}: {
  activeCount: number;
  onClearAll: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-[#e5ddd0]">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-[#e3ebe0] text-[#384a35] flex items-center justify-center">
          <SlidersHorizontal size={14} strokeWidth={2.4} />
        </div>
        <h2 className="text-sm font-bold text-[#20291e]">Filters</h2>
        {activeCount > 0 && (
          <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-[#384a35] text-[#faf7f2] text-[10px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </div>
      {activeCount > 0 && (
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#9c4124] hover:text-[#7d321a] cursor-pointer"
        >
          <RotateCcw size={11} />
          <span>Clear All</span>
        </button>
      )}
    </div>
  );
}

function FilterContent({
  filters,
  brands = [],
  packSizes = [],
  subcategories = [],
  onFilterChange,
}: {
  filters: FilterState;
  brands?: string[];
  packSizes?: PackSizeOption[];
  subcategories?: Array<{ id: string; label: string; count: number }>;
  onFilterChange: (filters: FilterState) => void;
}) {
  const togglePriceRange = (rangeId: string) => {
    onFilterChange({
      ...filters,
      priceRange: filters.priceRange === rangeId ? null : rangeId,
    });
  };

  const toggleRating = (rating: number) => {
    onFilterChange({
      ...filters,
      minRating: filters.minRating === rating ? null : rating,
    });
  };

  const toggleDiscount = (discountId: string) => {
    onFilterChange({
      ...filters,
      discount: filters.discount === discountId ? null : discountId,
    });
  };

  const toggleBrand = (brandName: string) => {
    onFilterChange({
      ...filters,
      brand: filters.brand === brandName ? null : brandName,
    });
  };

  const togglePackSize = (packId: string) => {
    onFilterChange({
      ...filters,
      packSize: filters.packSize === packId ? null : packId,
    });
  };

  const toggleSubcategory = (subId: string) => {
    onFilterChange({
      ...filters,
      subcategory: filters.subcategory === subId ? null : subId,
    });
  };

  return (
    <div className="space-y-1">
      {/* Quick Toggles: Assured & Availability */}
      <div className="space-y-2 pb-3">
        <button
          type="button"
          onClick={() =>
            onFilterChange({
              ...filters,
              vcratifyAssured: !filters.vcratifyAssured,
            })
          }
          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            filters.vcratifyAssured
              ? "bg-[#eef2ec] border-[#384a35] text-[#20291e] font-semibold shadow-2xs"
              : "bg-[#f5f0e6]/70 border-[#e5ddd0] hover:border-[#384a35]/50 text-[#293526]"
          }`}
        >
          <span className="text-xs sm:text-sm flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-[#e3ebe0] text-[#384a35] flex items-center justify-center text-[11px] font-bold">
              ✓
            </span>
            <span>VCartify Assured</span>
          </span>
          <span
            className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
              filters.vcratifyAssured
                ? "bg-[#384a35] border-[#384a35] text-white"
                : "border-[#c7bda9] bg-white"
            }`}
          >
            {filters.vcratifyAssured && <Check size={11} strokeWidth={3} />}
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            onFilterChange({
              ...filters,
              inStockOnly: !filters.inStockOnly,
            })
          }
          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            filters.inStockOnly
              ? "bg-[#eef2ec] border-[#384a35] text-[#20291e] font-semibold shadow-2xs"
              : "bg-[#f5f0e6]/70 border-[#e5ddd0] hover:border-[#384a35]/50 text-[#293526]"
          }`}
        >
          <span className="text-xs sm:text-sm flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#384a35] ml-1.5 mr-1" />
            <span>In Stock Only</span>
          </span>
          <span
            className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
              filters.inStockOnly
                ? "bg-[#384a35] border-[#384a35] text-white"
                : "border-[#c7bda9] bg-white"
            }`}
          >
            {filters.inStockOnly && <Check size={11} strokeWidth={3} />}
          </span>
        </button>
      </div>

      {/* Subcategories / Product Types */}
      {subcategories.length > 0 && (
        <FilterGroup title="Product Type">
          {subcategories.map((sub) => {
            const isSelected = filters.subcategory === sub.id;
            return (
              <button
                type="button"
                key={sub.id}
                onClick={() => toggleSubcategory(sub.id)}
                className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl cursor-pointer group transition-all text-left ${
                  isSelected
                    ? "bg-[#eef2ec] text-[#20291e] font-semibold"
                    : "hover:bg-[#f5f0e6] text-[#293526]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-[#384a35] bg-[#384a35] text-white"
                        : "border-[#c7bda9] group-hover:border-[#384a35] bg-white"
                    }`}
                  >
                    {isSelected && <Check size={10} strokeWidth={3} />}
                  </span>
                  <span className="text-xs sm:text-sm truncate">{sub.label}</span>
                </div>
                <span className="text-[10px] font-semibold text-[#6f7a6b]">
                  {sub.count}
                </span>
              </button>
            );
          })}
        </FilterGroup>
      )}

      {/* Price Range */}
      <FilterGroup title="Price Range">
        {PRICE_RANGES.map((range) => {
          const isSelected = filters.priceRange === range.id;
          return (
            <button
              type="button"
              key={range.id}
              onClick={() => togglePriceRange(range.id)}
              className={`w-full flex items-center justify-between py-2 px-2.5 rounded-xl cursor-pointer group transition-all text-left ${
                isSelected
                  ? "bg-[#eef2ec] text-[#20291e] font-semibold"
                  : "hover:bg-[#f5f0e6] text-[#293526]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-[#384a35] bg-[#384a35] text-white"
                      : "border-[#c7bda9] group-hover:border-[#384a35] bg-white"
                  }`}
                >
                  {isSelected && <Check size={10} strokeWidth={3} />}
                </span>
                <span className="text-xs sm:text-sm">{range.label}</span>
              </div>
              {isSelected && (
                <span className="text-[10px] text-[#384a35] font-bold bg-[#e3ebe0] px-1.5 py-0.5 rounded">
                  Active
                </span>
              )}
            </button>
          );
        })}
      </FilterGroup>

      {/* Pack Size / Format (Dynamic Category-Aware Filter) */}
      {packSizes.length > 0 && (
        <FilterGroup title="Size & Pack Format">
          {packSizes.map((ps) => {
            const isSelected = filters.packSize === ps.id;
            return (
              <button
                type="button"
                key={ps.id}
                onClick={() => togglePackSize(ps.id)}
                className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl cursor-pointer group transition-all text-left ${
                  isSelected
                    ? "bg-[#eef2ec] text-[#20291e] font-semibold"
                    : "hover:bg-[#f5f0e6] text-[#293526]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-[#384a35] bg-[#384a35] text-white"
                        : "border-[#c7bda9] group-hover:border-[#384a35] bg-white"
                    }`}
                  >
                    {isSelected && <Check size={10} strokeWidth={3} />}
                  </span>
                  <span className="text-xs sm:text-sm truncate">{ps.label}</span>
                </div>
                <span className="text-[10px] font-semibold text-[#6f7a6b]">
                  {ps.count}
                </span>
              </button>
            );
          })}
        </FilterGroup>
      )}

      {/* Brand / Collection */}
      {brands.length > 0 && (
        <FilterGroup title="Brand & Collection">
          {brands.map((b) => {
            const isSelected = filters.brand === b;
            return (
              <button
                type="button"
                key={b}
                onClick={() => toggleBrand(b)}
                className={`w-full flex items-center justify-between py-1.5 px-2.5 rounded-xl cursor-pointer group transition-all text-left ${
                  isSelected
                    ? "bg-[#eef2ec] text-[#20291e] font-semibold"
                    : "hover:bg-[#f5f0e6] text-[#293526]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-[#384a35] bg-[#384a35] text-white"
                        : "border-[#c7bda9] group-hover:border-[#384a35] bg-white"
                    }`}
                  >
                    {isSelected && <Check size={10} strokeWidth={3} />}
                  </span>
                  <span className="text-xs sm:text-sm truncate">{b}</span>
                </div>
              </button>
            );
          })}
        </FilterGroup>
      )}

      {/* Customer Ratings */}
      <FilterGroup title="Customer Ratings">
        {RATINGS.map((rating) => {
          const isSelected = filters.minRating === rating;
          return (
            <button
              type="button"
              key={rating}
              onClick={() => toggleRating(rating)}
              className={`w-full flex items-center justify-between py-2 px-2.5 rounded-xl cursor-pointer group transition-all text-left ${
                isSelected
                  ? "bg-[#f8f2e4] text-[#20291e] font-semibold"
                  : "hover:bg-[#f5f0e6] text-[#293526]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-[#b58326] bg-[#b58326] text-white"
                      : "border-[#c7bda9] group-hover:border-[#b58326] bg-white"
                  }`}
                >
                  {isSelected && <Check size={10} strokeWidth={3} />}
                </span>
                <div className="flex items-center gap-1 text-xs sm:text-sm">
                  <span>{rating}★</span>
                  <Star size={12} className="fill-[#c89b3c] text-[#c89b3c]" />
                  <span>& above</span>
                </div>
              </div>
              {isSelected && (
                <span className="text-[10px] text-[#6e4f12] font-bold bg-[#f2e7ce] px-1.5 py-0.5 rounded">
                  Active
                </span>
              )}
            </button>
          );
        })}
      </FilterGroup>

      {/* Discount */}
      <FilterGroup title="Discount">
        {DISCOUNTS.map((d) => {
          const isSelected = filters.discount === d.id;
          return (
            <button
              type="button"
              key={d.id}
              onClick={() => toggleDiscount(d.id)}
              className={`w-full flex items-center justify-between py-2 px-2.5 rounded-xl cursor-pointer group transition-all text-left ${
                isSelected
                  ? "bg-[#f7ebe6] text-[#20291e] font-semibold"
                  : "hover:bg-[#f5f0e6] text-[#293526]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-[#9c4124] bg-[#9c4124] text-white"
                      : "border-[#c7bda9] group-hover:border-[#9c4124] bg-white"
                  }`}
                >
                  {isSelected && <Check size={10} strokeWidth={3} />}
                </span>
                <span className="text-xs sm:text-sm">{d.label}</span>
              </div>
              {isSelected && (
                <span className="text-[10px] text-[#9c4124] font-bold bg-[#f3e2dc] px-1.5 py-0.5 rounded">
                  Active
                </span>
              )}
            </button>
          );
        })}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-[#e5ddd0] pt-3.5 mt-3.5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-2 cursor-pointer"
      >
        <h3 className="text-xs uppercase tracking-wider font-bold text-[#5c6e56]">
          {title}
        </h3>
        <ChevronDown
          size={14}
          className={`text-[#6f7a6b] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && <div className="space-y-0.5">{children}</div>}
    </div>
  );
}