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

export function CartPage({ cart, onUpdateQty, onRemove, onCheckout, onContinueShopping }: Props) {
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

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 sm:h-24 sm:w-24 mx-auto rounded-full bg-black flex items-center justify-center mb-6">
            <ShoppingCart size={32} className="text-white sm:w-10 sm:h-10" strokeWidth={2} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black mb-2 tracking-tight">
            Your cart is empty
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 font-semibold px-4">
            Looks like you haven't added anything yet.
          </p>
          <button
            onClick={onContinueShopping}
            className="inline-flex items-center gap-2 bg-black text-white px-6 sm:px-8 py-3 rounded-lg font-black hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            Continue Shopping
            <ArrowRight size={16} strokeWidth={2.5} />
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
          <ShoppingCart size={22} className="text-black sm:w-7 sm:h-7" strokeWidth={2.5} />
          <h1 className="text-xl sm:text-3xl font-black text-black tracking-tight">
            My Cart
          </h1>
          <span className="text-sm sm:text-base text-gray-600 font-bold">
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
                  className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 hover:border-black p-3 sm:p-5 transition-colors"
                >
                  <div className="flex gap-3 sm:gap-4">
                    {/* Product image */}
                    <div className="h-20 w-20 sm:h-32 sm:w-32 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 p-1 sm:p-2 border border-gray-200">
                      {item.FileUrl ? (
                        <img
                          src={item.FileUrl}
                          alt={item.ItemName}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-black font-black text-center text-[10px] sm:text-sm p-1 line-clamp-3">
                          {item.ItemName}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-black text-sm sm:text-lg mb-1 line-clamp-2">
                        {item.ItemName}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-600 font-bold mb-1 sm:mb-2 uppercase tracking-wider">
                        vCartify Exclusive
                      </p>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 flex-wrap mb-2 sm:mb-3">
                        <span className="text-base sm:text-xl font-black text-black">
                          ₹{item.SellingPrice.toLocaleString()}
                        </span>
                        {itemDiscount > 0 && (
                          <>
                            <span className="text-xs sm:text-sm text-gray-400 line-through font-semibold">
                              ₹{item.MRP.toLocaleString()}
                            </span>
                            <span className="text-xs sm:text-sm text-black font-black">
                              {itemDiscount}% off
                            </span>
                          </>
                        )}
                      </div>

                      {/* Qty + Remove */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center border-2 border-black rounded-lg overflow-hidden">
                          <button
                            onClick={() => onUpdateQty(item.ItemName, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center hover:bg-black hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-black"
                          >
                            <Minus size={12} strokeWidth={2.5} />
                          </button>
                          <span className="w-8 sm:w-10 text-center font-black text-black text-sm">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.ItemName, item.qty + 1)}
                            className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center hover:bg-black hover:text-white transition-colors text-black"
                          >
                            <Plus size={12} strokeWidth={2.5} />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemove(item.ItemName)}
                          className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-black font-black hover:underline transition-all"
                        >
                          <Trash2 size={12} strokeWidth={2.5} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Coupon Section */}
            <div className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 p-3 sm:p-5">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Tag size={16} className="text-black" strokeWidth={2.5} />
                <h3 className="font-black text-black text-base sm:text-lg">Apply Coupon</h3>
              </div>

              <div className="flex gap-2 mb-3 sm:mb-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 h-10 sm:h-11 px-3 sm:px-4 rounded-lg border-2 border-gray-300 text-sm font-semibold text-black focus:outline-none focus:border-black"
                />
                <button
                  onClick={() => handleApplyCoupon()}
                  className="h-10 sm:h-11 px-4 sm:px-6 rounded-lg bg-black text-white font-black text-sm hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
              </div>

              {appliedCoupon && (
                <div className="mb-3 bg-black text-white rounded-lg p-2 sm:p-3">
                  <p className="text-xs sm:text-sm font-black">
                    ✓ {appliedCoupon} applied! Saved ₹{couponDiscount}
                  </p>
                </div>
              )}

              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                {COUPONS.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleApplyCoupon(c.code)}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border-2 border-black text-black text-[10px] sm:text-xs font-black hover:bg-black hover:text-white transition-colors"
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Price Summary — desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl border-2 border-black p-6 space-y-4 sticky top-32">
              <PriceSummary
                cart={cart}
                originalTotal={originalTotal}
                discount={discount}
                couponDiscount={couponDiscount}
                appliedCoupon={appliedCoupon}
                total={total}
                onCheckout={onCheckout}
              />
            </div>
          </div>
        </div>

        {/* MOBILE: Sticky bottom bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black shadow-2xl z-40 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-[10px] text-gray-600 font-bold uppercase">Total</p>
              <p className="text-xl font-black text-black">
                ₹{total.toLocaleString()}
              </p>
              {discount > 0 && (
                <p className="text-[10px] text-black font-bold">
                  Save ₹{(discount + couponDiscount).toLocaleString()}
                </p>
              )}
            </div>
            <button
              onClick={onCheckout}
              className="h-12 px-6 rounded-lg bg-black text-white font-black text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shrink-0"
            >
              Place Order
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable price summary component
function PriceSummary({
  cart, originalTotal, discount, couponDiscount, appliedCoupon, total, onCheckout,
}: any) {
  return (
    <>
      <h3 className="text-xs font-black tracking-widest text-black uppercase">
        Price Details
      </h3>

      <div className="space-y-3 pt-2">
        <div className="flex justify-between text-sm">
          <span className="text-black font-semibold">Price ({cart.length} items)</span>
          <span className="font-black text-black">₹{originalTotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-black">
            <span className="font-semibold">Discount</span>
            <span className="font-black">−₹{discount.toLocaleString()}</span>
          </div>
        )}
        {couponDiscount > 0 && (
          <div className="flex justify-between text-sm text-black">
            <span className="font-semibold">Coupon ({appliedCoupon})</span>
            <span className="font-black">−₹{couponDiscount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-black font-black">Delivery</span>
          <span className="text-black font-black">FREE</span>
        </div>
      </div>

      <div className="pt-4 border-t-2 border-dashed border-black">
        <div className="flex justify-between items-baseline">
          <span className="text-lg font-black text-black">Total</span>
          <span className="text-2xl font-black text-black">
            ₹{total.toLocaleString()}
          </span>
        </div>
      </div>

      {discount > 0 && (
        <div className="bg-gray-100 border-2 border-black rounded-lg p-3 text-center">
          <p className="text-sm font-black text-black">
            🎉 You save ₹{(discount + couponDiscount).toLocaleString()}!
          </p>
        </div>
      )}

      <button
        onClick={onCheckout}
        className="w-full h-12 rounded-lg bg-black text-white font-black text-base flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
      >
        Place Order
        <ArrowRight size={18} strokeWidth={2.5} />
      </button>

      <div className="flex items-center justify-around pt-2 text-xs text-black font-bold">
        <div className="flex items-center gap-1">
          <Shield size={12} strokeWidth={2.5} />
          <span>Safe</span>
        </div>
        <div className="flex items-center gap-1">
          <Truck size={12} strokeWidth={2.5} />
          <span>Free Ship</span>
        </div>
        <div className="flex items-center gap-1">
          <RefreshCw size={12} strokeWidth={2.5} />
          <span>Returns</span>
        </div>
      </div>
    </>
  );
}