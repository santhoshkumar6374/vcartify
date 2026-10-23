import { useEffect, useState } from "react";
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowUpRight,
  Minus,
  Plus,
} from "lucide-react";
import { StoreItem } from "@/types/store";

interface QuickViewModalProps {
  item: StoreItem | null;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (item: StoreItem, e?: React.MouseEvent, qty?: number) => void;
  onToggleWishlist: (name: string) => void;
  onViewFullDetails: (item: StoreItem) => void;
}

export function QuickViewModal({
  item,
  isWishlisted,
  onClose,
  onAddToCart,
  onToggleWishlist,
  onViewFullDetails,
}: QuickViewModalProps) {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item) return null;

  const discountPercent =
    item.MRP > item.SellingPrice
      ? Math.round(((item.MRP - item.SellingPrice) / item.MRP) * 100)
      : 0;
  const savings = item.MRP - item.SellingPrice;
  const inStock = (item.AvailableStock ?? 10) > 0;
  const brandName = item.StoreName || item.VendorName || "vCartify Curated";

  const handleAddMultiple = (e: React.MouseEvent) => {
    for (let i = 0; i < qty; i++) {
      onAddToCart(item, i === 0 ? e : undefined);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#20291e]/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-3xl bg-[#fcfaf6] rounded-3xl border border-[#d8cfbf] shadow-2xl overflow-hidden animate-page-entrance max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-3.5 right-3.5 z-20 h-9 w-9 rounded-full bg-[#fcfaf6]/90 hover:bg-[#f7ebe6] text-[#455840] hover:text-[#9c4124] border border-[#d8cfbf] flex items-center justify-center shadow-sm transition-all cursor-pointer"
        >
          <X size={18} strokeWidth={2.3} />
        </button>

        {/* Left: Product Image Stage */}
        <div className="relative md:w-1/2 bg-gradient-to-br from-[#f5f0e6] via-[#fcfaf6] to-[#ebe4d6] p-6 sm:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#e5ddd0]">
          {discountPercent > 0 && (
            <span className="absolute top-4 left-4 bg-[#9c4124] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          )}

          <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl bg-white border border-[#e5ddd0] shadow-xs p-4 flex items-center justify-center">
            {item.FileUrl ? (
              <img
                src={item.FileUrl}
                alt={item.ItemName}
                className="h-full w-full object-contain hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <span className="text-xl font-serif font-bold text-[#20291e] text-center px-3">
                {item.ItemName}
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="md:w-1/2 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#384a35] bg-[#eef2ec] px-2.5 py-1 rounded-full border border-[#c5d4c0]">
                {brandName}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  inStock
                    ? "bg-[#eef2ec] text-[#384a35] border border-[#c5d4c0]"
                    : "bg-[#f7ebe6] text-[#9c4124] border border-[#dfb8a8]"
                }`}
              >
                <CheckCircle2 size={12} />
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-bold text-[#20291e] leading-snug">
              {item.ItemName}
            </h2>

            {/* Rating Row */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 bg-[#f8f2e4] border border-[#e3d1a8] text-[#6e4f12] text-xs font-bold px-2 py-0.5 rounded-md">
                <span>4.3</span>
                <Star size={11} className="fill-[#c89b3c] text-[#c89b3c]" />
              </div>
              <span className="text-xs text-[#5c6e56] font-medium">
                Verified Quality • Assured Product
              </span>
            </div>

            {/* Price Block */}
            <div className="bg-[#f5f0e6] border border-[#e5ddd0] rounded-2xl p-3.5">
              <div className="flex items-baseline gap-2.5 flex-wrap">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#20291e]">
                  ₹{item.SellingPrice.toLocaleString()}
                </span>
                {discountPercent > 0 && (
                  <>
                    <span className="text-sm text-[#8a8275] line-through font-medium">
                      ₹{item.MRP.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-[#384a35] bg-[#eef2ec] border border-[#c5d4c0] px-2 py-0.5 rounded-full">
                      Save ₹{savings.toLocaleString()}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-[#5c6e56] mt-1">
                Inclusive of all taxes • Instant WhatsApp checkout supported
              </p>
            </div>

            {item.Description && (
              <p className="text-xs sm:text-sm text-[#455840] leading-relaxed line-clamp-3">
                {item.Description}
              </p>
            )}

            {/* Trust Perks */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex items-center gap-2 text-xs text-[#20291e] bg-[#eef2ec] border border-[#c5d4c0] rounded-xl p-2">
                <Truck size={15} className="text-[#384a35] shrink-0" />
                <span>Fast Local Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#20291e] bg-[#f8f2e4] border border-[#e3d1a8] rounded-xl p-2">
                <ShieldCheck size={15} className="text-[#b58326] shrink-0" />
                <span>100% Genuine Item</span>
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="pt-5 mt-5 border-t border-[#e5ddd0] space-y-3">
            <div className="flex items-center gap-2.5">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-[#d8cfbf] rounded-xl bg-[#f5f0e6] h-11 px-1">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-[#455840] hover:bg-[#fcfaf6] transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-bold text-[#20291e]">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-[#455840] hover:bg-[#fcfaf6] transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddMultiple}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#384a35] to-[#20291e] hover:from-[#2b3b28] hover:to-[#192117] text-[#faf7f2] text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
              >
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => onToggleWishlist(item.ItemName)}
                aria-label="Toggle wishlist"
                className={`h-11 w-11 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  isWishlisted
                    ? "bg-[#f7ebe6] border-[#d69b88] text-[#9c4124]"
                    : "bg-[#fcfaf6] border-[#d8cfbf] text-[#5c6e56] hover:border-[#9c4124] hover:text-[#9c4124]"
                }`}
              >
                <Heart
                  size={18}
                  className={isWishlisted ? "fill-[#9c4124] text-[#9c4124]" : ""}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onViewFullDetails(item);
              }}
              className="w-full py-2 text-xs font-semibold text-[#384a35] hover:text-[#20291e] flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span>View Full Product Details</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
