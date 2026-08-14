import { useState } from "react";
import { ShoppingCart, Minus, Plus, Trash2, Tag, Shield, Truck, RefreshCw, ArrowRight } from "lucide-react";
import { StoreItem } from "@/types/store";

interface CartItem extends StoreItem {
  qty: number;
}

interface Props {
  cart: CartItem[];
  onUpdateQty: (itemName: string, newQty: number) => void;
  onRemove: (itemName: string) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

const COUPONS = [
  { code: "VCFIRST", desc: "₹200 off" },
  { code: "SAVE10", desc: "10% off" },
  { code: "FLAT50", desc: "₹50 off" },
];

export function CartPage({
  cart,
  onUpdateQty,
  onRemove,
  onCheckout,
  onContinueShopping,
}: Props) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.SellingPrice * item.qty, 0);
  const originalTotal = cart.reduce((sum, item) => sum + item.MRP * item.qty, 0);
  const discount = originalTotal - subtotal;
  const couponDiscount = appliedCoupon ? 200 : 0;
  const total = subtotal - couponDiscount;

  const handleApplyCoupon = (code?: string) => {
    const finalCode = code || couponCode.toUpperCase();
    const valid = COUPONS.find((c) => c.code === finalCode);
    if (valid) {
      setAppliedCoupon(finalCode);
      setCouponCode(finalCode);
    } else {
      alert("Invalid coupon code");
    }
  };

  // ─── Empty Cart State ─────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 sm:h-24 sm:w-24 mx-auto rounded-full bg-black flex items-center justify-center mb-6">
            <ShoppingCart size={32} className="text-white sm:w-10 sm:h-10" strokeWidth={2} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-black mb-2">
            Your cart is empty
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
            Looks like you haven't added anything yet.
          </p>
          <button
            onClick={onContinueShopping}
            className="inline-flex items-center gap-2 bg-black text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            Continue Shopping
            <ArrowRight size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-4 sm:py-8 pb-24 lg:pb-8">
      <div className="mx-auto max-w-[1500px] px-3 sm:px-4">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
          <ShoppingCart size={22} className="text-black sm:w-7 sm:h-7" strokeWidth={2} />
          <h1 className="text-xl sm:text-3xl font-semibold text-black">
            My Cart
          </h1>
          <span className="text-sm sm:text-base text-gray-600">
            ({cart.length})
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* LEFT: Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cart.map((item) => {
              const itemDiscount = item.MRP > item.SellingPrice
                ? Math.round(((item.MRP - item.SellingPrice) / item.MRP) * 100)
                : 0;

              return (
                <div
                  key={item.ItemName}
                  className="bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-gray-400 p-3 sm:p-5 transition-colors"
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="h-20 w-20 sm:h-32 sm:w-32 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 p-1 sm:p-2 border border-gray-200">
                      {item.FileUrl ? (
                        <img
                          src={item.FileUrl}
                          alt={item.ItemName}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-black font-semibold text-center text-[10px] sm:text-sm p-1 line-clamp-3">
                          {item.ItemName}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-black text-sm sm:text-lg mb-1 line-clamp-2">
                        {item.ItemName}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-600 font-medium mb-1 sm:mb-2 uppercase tracking-wider">
                        vCartify Exclusive
                      </p>

                      <div className="flex items-baseline gap-2 flex-wrap mb-2 sm:mb-3">
                        <span className="text-base sm:text-xl font-bold text-black">
                          ₹{item.SellingPrice.toLocaleString()}
                        </span>
                        {itemDiscount > 0 && (
                          <>
                            <span className="text-xs sm:text-sm text-gray-400 line-through">
                              ₹{item.MRP.toLocaleString()}
                            </span>
                            <span className="text-xs sm:text-sm text-green-600 font-semibold">
                              {itemDiscount}% off
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() => onUpdateQty(item.ItemName, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-gray-700"
                          >
                            <Minus size={12} strokeWidth={2} />
                          </button>
                          <span className="w-8 sm:w-10 text-center font-semibold text-black text-sm">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.ItemName, item.qty + 1)}
                            className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-700"
                          >
                            <Plus size={12} strokeWidth={2} />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemove(item.ItemName)}
                          className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-600 hover:text-red-600 font-medium transition-colors"
                        >
                          <Trash2 size={12} strokeWidth={2} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Coupon Section */}
            <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-5">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Tag size={16} className="text-orange-500" fill="currentColor" strokeWidth={0} />
                <h3 className="font-semibold text-black text-base sm:text-lg">Apply Coupon</h3>
              </div>

              <div className="flex gap-2 mb-3 sm:mb-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 h-10 sm:h-11 px-3 sm:px-4 rounded-lg border border-gray-300 text-sm text-black focus:outline-none focus:border-black transition-colors"
                />
                <button
                  onClick={() => handleApplyCoupon()}
                  className="h-10 sm:h-11 px-4 sm:px-6 rounded-lg bg-black text-white font-medium text-sm hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
              </div>

              {appliedCoupon && (
                <div className="mb-3 bg-green-50 border border-green-200 text-green-800 rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-semibold">
                    ✓ {appliedCoupon} applied! Saved ₹{couponDiscount}
                  </p>
                </div>
              )}

              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                {COUPONS.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleApplyCoupon(c.code)}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-300 text-gray-800 text-[10px] sm:text-xs font-semibold hover:border-black hover:bg-gray-100 transition-colors"
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Price Summary — Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 sticky top-32">
              <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Price Details
              </h3>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Price ({cart.length} items)</span>
                  <span className="font-semibold text-black">₹{originalTotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">−₹{discount.toLocaleString()}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Coupon ({appliedCoupon})</span>
                    <span className="font-semibold">−₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">Delivery</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
              </div>

              <div className="pt-4 border-t border-dashed border-gray-300">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-semibold text-black">Total</span>
                  <span className="text-2xl font-bold text-black">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {discount > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-sm font-semibold text-green-700">
                    🎉 You save ₹{(discount + couponDiscount).toLocaleString()}!
                  </p>
                </div>
              )}

              {/* Only Place Order button */}
              <button
                onClick={onCheckout}
                className="w-full h-12 rounded-lg bg-black text-white font-semibold text-base flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
              >
                Place Order
                <ArrowRight size={18} strokeWidth={2} />
              </button>

              <div className="flex items-center justify-around pt-2 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Shield size={12} strokeWidth={2} />
                  <span>Safe</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck size={12} strokeWidth={2} />
                  <span>Free Ship</span>
                </div>
                <div className="flex items-center gap-1">
                  <RefreshCw size={12} strokeWidth={2} />
                  <span>Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE: Sticky bottom bar — Only Place Order */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-[10px] text-gray-600 font-medium uppercase">Total</p>
              <p className="text-xl font-bold text-black">
                ₹{total.toLocaleString()}
              </p>
              {discount > 0 && (
                <p className="text-[10px] text-green-600 font-medium">
                  Save ₹{(discount + couponDiscount).toLocaleString()}
                </p>
              )}
            </div>
            <button
              onClick={onCheckout}
              className="h-12 px-6 rounded-lg bg-black text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shrink-0"
            >
              Place Order
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}