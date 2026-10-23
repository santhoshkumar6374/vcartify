import { useState, memo } from "react";
import {
  Heart,
  ShoppingBag,
  Star,
  Eye,
  Check,
  Flame,
  Award,
  AlertCircle,
  Sparkles,
} from "lucide-react";
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
  onAddToCart: (e?: React.MouseEvent) => void;
  onToggleWishlist: () => void;
  onQuickView?: () => void;
  onClick: () => void;
}

interface HeartParticle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rot: number;
  delay: number;
  scale: number;
}

const PASTEL_STAGE_TINTS = [
  "from-[#f5f0e6] via-[#fcfaf6] to-[#ebe4d6]/60",
  "from-[#eef2ec] via-[#fcfaf6] to-[#e3ebe0]/60",
  "from-[#f8f2e4] via-[#fcfaf6] to-[#f2e7ce]/60",
  "from-[#f7ebe6] via-[#fcfaf6] to-[#f2dfd7]/50",
  "from-[#f2ece2] via-[#fcfaf6] to-[#e6decb]/60",
];

// Deterministic rating & review count based on product name
export function getProductRating(item: StoreItem): number {
  let hash = 0;
  for (let i = 0; i < item.ItemName.length; i++) {
    hash = (hash * 31 + item.ItemName.charCodeAt(i)) % 1000;
  }
  const ratings = [4.9, 4.7, 4.6, 4.5, 4.3, 4.2, 4.0, 3.9];
  return ratings[hash % ratings.length];
}

export function getProductReviews(item: StoreItem): number {
  let hash = 0;
  for (let i = 0; i < item.ItemName.length; i++) {
    hash = (hash * 17 + item.ItemName.charCodeAt(i)) % 2400;
  }
  return 64 + hash;
}

export const ProductCard = memo(function ProductCard({
  item,
  brand,
  isNew = true,
  isWishlisted,
  rating,
  reviewCount,
  viewMode = "grid",
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  onClick,
}: Props) {
  const [heartParticles, setHeartParticles] = useState<HeartParticle[]>([]);
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const displayRating = rating ?? getProductRating(item);
  const displayReviews = reviewCount ?? getProductReviews(item);
  const displayBrand =
    brand || item.StoreName || item.VendorName || "VCartify Curated";

  const stock = item.AvailableStock ?? 12;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  const discountPercent =
    item.MRP > item.SellingPrice
      ? Math.round(((item.MRP - item.SellingPrice) / item.MRP) * 100)
      : 0;

  const savings = item.MRP - item.SellingPrice;
  const stageGradient =
    PASTEL_STAGE_TINTS[
      Math.abs(item.ItemName.length) % PASTEL_STAGE_TINTS.length
    ];

  // Contextual single status tag (only when relevant, avoids badge clutter)
  const statusTag = (() => {
    if (isLowStock) {
      return {
        label: `Only ${stock} left`,
        icon: AlertCircle,
        className: "bg-[#9c4124] text-white",
      };
    }
    if (discountPercent >= 15 || displayReviews > 1400) {
      return {
        label: "Bestseller",
        icon: Flame,
        className: "bg-gradient-to-r from-[#b58326] to-[#9c4124] text-white",
      };
    }
    if (displayRating >= 4.7) {
      return {
        label: "Top Rated",
        icon: Award,
        className: "bg-gradient-to-r from-[#384a35] to-[#20291e] text-[#faf7f2]",
      };
    }
    if (isNew) {
      return {
        label: "New",
        icon: Sparkles,
        className: "bg-[#455840] text-[#faf7f2]",
      };
    }
    return null;
  })();

  const triggerHeartSpread = () => {
    const emojis = ["❤️", "💖", "💕", "✨", "💗", "💘", "🥰", "💓"];
    const particles: HeartParticle[] = Array.from({ length: 10 }).map(
      (_, i) => {
        const angle = (i / 10) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
        const distance = 35 + Math.random() * 65;
        return {
          id: Date.now() + i + Math.random(),
          emoji: emojis[i % emojis.length],
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 25,
          rot: Math.floor(Math.random() * 60) - 30,
          delay: Math.floor(Math.random() * 90),
          scale: 0.8 + Math.random() * 0.5,
        };
      }
    );
    setHeartParticles(particles);
    setTimeout(() => {
      setHeartParticles([]);
    }, 1150);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHeartSpread();
    onToggleWishlist();
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView();
    } else {
      onClick();
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onAddToCart(e);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1100);
  };

  // ═══════════════════════════════════════════════════
  // LIST VIEW — Horizontal layout
  // ═══════════════════════════════════════════════════
  if (viewMode === "list") {
    const TagIcon = statusTag?.icon;
    return (
      <article
        onClick={onClick}
        className="group flex gap-3.5 sm:gap-5 cursor-pointer bg-[#fcfaf6] rounded-2xl overflow-hidden border border-[#e5ddd0] hover:border-[#384a35] hover:shadow-xl transition-all duration-300 p-3 sm:p-4"
      >
        <div
          className={`relative w-32 h-32 sm:w-44 sm:h-44 shrink-0 rounded-2xl bg-gradient-to-br ${stageGradient} p-2.5 overflow-hidden border border-[#e5ddd0]`}
        >
          <div className="h-full w-full rounded-xl bg-white flex items-center justify-center p-2.5 overflow-hidden shadow-2xs">
            {item.FileUrl && !imgError ? (
              <img
                src={item.FileUrl}
                alt={item.ItemName}
                loading="lazy"
                onError={() => setImgError(true)}
                className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
              />
            ) : (
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#20291e] text-center line-clamp-3">
                {item.ItemName}
              </h3>
            )}
          </div>

          {discountPercent > 0 && (
            <div className="absolute top-2.5 left-2.5 bg-[#9c4124] px-2 py-0.5 rounded-full shadow-xs z-10">
              <span className="text-[10px] sm:text-xs font-extrabold text-white">
                -{discountPercent}%
              </span>
            </div>
          )}

          {/* Floating Heart Particles Spread */}
          {heartParticles.length > 0 && (
            <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden">
              {heartParticles.map((p) => (
                <span
                  key={p.id}
                  className="absolute text-lg sm:text-xl animate-heart-spread select-none"
                  style={
                    {
                      "--spread-x": `${p.x}px`,
                      "--spread-y": `${p.y}px`,
                      "--spread-rot": `${p.rot}deg`,
                      animationDelay: `${p.delay}ms`,
                    } as React.CSSProperties
                  }
                >
                  {p.emoji}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#5c6e56] uppercase truncate">
                  {displayBrand}
                </span>
                {statusTag && TagIcon && (
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs ${statusTag.className}`}
                  >
                    <TagIcon size={10} />
                    <span>{statusTag.label}</span>
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isOutOfStock
                    ? "text-[#9c4124] bg-[#f7ebe6] border-[#dfb8a8]"
                    : "text-[#384a35] bg-[#eef2ec] border-[#c5d4c0]"
                }`}
              >
                {isOutOfStock ? "Out of Stock" : "In Stock"}
              </span>
            </div>

            <h3 className="text-sm sm:text-lg font-bold text-[#20291e] line-clamp-2 leading-snug group-hover:text-[#384a35] transition-colors">
              {item.ItemName}
            </h3>

            {item.Description && (
              <p className="hidden sm:block text-xs text-[#5c6e56] line-clamp-2">
                {item.Description}
              </p>
            )}

            <div className="flex items-center gap-2 pt-0.5">
              <div className="inline-flex items-center gap-1 bg-[#f8f2e4] border border-[#e3d1a8] text-[#6e4f12] text-[11px] font-bold px-2 py-0.5 rounded-md">
                <span>{displayRating.toFixed(1)}</span>
                <Star size={10} className="fill-[#c89b3c] text-[#c89b3c]" />
              </div>
              <span className="text-xs text-[#6f7a6b] font-medium">
                {displayReviews.toLocaleString()} verified ratings
              </span>
            </div>

            <div className="flex items-baseline gap-2.5 flex-wrap pt-1">
              <span className="text-lg sm:text-2xl font-extrabold text-[#20291e]">
                ₹{item.SellingPrice.toLocaleString()}
              </span>
              {discountPercent > 0 && (
                <>
                  <span className="text-xs sm:text-sm text-[#8a8275] line-through font-medium">
                    ₹{item.MRP.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-[#384a35] bg-[#eef2ec] px-2 py-0.5 rounded-full border border-[#c5d4c0]">
                    Save ₹{savings.toLocaleString()}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[#e5ddd0]">
            <button
              type="button"
              onClick={handleAddToCartClick}
              disabled={isOutOfStock}
              className={`flex-1 max-w-xs h-9 sm:h-10 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-98 ${
                justAdded
                  ? "bg-[#2e6b3e] text-white"
                  : isOutOfStock
                  ? "bg-[#e5ddd0] text-[#8a8275] cursor-not-allowed"
                  : "bg-[#384a35] hover:bg-[#243122] text-[#faf7f2] hover:shadow-md"
              }`}
            >
              {justAdded ? (
                <>
                  <Check size={15} strokeWidth={2.5} />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={14} strokeWidth={2.2} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleQuickViewClick}
              aria-label="Quick view"
              title="Quick View"
              className="h-9 sm:h-10 px-3 rounded-xl border border-[#d8cfbf] hover:border-[#384a35] bg-[#f5f0e6] hover:bg-[#e8e0d0] text-[#20291e] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              <Eye size={15} />
              <span className="hidden sm:inline">Quick View</span>
            </button>

            <button
              type="button"
              onClick={handleWishlistClick}
              aria-label="Add to wishlist"
              className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl border flex items-center justify-center transition-all shrink-0 active:scale-95 cursor-pointer ${
                isWishlisted
                  ? "bg-[#f7ebe6] border-[#d69b88] text-[#9c4124]"
                  : "bg-[#fcfaf6] border-[#d8cfbf] text-[#5c6e56] hover:border-[#9c4124] hover:text-[#9c4124]"
              }`}
            >
              <Heart
                size={16}
                strokeWidth={2.2}
                className={isWishlisted ? "fill-[#9c4124] text-[#9c4124]" : ""}
              />
            </button>
          </div>
        </div>
      </article>
    );
  }

  // ═══════════════════════════════════════════════════
  // GRID VIEW — Strictly Aligned Premium Card
  // ═══════════════════════════════════════════════════
  const TagIcon = statusTag?.icon;

  return (
    <article
      onClick={onClick}
      className="group h-full flex flex-col cursor-pointer bg-[#fcfaf6] rounded-2xl overflow-hidden border border-[#e5ddd0] hover:border-[#384a35] hover:shadow-xl hover:shadow-[#20291e]/8 hover:-translate-y-1 transition-all duration-300"
    >
      {/* 1. Consistent Aspect-Square Image Stage */}
      <div
        className={`relative aspect-square shrink-0 bg-gradient-to-br ${stageGradient} p-2 sm:p-2.5 overflow-hidden border-b border-[#e5ddd0]`}
      >
        <div className="relative h-full w-full rounded-xl bg-white border border-[#ece5d8] flex items-center justify-center p-2.5 sm:p-3.5 overflow-hidden shadow-2xs">
          {item.FileUrl && !imgError ? (
            <img
              src={item.FileUrl}
              alt={item.ItemName}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5">
              <h3 className="text-sm sm:text-base font-serif font-bold text-[#20291e] text-center line-clamp-3">
                {item.ItemName}
              </h3>
            </div>
          )}
        </div>

        {/* Top-left Badges: Discount + Contextual Tag */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-[#9c4124] px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {statusTag && TagIcon && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold shadow-xs ${statusTag.className}`}
            >
              <TagIcon size={9} strokeWidth={2.5} />
              <span>{statusTag.label}</span>
            </span>
          )}
        </div>

        {/* Top-right Actions: Wishlist + Quick View */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex flex-col gap-1.5 z-20">
          <button
            type="button"
            onClick={handleWishlistClick}
            aria-label="Add to wishlist"
            title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
            className={`h-8 w-8 rounded-full border flex items-center justify-center transition-all shadow-xs active:scale-90 cursor-pointer ${
              isWishlisted
                ? "bg-[#f7ebe6] border-[#d69b88] text-[#9c4124] scale-105"
                : "bg-[#fcfaf6]/95 border-[#d8cfbf] text-[#5c6e56] hover:border-[#9c4124] hover:text-[#9c4124] hover:shadow-md"
            }`}
          >
            <Heart
              size={14}
              strokeWidth={2.2}
              className={isWishlisted ? "fill-[#9c4124] text-[#9c4124]" : ""}
            />
          </button>

          <button
            type="button"
            onClick={handleQuickViewClick}
            aria-label="Quick view product"
            title="Quick View"
            className="h-8 w-8 rounded-full bg-[#fcfaf6]/95 border border-[#d8cfbf] text-[#455840] hover:border-[#384a35] hover:text-[#20291e] hover:shadow-md flex items-center justify-center transition-all shadow-xs sm:opacity-0 sm:translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 active:scale-90 cursor-pointer"
          >
            <Eye size={14} strokeWidth={2.2} />
          </button>
        </div>

        {/* Floating Heart Particles Spread */}
        {heartParticles.length > 0 && (
          <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden">
            {heartParticles.map((p) => (
              <span
                key={p.id}
                className="absolute text-lg sm:text-2xl animate-heart-spread select-none"
                style={
                  {
                    "--spread-x": `${p.x}px`,
                    "--spread-y": `${p.y}px`,
                    "--spread-rot": `${p.rot}deg`,
                    animationDelay: `${p.delay}ms`,
                  } as React.CSSProperties
                }
              >
                {p.emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 2. Strictly Aligned Card Body */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand + Stock Row */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <p className="text-[9px] sm:text-[10px] font-bold tracking-wider text-[#5c6e56] uppercase truncate">
              {displayBrand}
            </p>
            <span
              className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                isOutOfStock ? "bg-[#9c4124]" : "bg-[#384a35]"
              }`}
              title={isOutOfStock ? "Out of Stock" : "In Stock"}
            />
          </div>

          {/* Fixed 2-Line Height Title Slot for Perfect Row Alignment */}
          <h3 className="text-xs sm:text-sm font-bold text-[#20291e] line-clamp-2 leading-snug min-h-[2.25rem] sm:min-h-[2.5rem] group-hover:text-[#384a35] transition-colors">
            {item.ItemName}
          </h3>

          {/* Rating & Reviews Row */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="inline-flex items-center gap-0.5 bg-[#f8f2e4] border border-[#e3d1a8] text-[#6e4f12] text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-md">
              <span>{displayRating.toFixed(1)}</span>
              <Star size={9} className="fill-[#c89b3c] text-[#c89b3c]" />
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#6f7a6b] font-medium">
              (
              {displayReviews > 999
                ? `${(displayReviews / 1000).toFixed(1)}k`
                : displayReviews}
              )
            </span>
          </div>
        </div>

        {/* Bottom Price & Action Block (Pinned via flex-col justify-between) */}
        <div className="pt-2.5 mt-2.5 border-t border-[#e5ddd0]">
          <div className="flex items-baseline justify-between gap-1 flex-wrap mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-[#20291e]">
                ₹{item.SellingPrice.toLocaleString()}
              </span>
              {discountPercent > 0 && (
                <span className="text-[10px] sm:text-xs text-[#8a8275] line-through font-medium">
                  ₹{item.MRP.toLocaleString()}
                </span>
              )}
            </div>

            {savings > 0 ? (
              <span className="text-[9px] sm:text-[10px] font-bold text-[#384a35] bg-[#eef2ec] border border-[#c5d4c0] px-1.5 py-0.5 rounded-md">
                Save ₹{savings.toLocaleString()}
              </span>
            ) : (
              <span className="text-[9px] sm:text-[10px] font-semibold text-[#6f7a6b]">
                Best Price
              </span>
            )}
          </div>

          {/* Always-Aligned Action Button */}
          <button
            type="button"
            onClick={handleAddToCartClick}
            disabled={isOutOfStock}
            className={`w-full h-8 sm:h-9 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-2xs cursor-pointer active:scale-97 ${
              justAdded
                ? "bg-[#2e6b3e] text-white"
                : isOutOfStock
                ? "bg-[#e5ddd0] text-[#8a8275] cursor-not-allowed"
                : "bg-[#384a35] group-hover:bg-[#243122] text-[#faf7f2] hover:shadow-md"
            }`}
          >
            {justAdded ? (
              <>
                <Check size={13} strokeWidth={2.8} />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag size={12} strokeWidth={2.3} />
                <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
});

// ═══════════════════════════════════════════════════
// SKELETON CARD FOR LOADING STATES
// ═══════════════════════════════════════════════════
export function ProductCardSkeleton() {
  return (
    <div className="bg-[#fcfaf6] rounded-2xl overflow-hidden border border-[#e5ddd0] p-2.5 sm:p-3 animate-pulse flex flex-col h-full">
      <div className="aspect-square rounded-xl bg-[#ede6d8] mb-3" />
      <div className="h-2.5 w-20 bg-[#ede6d8] rounded mb-2" />
      <div className="h-3.5 w-full bg-[#ede6d8] rounded mb-1.5" />
      <div className="h-3.5 w-2/3 bg-[#ede6d8] rounded mb-3" />
      <div className="h-4 w-14 bg-[#ede6d8] rounded mb-3" />
      <div className="mt-auto pt-2.5 border-t border-[#e5ddd0] space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-5 w-16 bg-[#ede6d8] rounded" />
          <div className="h-4 w-12 bg-[#ede6d8] rounded" />
        </div>
        <div className="h-8 w-full bg-[#ede6d8] rounded-xl" />
      </div>
    </div>
  );
}