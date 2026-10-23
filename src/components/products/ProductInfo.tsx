import { Star, Minus, Plus, MapPin, Truck, RefreshCw, Wallet, Check } from "lucide-react";
import { useState } from "react";
import { StoreItem } from "@/types/store";

interface Props {
  item: StoreItem;
  brand?: string;
  rating?: number;
  reviewCount?: number;
}

export function ProductInfo({
  item,
  brand = "vCARTIFY EXCLUSIVE",
  rating = 4.3,
  reviewCount = 2543,
}: Props) {
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<null | "checking" | "available">(null);

  const discountPercent =
    item.MRP > item.SellingPrice
      ? Math.round(((item.MRP - item.SellingPrice) / item.MRP) * 100)
      : 0;
  const savings = item.MRP - item.SellingPrice;

  const handleCheckPincode = () => {
    if (!/^\d{6}$/.test(pincode)) return;
    setDeliveryStatus("checking");
    setTimeout(() => setDeliveryStatus("available"), 800);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Brand */}
      <p className="text-[10px] sm:text-xs font-medium tracking-wider text-[#6f7a6b] uppercase">
        {brand}
      </p>

      {/* Product name */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#20291e] leading-snug">
        {item.ItemName}
      </h1>

      {/* Rating + Assured */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <div className="inline-flex items-center gap-1 bg-[#455840] text-[#faf7f2] px-2 py-0.5 rounded text-xs font-semibold">
          <span>{rating}</span>
          <Star size={10} className="fill-[#faf7f2]" />
        </div>
        <span className="text-xs sm:text-sm text-[#6f7a6b]">
          {reviewCount.toLocaleString()} ratings
        </span>
        <span className="h-4 w-px bg-[#d8cfbf]" />
        <div className="inline-flex items-center gap-1 text-xs sm:text-sm">
          <div className="h-4 w-4 rounded-full bg-[#384a35] flex items-center justify-center">
            <Check size={9} className="text-[#faf7f2]" strokeWidth={3} />
          </div>
          <span className="text-[#384a35] font-semibold">vCartify Assured</span>
        </div>
      </div>

      <div className="h-px bg-[#e5ddd0]" />

      {/* Price */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
          <span className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#20291e]">
            ₹{item.SellingPrice.toLocaleString()}
          </span>
          {discountPercent > 0 && (
            <>
              <span className="text-sm sm:text-base text-[#8c9487] line-through">
                ₹{item.MRP.toLocaleString()}
              </span>
              <span className="text-sm sm:text-base font-semibold text-[#455840]">
                {discountPercent}% off
              </span>
            </>
          )}
        </div>
        {savings > 0 && (
          <p className="text-xs sm:text-sm text-[#455840] font-medium">
            You save ₹{savings.toLocaleString()} on this order
          </p>
        )}
        <p className="text-[11px] sm:text-xs text-[#70796c]">
          Inclusive of all taxes
        </p>
      </div>

      <div className="h-px bg-[#e5ddd0]" />

      {/* Quantity */}
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
        <p className="text-sm font-medium text-[#20291e]">Quantity:</p>
        <div className="flex items-center border border-[#d8cfbf] rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center hover:bg-[#ede5d7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-[#20291e]"
            aria-label="Decrease quantity"
          >
            <Minus size={13} strokeWidth={2} />
          </button>
          <span className="w-10 sm:w-12 text-center font-semibold text-[#20291e] border-x border-[#d8cfbf]">
            {qty}
          </span>
          <button
            onClick={() =>
              setQty((q) => Math.min(item.AvailableStock || 99, q + 1))
            }
            className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center hover:bg-[#ede5d7] transition-colors text-[#20291e]"
            aria-label="Increase quantity"
          >
            <Plus size={13} strokeWidth={2} />
          </button>
        </div>
        {item.AvailableStock && item.AvailableStock < 10 && (
          <span className="text-xs text-[#9c4124] font-medium">
            Only {item.AvailableStock} left in stock
          </span>
        )}
      </div>

      {/* Delivery Check */}
      <div className="bg-[#fcfaf6] border border-[#e5ddd0] rounded-xl p-3 sm:p-4 space-y-2.5 sm:space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-[#384a35]" strokeWidth={2} />
          <p className="font-semibold text-[#20291e] text-sm sm:text-base">Check Delivery</p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="6-digit pincode"
            className="flex-1 h-9 sm:h-10 px-3 sm:px-4 rounded-lg border border-[#d8cfbf] text-sm text-[#20291e] focus:outline-none focus:border-[#384a35] bg-white transition-all"
            inputMode="numeric"
          />
          <button
            onClick={handleCheckPincode}
            disabled={pincode.length !== 6}
            className="h-9 sm:h-10 px-4 sm:px-6 rounded-lg bg-[#384a35] text-[#faf7f2] font-semibold text-sm hover:bg-[#283626] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Check
          </button>
        </div>

        {deliveryStatus === "checking" && (
          <p className="text-xs sm:text-sm text-[#6f7a6b] flex items-center gap-2">
            <div className="h-3 w-3 rounded-full border-2 border-[#6f7a6b] border-t-transparent animate-spin" />
            Checking availability...
          </p>
        )}
        {deliveryStatus === "available" && (
          <p className="text-xs sm:text-sm text-[#455840] font-medium flex items-center gap-1.5">
            <Check size={13} strokeWidth={2.5} />
            Delivery available at your pincode
          </p>
        )}

        {/* Trust badges */}
        <div className="grid grid-cols-3 sm:flex sm:items-center sm:gap-4 gap-2 pt-3 border-t border-[#e5ddd0]">
          <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
            <Truck size={14} className="text-[#384a35] shrink-0" strokeWidth={2} />
            <span className="text-[#495445] truncate">Free Delivery</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
            <RefreshCw size={14} className="text-[#384a35] shrink-0" strokeWidth={2} />
            <span className="text-[#495445] truncate">30 Day Returns</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
            <Wallet size={14} className="text-[#384a35] shrink-0" strokeWidth={2} />
            <span className="text-[#495445] truncate">COD Available</span>
          </div>
        </div>
      </div>

      {/* Sold by */}
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="text-[#6f7a6b]">Curated by</span>
        <span className="font-semibold text-[#20291e]">vCartify Artisan</span>
        <div className="inline-flex items-center gap-1 bg-[#455840] text-[#faf7f2] px-1.5 py-0.5 rounded text-[10px] font-semibold">
          <span>4.8</span>
          <Star size={8} className="fill-[#faf7f2]" />
        </div>
      </div>
    </div>
  );
}