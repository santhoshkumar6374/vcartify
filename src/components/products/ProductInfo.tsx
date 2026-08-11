import { Star, Minus, Plus, MapPin, Truck, RefreshCw, Wallet, CreditCard, Check } from "lucide-react";
import { useState } from "react";
import { StoreItem } from "@/types/store";

interface Props {
  item: StoreItem;
  brand?: string;
  rating?: number;
  reviewCount?: number;
}

const COLORS = [
  { name: "Red", hex: "#dc2626" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Green", hex: "#16a34a" },
  { name: "Gold", hex: "#ca8a04" },
];

export function ProductInfo({
  item,
  brand = "vCARTIFY EXCLUSIVE",
  rating = 4.3,
  reviewCount = 2543,
}: Props) {
  const [selectedColor, setSelectedColor] = useState("Red");
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<null | "checking" | "available">(null);

  const discountPercent =
    item.MRP > item.SellingPrice
      ? Math.round(((item.MRP - item.SellingPrice) / item.MRP) * 100)
      : 0;
  const savings = item.MRP - item.SellingPrice;
  const emiPerMonth = Math.round(item.SellingPrice / 24);

  const handleCheckPincode = () => {
    if (!/^\d{6}$/.test(pincode)) return;
    setDeliveryStatus("checking");
    setTimeout(() => setDeliveryStatus("available"), 800);
  };

  return (
    <div className="space-y-5">
      {/* Brand — subtle */}
      <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
        {brand}
      </p>

      {/* Product name — REFINED (semibold, not black) */}
      <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 leading-snug">
        {item.ItemName}
      </h1>

      {/* Rating + Assured — Clean */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="inline-flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
          <span>{rating}</span>
          <Star size={11} className="fill-white" />
        </div>

        <span className="text-sm text-gray-600">
          {reviewCount.toLocaleString()} ratings
        </span>

        <span className="h-4 w-px bg-gray-300" />

        <div className="inline-flex items-center gap-1 text-sm">
          <div className="h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center">
            <Check size={10} className="text-white" strokeWidth={3} />
          </div>
          <span className="text-blue-700 font-medium">vCartify Assured</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200" />

      {/* Price — REFINED (semibold, not black) */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl lg:text-4xl font-semibold text-gray-900">
            ₹{item.SellingPrice.toLocaleString()}
          </span>
          {discountPercent > 0 && (
            <>
              <span className="text-base text-gray-400 line-through">
                ₹{item.MRP.toLocaleString()}
              </span>
              <span className="text-base font-semibold text-green-600">
                {discountPercent}% off
              </span>
            </>
          )}
        </div>
        {savings > 0 && (
          <p className="text-sm text-green-700">
            You save ₹{savings.toLocaleString()} on this order
          </p>
        )}
        <p className="text-xs text-gray-500">
          Inclusive of all taxes
        </p>
      </div>

      {/* EMI Banner — Subtle */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
          <CreditCard size={16} className="text-gray-600" strokeWidth={1.8} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900">
            EMI from ₹{emiPerMonth}/month
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            No Cost EMI available on select cards
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200" />

      {/* Color Selector — Elegant circles */}
      <div>
        <div className="flex items-baseline gap-2 mb-3">
          <p className="text-sm font-medium text-gray-900">Color:</p>
          <span className="text-sm text-gray-600">{selectedColor}</span>
        </div>
        <div className="flex gap-3 flex-wrap">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color.name)}
              className="group relative"
              aria-label={`Select color ${color.name}`}
            >
              <div
                className={`h-10 w-10 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                  selectedColor === color.name
                    ? "border-gray-900 scale-110"
                    : "border-gray-300 hover:border-gray-500"
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {selectedColor === color.name && (
                  <Check size={16} className="text-white" strokeWidth={3} />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity — Clean stepper */}
      <div className="flex items-center gap-4 flex-wrap">
        <p className="text-sm font-medium text-gray-900">Quantity:</p>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-700"
            aria-label="Decrease quantity"
          >
            <Minus size={14} strokeWidth={2} />
          </button>
          <span className="w-12 text-center font-semibold text-gray-900 border-x border-gray-300">
            {qty}
          </span>
          <button
            onClick={() =>
              setQty((q) => Math.min(item.AvailableStock || 99, q + 1))
            }
            className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-700"
            aria-label="Increase quantity"
          >
            <Plus size={14} strokeWidth={2} />
          </button>
        </div>
        {item.AvailableStock && item.AvailableStock < 10 && (
          <span className="text-xs text-orange-600 font-medium">
            Only {item.AvailableStock} left
          </span>
        )}
      </div>

      {/* Delivery Check — Refined */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-blue-600" strokeWidth={2} />
          <p className="font-medium text-gray-900">Check Delivery</p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Enter 6-digit pincode"
            className="flex-1 h-10 px-4 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-200 transition-all"
            inputMode="numeric"
          />
          <button
            onClick={handleCheckPincode}
            disabled={pincode.length !== 6}
            className="h-10 px-6 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Check
          </button>
        </div>

        {deliveryStatus === "checking" && (
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
            Checking availability...
          </p>
        )}
        {deliveryStatus === "available" && (
          <p className="text-sm text-green-700 font-medium flex items-center gap-1.5">
            <Check size={14} strokeWidth={2.5} />
            Delivery available at your pincode
          </p>
        )}

        {/* Trust badges */}
        <div className="flex items-center gap-4 flex-wrap pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-sm">
            <Truck size={16} className="text-green-600" strokeWidth={2} />
            <span className="text-gray-700">Free Delivery</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <RefreshCw size={16} className="text-blue-600" strokeWidth={2} />
            <span className="text-gray-700">30 Day Returns</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Wallet size={16} className="text-orange-600" strokeWidth={2} />
            <span className="text-gray-700">COD Available</span>
          </div>
        </div>
      </div>

      {/* Sold by — Compact */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">Sold by</span>
        <span className="font-medium text-gray-900">vCartify Store</span>
        <div className="inline-flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px] font-semibold">
          <span>4.5</span>
          <Star size={9} className="fill-white" />
        </div>
      </div>
    </div>
  );
}