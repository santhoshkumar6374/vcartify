import { Heart, ShoppingBag, Star } from "lucide-react";
import { StoreItem } from "@/types/store";

interface Props {
  item: StoreItem;
  brand?: string;
  bgColor?: string;
  isNew?: boolean;
  isWishlisted: boolean;
  rating?: number;
  reviewCount?: number;
  viewMode?: "grid" | "list";
  onAddToCart: () => void;
  onToggleWishlist: () => void;
  onQuickView?: () => void;
  onClick: () => void;
}

const NEUTRAL_BG_COLORS = [
  "bg-gray-100", "bg-gray-200", "bg-neutral-100",
  "bg-stone-100", "bg-zinc-100",
];

export function ProductCard({
  item,
  brand,
  bgColor,
  isNew = true,
  isWishlisted,
  rating = 4,
  reviewCount = 0,
  viewMode = "grid",
  onAddToCart,
  onToggleWishlist,
  onClick,
}: Props) {
  const discountPercent =
    item.MRP > item.SellingPrice
      ? Math.round(((item.MRP - item.SellingPrice) / item.MRP) * 100)
      : 0;

  const savings = item.MRP - item.SellingPrice;
  const cardBg =
    bgColor ||
    NEUTRAL_BG_COLORS[Math.abs(item.ItemName.length) % NEUTRAL_BG_COLORS.length];

  // LIST VIEW
  if (viewMode === "list") {
    return (
      <article
        onClick={onClick}
        className="group flex gap-3 sm:gap-4 cursor-pointer bg-white rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all p-3 sm:p-4"
      >
        <div className={`relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 shrink-0 rounded-lg ${cardBg} overflow-hidden`}>
          {item.FileUrl ? (
            <img
              src={item.FileUrl}
              alt={item.ItemName}
              loading="lazy"
              className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-3">
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 text-center line-clamp-3">
                {item.ItemName}
              </h3>
            </div>
          )}

          {isNew && (
            <div className="absolute top-1.5 left-1.5 bg-gray-900 px-1.5 py-0.5 rounded">
              <span className="text-[9px] font-semibold tracking-wider text-white uppercase">
                New
              </span>
            </div>
          )}

          {discountPercent > 0 && (
            <div className="absolute bottom-1.5 left-1.5 bg-red-500 px-1.5 py-0.5 rounded">
              <span className="text-[10px] sm:text-xs font-bold text-white">
                -{discountPercent}%
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div className="space-y-1 sm:space-y-1.5">
            {brand && (
              <p className="text-[10px] sm:text-xs font-medium tracking-wider text-gray-500 uppercase truncate">
                {brand}
              </p>
            )}

            <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-snug">
              {item.ItemName}
            </h3>

            {item.Description && (
              <p className="hidden sm:block text-xs text-gray-600 line-clamp-2">
                {item.Description}
              </p>
            )}

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 bg-green-600 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded">
                <span>{rating}</span>
                <Star size={9} className="fill-white" />
              </div>
              <span className="text-[10px] sm:text-xs text-gray-500">
                ({reviewCount > 999 ? `${Math.floor(reviewCount / 1000)}k` : reviewCount}) ratings
              </span>
            </div>

            <div className="flex items-baseline gap-2 flex-wrap pt-1">
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                ₹{item.SellingPrice.toLocaleString()}
              </span>
              {discountPercent > 0 && (
                <>
                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                    ₹{item.MRP.toLocaleString()}
                  </span>
                  <span className="text-xs sm:text-sm text-green-600 font-semibold">
                    {discountPercent}% off
                  </span>
                </>
              )}
            </div>

            {savings > 0 && (
              <p className="text-[10px] sm:text-xs text-green-600 font-medium">
                Save ₹{savings.toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
              className="flex-1 h-9 sm:h-10 rounded-lg bg-gray-900 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-black transition-colors"
            >
              <ShoppingBag size={14} strokeWidth={2} />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist();
              }}
              aria-label="Add to wishlist"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg border border-gray-300 flex items-center justify-center hover:border-gray-900 transition-all shrink-0"
            >
              <Heart
                size={16}
                strokeWidth={2}
                className={
                  isWishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600"
                }
              />
            </button>
          </div>
        </div>
      </article>
    );
  }

  // GRID VIEW — REFINED
  return (
    <article className="group flex flex-col cursor-pointer bg-white rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all">
      <div
        onClick={onClick}
        className={`relative aspect-square ${cardBg} overflow-hidden`}
      >
        {item.FileUrl ? (
          <img
            src={item.FileUrl}
            alt={item.ItemName}
            loading="lazy"
            className="h-full w-full object-contain p-2 sm:p-3 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6">
            <h3 className="text-base sm:text-xl font-semibold text-gray-800 text-center line-clamp-3">
              {item.ItemName}
            </h3>
          </div>
        )}

        {isNew && (
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-gray-900 px-1.5 sm:px-2 py-0.5 rounded">
            <span className="text-[8px] sm:text-[10px] font-semibold tracking-wider text-white uppercase">
              New
            </span>
          </div>
        )}

        {discountPercent > 0 && (
          <div className="absolute top-1.5 right-9 sm:top-2 sm:right-12 bg-red-500 px-1.5 sm:px-2 py-0.5 rounded">
            <span className="text-[10px] sm:text-xs font-bold text-white">
              -{discountPercent}%
            </span>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          aria-label="Add to wishlist"
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-gray-400 hover:shadow-md transition-all shadow-sm"
        >
          <Heart
            size={12}
            className={`sm:w-3.5 sm:h-3.5 ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="absolute bottom-0 left-0 right-0 bg-gray-900 text-white py-2 sm:py-2.5 text-[10px] sm:text-xs font-semibold hover:bg-black transition-colors sm:translate-y-full sm:group-hover:translate-y-0 sm:transition-transform sm:duration-300 flex items-center justify-center gap-1.5"
        >
          <ShoppingBag size={12} strokeWidth={2} />
          <span>Add to Cart</span>
        </button>
      </div>

      {/* Info — REFINED */}
      <div className="p-2.5 sm:p-3 space-y-1 sm:space-y-1.5">
        {brand && (
          <p className="text-[9px] sm:text-[10px] font-medium tracking-wider text-gray-500 uppercase truncate">
            {brand}
          </p>
        )}
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
          {item.ItemName}
        </h3>

        <div className="flex items-center gap-1 sm:gap-1.5">
          <div className="flex items-center gap-0.5 bg-green-600 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded">
            <span>{rating}</span>
            <Star size={8} className="fill-white" />
          </div>
          <span className="text-[10px] sm:text-xs text-gray-500">
            ({reviewCount > 999 ? `${Math.floor(reviewCount / 1000)}k` : reviewCount})
          </span>
        </div>

        <div className="flex items-baseline gap-1 sm:gap-2 pt-0.5 sm:pt-1 flex-wrap">
          <span className="text-sm sm:text-lg font-bold text-gray-900">
            ₹{item.SellingPrice.toLocaleString()}
          </span>
          {discountPercent > 0 && (
            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
              ₹{item.MRP.toLocaleString()}
            </span>
          )}
        </div>

        {savings > 0 && (
          <p className="text-[9px] sm:text-[11px] text-green-600 font-medium">
            Save ₹{savings.toLocaleString()}
          </p>
        )}
      </div>
    </article>
  );
}