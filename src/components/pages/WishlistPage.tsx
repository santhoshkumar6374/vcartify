import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { StoreItem } from "@/types/store";

interface Props {
  wishlist: string[];
  allItems: StoreItem[];
  onAddToCart: (item: StoreItem, e?: React.MouseEvent) => void;
  onToggleWishlist: (name: string) => void;
  onProductClick: (item: StoreItem) => void;
  onContinueShopping: () => void;
  onClearAll?: () => void;
}

export function WishlistPage({
  wishlist,
  allItems,
  onAddToCart,
  onToggleWishlist,
  onProductClick,
  onContinueShopping,
  onClearAll,
}: Props) {
  // Get all wishlisted items with full details
  const wishlistedProducts = allItems.filter((item) =>
    wishlist.includes(item.ItemName)
  );

  // ═══════════════════════════════════════════════════
  // EMPTY WISHLIST STATE
  // ═══════════════════════════════════════════════════
  if (wishlistedProducts.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#f9f6f0] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="h-24 w-24 sm:h-28 sm:w-28 mx-auto rounded-2xl bg-[#384a35] flex items-center justify-center mb-6 shadow-md">
            <Heart size={40} className="text-[#faf7f2] sm:w-12 sm:h-12" strokeWidth={2} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#20291e] mb-2 tracking-tight">
            Your Wishlist is Empty
          </h2>
          <p className="text-sm sm:text-base text-[#6f7a6b] mb-6 font-medium px-4">
            Curate your personal collection of favored items to purchase anytime.
          </p>
          <button
            onClick={onContinueShopping}
            className="inline-flex items-center gap-2 bg-[#384a35] text-[#faf7f2] px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-[#283626] transition-colors text-sm sm:text-base shadow-xs"
          >
            Explore Catalog
            <ArrowRight size={16} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  // WISHLIST WITH ITEMS
  // ═══════════════════════════════════════════════════
  return (
    <div className="bg-[#f9f6f0] min-h-screen py-4 sm:py-8 animate-page-entrance">
      <div className="mx-auto w-full max-w-[1920px] px-2.5 sm:px-4 lg:px-6 xl:px-8">

        {/* ═══ Header ═══ */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3 pb-4 border-b border-[#e5ddd0]">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[#384a35] flex items-center justify-center shadow-xs">
              <Heart size={20} className="text-[#faf7f2] fill-[#faf7f2] sm:w-6 sm:h-6" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-serif font-bold text-[#20291e] tracking-tight">
                Saved Curations
              </h1>
              <p className="text-xs sm:text-sm text-[#6f7a6b] font-medium">
                {wishlistedProducts.length} {wishlistedProducts.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>

          {/* Clear All button */}
          {onClearAll && wishlistedProducts.length > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#9c4124] hover:underline cursor-pointer"
            >
              <Trash2 size={14} strokeWidth={2.2} />
              Clear Wishlist
            </button>
          )}
        </div>

        {/* ═══ Wishlist Items Grid ═══ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
          {wishlistedProducts.map((item) => (
            <WishlistCard
              key={item.ItemName}
              item={item}
              onAddToCart={(e) => onAddToCart(item, e)}
              onRemove={() => onToggleWishlist(item.ItemName)}
              onClick={() => onProductClick(item)}
            />
          ))}
        </div>

        {/* ═══ Bottom Action ═══ */}
        <div className="mt-8 sm:mt-12 text-center">
          <button
            onClick={onContinueShopping}
            className="inline-flex items-center gap-2 bg-[#fcfaf6] border border-[#384a35] text-[#384a35] px-8 py-3 rounded-lg font-semibold hover:bg-[#384a35] hover:text-[#faf7f2] transition-colors shadow-xs"
          >
            Continue Shopping
            <ArrowRight size={16} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Individual Wishlist Card
// ═══════════════════════════════════════════════════
interface WishlistCardProps {
  item: StoreItem;
  onAddToCart: (e?: React.MouseEvent) => void;
  onRemove: () => void;
  onClick: () => void;
}

const NEUTRAL_BG_COLORS = [
  "bg-[#f5f1e8]",
  "bg-[#efe9df]",
  "bg-[#f7f3ea]",
  "bg-[#eae4d8]",
  "bg-[#f2ece2]",
];

function WishlistCard({ item, onAddToCart, onRemove, onClick }: WishlistCardProps) {
  const discountPercent =
    item.MRP > item.SellingPrice
      ? Math.round(((item.MRP - item.SellingPrice) / item.MRP) * 100)
      : 0;

  const savings = item.MRP - item.SellingPrice;
  const cardBg =
    NEUTRAL_BG_COLORS[Math.abs(item.ItemName.length) % NEUTRAL_BG_COLORS.length];

  return (
    <article className="group h-full flex flex-col cursor-pointer bg-[#fcfaf6] rounded-lg sm:rounded-xl overflow-hidden border border-[#e5ddd0] hover:border-[#384a35] hover:shadow-lg transition-all">
      {/* Image */}
      <div
        onClick={onClick}
        className={`relative aspect-square shrink-0 ${cardBg} p-2 sm:p-2.5 overflow-hidden`}
      >
        <div className="relative h-full w-full rounded-lg sm:rounded-xl bg-white border border-[#e5ddd0]/70 flex items-center justify-center p-2 sm:p-3 overflow-hidden shadow-2xs">
          {item.FileUrl ? (
            <img
              src={item.FileUrl}
              alt={item.ItemName}
              loading="lazy"
              className="h-full w-full object-contain group-hover:scale-108 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6">
              <h3 className="text-lg sm:text-2xl font-serif font-bold text-[#20291e] text-center line-clamp-3">
                {item.ItemName}
              </h3>
            </div>
          )}
        </div>

        {/* Discount badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 bg-[#9c4124] px-1.5 sm:px-2 py-0.5 rounded-sm z-10 shadow-2xs">
            <span className="text-[10px] sm:text-xs font-bold text-[#faf7f2]">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Remove button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove from wishlist"
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#faf7f2]/95 border border-[#d8cfbf] flex items-center justify-center hover:bg-[#9c4124] hover:border-[#9c4124] transition-all shadow-xs group/remove z-20 cursor-pointer"
        >
          <Trash2
            size={14}
            className="text-[#5c6e56] group-hover/remove:text-[#faf7f2]"
            strokeWidth={2.2}
          />
        </button>

        {/* Added to Wishlist badge */}
        <div className="absolute bottom-3 left-3 sm:bottom-3.5 sm:left-3.5 bg-[#384a35] text-[#faf7f2] px-2 py-0.5 rounded-sm flex items-center gap-1 shadow-xs z-10">
          <Heart size={10} className="fill-[#faf7f2]" strokeWidth={2.5} />
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase">
            SAVED
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col">
        <div className="space-y-1 sm:space-y-1.5 mb-2.5">
          <p className="text-[9px] sm:text-[10px] font-medium tracking-wider text-[#6f7a6b] uppercase truncate">
            vCartify Curated
          </p>

          <h3 className="text-xs sm:text-sm font-semibold text-[#20291e] line-clamp-2 leading-tight">
            {item.ItemName}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-1 sm:gap-2 pt-0.5 sm:pt-1 flex-wrap">
            <span className="text-sm sm:text-lg font-bold text-[#20291e]">
              ₹{item.SellingPrice.toLocaleString()}
            </span>
            {discountPercent > 0 && (
              <span className="text-[10px] sm:text-xs text-[#8c9487] line-through">
                ₹{item.MRP.toLocaleString()}
              </span>
            )}
          </div>

          {savings > 0 && (
            <p className="text-[9px] sm:text-[11px] text-[#455840] font-medium">
              Save ₹{savings.toLocaleString()}
            </p>
          )}
        </div>

        {/* Move to Cart button — pinned to bottom of card */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(e);
          }}
          className="w-full mt-auto h-8 sm:h-9 rounded-lg bg-[#384a35] text-[#faf7f2] text-[10px] sm:text-xs font-semibold tracking-wider hover:bg-[#283626] transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
        >
          <ShoppingBag size={12} strokeWidth={2} />
          <span>MOVE TO CART</span>
        </button>
      </div>
    </article>
  );
}