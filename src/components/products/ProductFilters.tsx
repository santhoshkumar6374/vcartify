import { Star, X, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";

export interface FilterState {
  vcratifyAssured: boolean;
  priceRange: string | null;
  minRating: number | null;
  discount: string | null;
}

interface Props {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearAll: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const PRICE_RANGES = [
  { id: "under-500", label: "Under ₹500" },
  { id: "500-1000", label: "₹500 - ₹1,000" },
  { id: "1000-5000", label: "₹1,000 - ₹5,000" },
  { id: "5000-10000", label: "₹5,000 - ₹10,000" },
  { id: "above-10000", label: "Above ₹10,000" },
];

const RATINGS = [4, 3, 2];

const DISCOUNTS = [
  { id: "10", label: "10% or more" },
  { id: "25", label: "25% or more" },
  { id: "50", label: "50% or more" },
  { id: "70", label: "70% or more" },
];

// ═══════════════════════════════════════════════════
// MAIN COMPONENT — handles both desktop + mobile
// ═══════════════════════════════════════════════════
export function ProductFilters({
  filters,
  onFilterChange,
  onClearAll,
  isMobileOpen = false,
  onCloseMobile,
}: Props) {
  // Body scroll lock when mobile drawer open
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

  return (
    <>
      {/* ═══ DESKTOP: Sidebar (visible on lg+) ═══ */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white rounded-xl border-2 border-gray-200 p-5 h-fit sticky top-32">
        <FilterHeader onClearAll={onClearAll} />
        <FilterContent
          filters={filters}
          onFilterChange={onFilterChange}
        />
      </aside>

      {/* ═══ MOBILE: Bottom Sheet Drawer ═══ */}
      {/* Backdrop */}
      <div
        onClick={onCloseMobile}
        className={`lg:hidden fixed inset-0 bg-black/70 z-[80] transition-opacity duration-300 ${
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer (slides up from bottom) */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-[90] bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out max-h-[85vh] flex flex-col ${
          isMobileOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="h-1.5 w-12 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b-2 border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-black" strokeWidth={2.5} />
            <h2 className="text-xl font-black text-black">Filters</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClearAll}
              className="text-sm font-black text-black hover:underline"
            >
              Clear All
            </button>
            <button
              onClick={onCloseMobile}
              aria-label="Close filters"
              className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X size={22} strokeWidth={2.5} className="text-black" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pt-2 pb-4">
          <FilterContent
            filters={filters}
            onFilterChange={onFilterChange}
          />
        </div>

        {/* Sticky bottom Apply button */}
        <div className="border-t-2 border-gray-200 p-4 shrink-0 bg-white">
          <button
            onClick={onCloseMobile}
            className="w-full h-12 rounded-lg bg-black text-white font-black text-base hover:bg-gray-800 transition-colors"
          >
            Show Results
          </button>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════
// Filter Header (title + clear all)
// ═══════════════════════════════════════════════════
function FilterHeader({ onClearAll }: { onClearAll: () => void }) {
  return (
    <div className="flex items-center justify-between mb-5 pb-4 border-b-2 border-gray-100">
      <h2 className="text-lg font-black text-black">Filters</h2>
      <button
        onClick={onClearAll}
        className="text-sm font-black text-black hover:underline"
      >
        Clear All
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Filter Content (shared between desktop + mobile)
// ═══════════════════════════════════════════════════
function FilterContent({
  filters,
  onFilterChange,
}: {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}) {
  return (
    <>
      {/* vCartify Assured */}
      <label className="flex items-center gap-2 cursor-pointer mb-6">
        <input
          type="checkbox"
          checked={filters.vcratifyAssured}
          onChange={(e) =>
            onFilterChange({ ...filters, vcratifyAssured: e.target.checked })
          }
          className="h-4 w-4 rounded accent-black"
        />
        <span className="text-sm font-bold text-black">
          vCartify Assured ✓
        </span>
      </label>

      {/* Price Range */}
      <FilterGroup title="Price Range">
        {PRICE_RANGES.map((range) => (
          <label
            key={range.id}
            className="flex items-center gap-2.5 cursor-pointer py-2 group"
          >
            <span
              className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                filters.priceRange === range.id
                  ? "border-black"
                  : "border-gray-400 group-hover:border-black"
              } transition-colors`}
            >
              {filters.priceRange === range.id && (
                <span className="h-2 w-2 rounded-full bg-black" />
              )}
            </span>
            <input
              type="radio"
              name="price"
              className="sr-only"
              checked={filters.priceRange === range.id}
              onChange={() =>
                onFilterChange({ ...filters, priceRange: range.id })
              }
            />
            <span className="text-sm font-semibold text-black">
              {range.label}
            </span>
          </label>
        ))}
      </FilterGroup>

      {/* Customer Ratings */}
      <FilterGroup title="Customer Ratings">
        {RATINGS.map((rating) => (
          <label
            key={rating}
            className="flex items-center gap-2.5 cursor-pointer py-2 group"
          >
            <span
              className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                filters.minRating === rating
                  ? "border-black"
                  : "border-gray-400 group-hover:border-black"
              } transition-colors`}
            >
              {filters.minRating === rating && (
                <span className="h-2 w-2 rounded-full bg-black" />
              )}
            </span>
            <input
              type="radio"
              name="rating"
              className="sr-only"
              checked={filters.minRating === rating}
              onChange={() =>
                onFilterChange({ ...filters, minRating: rating })
              }
            />
            <div className="flex items-center gap-1 text-sm font-semibold text-black">
              <span>{rating}+</span>
              <Star size={12} className="fill-black text-black" />
              <span>& above</span>
            </div>
          </label>
        ))}
      </FilterGroup>

      {/* Discount */}
      <FilterGroup title="Discount">
        {DISCOUNTS.map((d) => (
          <label
            key={d.id}
            className="flex items-center gap-2.5 cursor-pointer py-2 group"
          >
            <span
              className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                filters.discount === d.id
                  ? "border-black"
                  : "border-gray-400 group-hover:border-black"
              } transition-colors`}
            >
              {filters.discount === d.id && (
                <span className="h-2 w-2 rounded-full bg-black" />
              )}
            </span>
            <input
              type="radio"
              name="discount"
              className="sr-only"
              checked={filters.discount === d.id}
              onChange={() => onFilterChange({ ...filters, discount: d.id })}
            />
            <span className="text-sm font-semibold text-black">{d.label}</span>
          </label>
        ))}
      </FilterGroup>
    </>
  );
}

// ═══════════════════════════════════════════════════
// Filter Group (collapsible section)
// ═══════════════════════════════════════════════════
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
    <div className="border-t-2 border-gray-100 pt-4 mt-4 first:border-t-0 first:pt-0 first:mt-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3"
      >
        <h3 className="text-sm font-black text-black">{title}</h3>
      </button>
      {open && <div className="space-y-0">{children}</div>}
    </div>
  );
}