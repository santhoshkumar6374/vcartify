import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { StoreItem } from "@/types/store";

interface Props {
  wishlist: string[];
  allItems: StoreItem[];
  onAddToCart: (item: StoreItem) => void;
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
      <div className="min-h-[60vh] bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="h-24 w-24 sm:h-28 sm:w-28 mx-auto rounded-full bg-black flex items-center justify-center mb-6">
            <Heart size={40} className="text-white sm:w-12 sm:h-12" strokeWidth={2} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black mb-2 tracking-tight">
            Your wishlist is empty
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 font-semibold px-4">
            Save items you love to buy them later!
          </p>
          <button
            onClick={onContinueShopping}
            className="inline-flex items-center gap-2 bg-black text-white px-6 sm:px-8 py-3 rounded-lg font-black hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            Start Shopping
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  // WISHLIST WITH ITEMS
  // ═══════════════════════════════════════════════════
  return (
    <div className="bg-white min-h-screen py-4 sm:py-8">
      <div className="mx-auto max-w-[1500px] px-3 sm:px-4">

        {/* ═══ Header (only) — NO summary card ═══ */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3 pb-4 border-b-2 border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black flex items-center justify-center">
              <Heart size={20} className="text-white fill-white sm:w-6 sm:h-6" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-black tracking-tight">
                My Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold">
                {wishlistedProducts.length} {wishlistedProducts.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>

          {/* Clear All button */}
          {onClearAll && wishlistedProducts.length > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 text-sm font-black text-black hover:underline"
            >
              <Trash2 size={14} strokeWidth={2.5} />
              Clear All
            </button>
          )}
        </div>

        {/* ═══ Wishlist Items Grid ═══ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
          {wishlistedProducts.map((item) => (
            <WishlistCard
              key={item.ItemName}
              item={item}
              onAddToCart={() => onAddToCart(item)}
              onRemove={() => onToggleWishlist(item.ItemName)}
              onClick={() => onProductClick(item)}
            />
          ))}
        </div>

        {/* ═══ Bottom Action ═══ */}
        <div className="mt-8 sm:mt-12 text-center">
          <button
            onClick={onContinueShopping}
            className="inline-flex items-center gap-2 bg-white border-2 border-black text-black px-8 py-3 rounded-lg font-black hover:bg-black hover:text-white transition-colors"
          >
            Continue Shopping
            <ArrowRight size={16} strokeWidth={2.5} />
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
  onAddToCart: () => void;
  onRemove: () => void;
  onClick: () => void;
}

const NEUTRAL_BG_COLORS = [
  "bg-gray-100",
  "bg-gray-200",
  "bg-neutral-100",
  "bg-stone-100",
  "bg-zinc-100",
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
    <article className="group flex flex-col cursor-pointer bg-white rounded-lg sm:rounded-xl overflow-hidden border-2 border-gray-200 hover:border-black hover:shadow-lg transition-all">
      {/* Image */}
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
            <h3 className="text-lg sm:text-2xl font-black text-black text-center line-clamp-3">
              {item.ItemName}
            </h3>
          </div>
        )}

        {/* Discount badge */}
        {discountPercent > 0 && (
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-black px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
            <span className="text-[10px] sm:text-xs font-black text-white">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Remove button (top-right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove from wishlist"
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white border-2 border-black flex items-center justify-center hover:bg-black transition-all shadow-sm group/remove"
        >
          <Trash2
            size={14}
            className="text-black group-hover/remove:text-white"
            strokeWidth={2.5}
          />
        </button>

        {/* Added to Wishlist badge (bottom-left) */}
        <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 bg-black text-white px-2 py-1 rounded flex items-center gap-1">
          <Heart size={10} className="fill-white" strokeWidth={2.5} />
          <span className="text-[9px] sm:text-[10px] font-black tracking-widest">
            SAVED
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-2 sm:p-3 space-y-1 sm:space-y-1.5">
        <p className="text-[9px] sm:text-[10px] font-black tracking-widest text-gray-500 uppercase truncate">
          vCARTIFY EXCLUSIVE
        </p>

        <h3 className="text-xs sm:text-sm font-bold text-black line-clamp-2 leading-tight">
          {item.ItemName}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1 sm:gap-2 pt-0.5 sm:pt-1 flex-wrap">
          <span className="text-sm sm:text-lg font-black text-black">
            ₹{item.SellingPrice.toLocaleString()}
          </span>
          {discountPercent > 0 && (
            <span className="text-[10px] sm:text-xs text-gray-400 line-through font-semibold">
              ₹{item.MRP.toLocaleString()}
            </span>
          )}
        </div>

        {savings > 0 && (
          <p className="text-[9px] sm:text-[11px] text-black font-bold">
            Save ₹{savings.toLocaleString()}
          </p>
        )}

        {/* Move to Cart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="w-full mt-2 h-8 sm:h-9 rounded-lg bg-black text-white text-[10px] sm:text-xs font-black tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
        >
          <ShoppingBag size={12} strokeWidth={2.5} />
          <span>MOVE TO CART</span>
        </button>
      </div>
    </article>
  );
}