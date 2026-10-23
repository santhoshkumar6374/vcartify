import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Shield,
  Truck,
  RefreshCw,
  ArrowRight,
  User,
  Phone,
  MapPin,
  Home,
  CreditCard,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { StoreItem } from "@/types/store";
import { sendOrderViaWhatsApp } from "@/utils/whatsappHelper";
import { openCashfreeModal } from "@/utils/cashfree";

interface CartItem extends StoreItem {
  qty: number;
}

interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

interface Props {
  cart: CartItem[];
  storeName?: string;
  storePhone?: string;
  onUpdateQty: (itemName: string, newQty: number) => void;
  onRemove: (itemName: string) => void;
  onOrderComplete: (orderId: string) => void;
  onContinueShopping: () => void;
  onOpenPolicy?: (policy: "privacy" | "terms" | "refund") => void;
}

const CUSTOMER_STORAGE_KEY = "store_customer_details";

export function CartPage({
  cart,
  storeName = "vCartify",
  storePhone = "",
  onUpdateQty,
  onRemove,
  onOrderComplete,
  onContinueShopping,
  onOpenPolicy,
}: Props) {
  // ✨ Customer details state
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [errors, setErrors] = useState<Partial<CustomerDetails>>({});
  const [paymentMethod, setPaymentMethod] = useState<"cashfree" | "whatsapp">("cashfree");
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Load saved customer details
  useEffect(() => {
    const saved = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    if (saved) {
      try {
        setCustomer(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.SellingPrice * item.qty, 0);
  const originalTotal = cart.reduce((sum, item) => sum + item.MRP * item.qty, 0);
  const discount = originalTotal - subtotal;
  const total = subtotal;

  // Handle field change
  const handleFieldChange = (field: keyof CustomerDetails, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (paymentError) setPaymentError(null);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerDetails> = {};

    if (!customer.name.trim()) newErrors.name = "Name is required";
    if (customer.name.trim().length < 2) newErrors.name = "Name too short";

    if (!customer.phone.trim()) newErrors.phone = "Phone is required";
    if (!/^\d{10}$/.test(customer.phone)) newErrors.phone = "Enter 10-digit number";

    if (!customer.address.trim()) newErrors.address = "Address is required";
    if (customer.address.trim().length < 5) newErrors.address = "Address too short";

    if (!customer.city.trim()) newErrors.city = "City is required";

    if (!customer.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!/^\d{6}$/.test(customer.pincode)) newErrors.pincode = "Enter 6-digit pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✨ Place Order → Cashfree Online or Direct WhatsApp
  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      const firstError = document.querySelector('[data-error="true"]');
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
    const orderId = `VC${Date.now().toString().slice(-8)}`;
    const addressString = `${customer.address}, ${customer.city} - ${customer.pincode}`;

    if (paymentMethod === "cashfree") {
      setIsPaying(true);
      setPaymentError(null);

      try {
        console.log("Initiating Cashfree order for ₹", total);
        const res = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            orderId,
            customerName: customer.name,
            customerPhone: customer.phone,
          }),
        });

        const data = await res.json();
        if (!data.success || !data.payment_session_id) {
          throw new Error(data.error?.message || data.message || "Failed to create payment session.");
        }

        await openCashfreeModal({
          paymentSessionId: data.payment_session_id,
          onSuccess: (paymentDetails) => {
            console.log("Cashfree payment successful:", paymentDetails);
            onOrderComplete(orderId);
          },
          onFailure: (err) => {
            setPaymentError(err?.message || "Payment cancelled or incomplete.");
          },
        });
      } catch (err: any) {
        console.error("Payment error:", err);
        setPaymentError(err.message || "Unable to initiate Cashfree payment.");
      } finally {
        setIsPaying(false);
      }
      return;
    }

    // Direct WhatsApp fallback flow
    sendOrderViaWhatsApp({
      storeName,
      storePhone,
      cart,
      subtotal,
      discount,
      total,
      paymentMethod: "WhatsApp",
      customerName: customer.name,
      customerMobile: customer.phone,
      address: addressString,
      orderId,
    });

    onOrderComplete(orderId);
  };

  // ─── Empty Cart State ─────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-[#f9f6f0] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 sm:h-24 sm:w-24 mx-auto rounded-2xl bg-[#384a35] flex items-center justify-center mb-6 shadow-md">
            <ShoppingCart size={32} className="text-[#faf7f2] sm:w-10 sm:h-10" strokeWidth={2} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#20291e] mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-sm sm:text-base text-[#6f7a6b] mb-6 px-4">
            Explore our curated catalog and discover pieces crafted for your lifestyle.
          </p>
          <button
            onClick={onContinueShopping}
            className="inline-flex items-center gap-2 bg-[#384a35] text-[#faf7f2] px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-[#283626] transition-colors text-sm sm:text-base shadow-xs"
          >
            Explore Catalog
            <ArrowRight size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f6f0] min-h-screen py-4 sm:py-8 pb-36 sm:pb-40 lg:pb-8 animate-page-entrance">
      <div className="mx-auto w-full max-w-[1920px] px-2.5 sm:px-4 lg:px-6 xl:px-8">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
          <ShoppingCart size={22} className="text-[#384a35] sm:w-7 sm:h-7" strokeWidth={2.2} />
          <h1 className="text-xl sm:text-3xl font-serif font-bold text-[#20291e]">
            Your Shopping Bag
          </h1>
          <span className="text-sm sm:text-base text-[#6f7a6b] font-medium">
            ({cart.length} {cart.length === 1 ? "item" : "items"})
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* LEFT: Cart Items + Address Form */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cart Items */}
            {cart.map((item) => {
              const itemDiscount = item.MRP > item.SellingPrice
                ? Math.round(((item.MRP - item.SellingPrice) / item.MRP) * 100)
                : 0;

              return (
                <div
                  key={item.ItemName}
                  className="bg-[#fcfaf6] rounded-xl border border-[#e5ddd0] hover:border-[#384a35] p-3 sm:p-5 transition-all shadow-xs"
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="h-20 w-20 sm:h-32 sm:w-32 rounded-lg bg-[#f5f0e6] flex items-center justify-center shrink-0 p-1 sm:p-2 border border-[#e5ddd0]">
                      {item.FileUrl ? (
                        <img
                          src={item.FileUrl}
                          alt={item.ItemName}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-[#20291e] font-serif font-semibold text-center text-[10px] sm:text-sm p-1 line-clamp-3">
                          {item.ItemName}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-semibold text-[#20291e] text-sm sm:text-lg mb-1 line-clamp-2">
                        {item.ItemName}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-[#6f7a6b] font-medium mb-1 sm:mb-2 uppercase tracking-wider">
                        vCartify Curated
                      </p>

                      <div className="flex items-baseline gap-2 flex-wrap mb-2 sm:mb-3">
                        <span className="text-base sm:text-xl font-bold text-[#20291e]">
                          ₹{item.SellingPrice.toLocaleString()}
                        </span>
                        {itemDiscount > 0 && (
                          <>
                            <span className="text-xs sm:text-sm text-[#8c9487] line-through">
                              ₹{item.MRP.toLocaleString()}
                            </span>
                            <span className="text-xs sm:text-sm text-[#455840] font-semibold">
                              {itemDiscount}% off
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center border border-[#d8cfbf] rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => onUpdateQty(item.ItemName, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center hover:bg-[#ede5d7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-[#20291e]"
                          >
                            <Minus size={12} strokeWidth={2} />
                          </button>
                          <span className="w-8 sm:w-10 text-center font-semibold text-[#20291e] text-sm border-x border-[#d8cfbf]">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.ItemName, item.qty + 1)}
                            className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center hover:bg-[#ede5d7] transition-colors text-[#20291e]"
                          >
                            <Plus size={12} strokeWidth={2} />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemove(item.ItemName)}
                          className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-[#9c4124] hover:text-[#7d2f17] font-semibold transition-colors py-1 px-2 rounded hover:bg-[#9c4124]/10"
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

            {/* ADDRESS FORM */}
            <div className="bg-[#fcfaf6] rounded-xl border border-[#384a35] p-4 sm:p-6 shadow-xs mb-8 lg:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={20} className="text-[#384a35]" strokeWidth={2.2} />
                <h3 className="font-serif font-bold text-[#20291e] text-lg">
                  Delivery Destination
                </h3>
              </div>
              <p className="text-xs text-[#6f7a6b] mb-5">
                Kindly provide your shipping details to confirm your order dispatch
              </p>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-[#20291e] mb-1.5">
                    <User size={14} className="inline mr-1 text-[#384a35]" strokeWidth={2} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    placeholder="Enter recipient's name"
                    data-error={!!errors.name}
                    className={`w-full h-11 px-4 rounded-lg border text-sm text-[#20291e] focus:outline-none bg-white transition-colors ${
                      errors.name
                        ? "border-[#9c4124] focus:border-[#7d2f17]"
                        : "border-[#d8cfbf] focus:border-[#384a35]"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-[#9c4124] mt-1 font-medium">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#20291e] mb-1.5">
                    <Phone size={14} className="inline mr-1 text-[#384a35]" strokeWidth={2} />
                    Mobile Number *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-[#d8cfbf] bg-[#ede5d7] text-[#495445] text-sm font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) =>
                        handleFieldChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      placeholder="10-digit mobile number"
                      inputMode="numeric"
                      data-error={!!errors.phone}
                      className={`flex-1 h-11 px-4 rounded-r-lg border text-sm text-[#20291e] focus:outline-none bg-white transition-colors ${
                        errors.phone
                          ? "border-[#9c4124] focus:border-[#7d2f17]"
                          : "border-[#d8cfbf] focus:border-[#384a35]"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-[#9c4124] mt-1 font-medium">{errors.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-[#20291e] mb-1.5">
                    <Home size={14} className="inline mr-1 text-[#384a35]" strokeWidth={2} />
                    Full Address *
                  </label>
                  <textarea
                    value={customer.address}
                    onChange={(e) => handleFieldChange("address", e.target.value)}
                    placeholder="House / Flat no, apartment, street, landmark"
                    rows={3}
                    data-error={!!errors.address}
                    className={`w-full px-4 py-3 rounded-lg border text-sm text-[#20291e] focus:outline-none bg-white transition-colors resize-none ${
                      errors.address
                        ? "border-[#9c4124] focus:border-[#7d2f17]"
                        : "border-[#d8cfbf] focus:border-[#384a35]"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-xs text-[#9c4124] mt-1 font-medium">{errors.address}</p>
                  )}
                </div>

                {/* City + Pincode */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#20291e] mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      value={customer.city}
                      onChange={(e) => handleFieldChange("city", e.target.value)}
                      placeholder="City name"
                      data-error={!!errors.city}
                      className={`w-full h-11 px-4 rounded-lg border text-sm text-[#20291e] focus:outline-none bg-white transition-colors ${
                        errors.city
                          ? "border-[#9c4124] focus:border-[#7d2f17]"
                          : "border-[#d8cfbf] focus:border-[#384a35]"
                      }`}
                    />
                    {errors.city && (
                      <p className="text-xs text-[#9c4124] mt-1 font-medium">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#20291e] mb-1.5">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={customer.pincode}
                      onChange={(e) =>
                        handleFieldChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="6-digit code"
                      inputMode="numeric"
                      data-error={!!errors.pincode}
                      className={`w-full h-11 px-4 rounded-lg border text-sm text-[#20291e] focus:outline-none bg-white transition-colors ${
                        errors.pincode
                          ? "border-[#9c4124] focus:border-[#7d2f17]"
                          : "border-[#d8cfbf] focus:border-[#384a35]"
                      }`}
                    />
                    {errors.pincode && (
                      <p className="text-xs text-[#9c4124] mt-1 font-medium">{errors.pincode}</p>
                    )}
                  </div>
                </div>

                {/* 💳 Payment Method Selector */}
                <div className="pt-4 border-t border-[#e5ddd0]">
                  <label className="block text-sm font-semibold text-[#20291e] mb-2.5">
                    Payment Method *
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    <label
                      onClick={() => setPaymentMethod("cashfree")}
                      className="flex items-start gap-3 p-3.5 rounded-xl border-2 border-[#384a35] bg-[#f2f6f1] cursor-pointer transition-all"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={true}
                        readOnly
                        className="mt-1 accent-[#384a35]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 font-semibold text-sm text-[#20291e]">
                          <CreditCard size={16} className="text-[#384a35]" />
                          Pay Online
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#384a35] text-white font-medium">
                            Cashfree
                          </span>
                        </div>
                        <p className="text-xs text-[#6f7a6b] mt-0.5">
                          UPI, Cards, NetBanking, Wallets
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Price Summary — Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-[#fcfaf6] rounded-xl border border-[#e5ddd0] p-6 space-y-4 sticky top-32 shadow-xs">
              <h3 className="text-xs font-semibold tracking-wider text-[#5c6e56] uppercase">
                Order Summary
              </h3>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#525d4f]">Price ({cart.length} items)</span>
                  <span className="font-semibold text-[#20291e]">
                    ₹{originalTotal.toLocaleString()}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-[#455840]">
                    <span>Discount</span>
                    <span className="font-semibold">−₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#455840] font-medium">Delivery</span>
                  <span className="text-[#455840] font-semibold">COMPLIMENTARY</span>
                </div>
              </div>

              <div className="pt-4 border-t border-dashed border-[#d8cfbf]">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-serif font-semibold text-[#20291e]">Total</span>
                  <span className="text-2xl font-sans font-bold text-[#20291e]">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {discount > 0 && (
                <div className="bg-[#eef3eb] border border-[#c9d7c5] rounded-lg p-3 text-center">
                  <p className="text-sm font-semibold text-[#384a35]">
                    🌿 You save ₹{discount.toLocaleString()} on this order!
                  </p>
                </div>
              )}

              {paymentError && (
                <div className="flex items-start gap-2 bg-[#fdf2ef] border border-[#f3c2b5] text-[#9c4124] text-xs p-3 rounded-lg">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isPaying}
                className="w-full h-12 rounded-lg bg-[#384a35] text-[#faf7f2] font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#283626] transition-all shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isPaying ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Opening Cashfree...
                  </>
                ) : (
                  <>
                    Pay ₹{total.toLocaleString()} Online
                    <ArrowRight size={18} strokeWidth={2} />
                  </>
                )}
              </button>

              <p className="text-xs text-center text-[#70796c] flex items-center justify-center gap-1.5 font-medium">
                <Shield size={13} className="text-[#384a35]" />
                100% Secure Checkout via Cashfree Gateway
              </p>

              <p className="text-[11px] text-center text-[#70796c] leading-relaxed">
                By placing this order, you agree to our{" "}
                <button
                  type="button"
                  onClick={() => onOpenPolicy?.("terms")}
                  className="text-[#384a35] underline font-medium hover:text-[#20291e]"
                >
                  Terms
                </button>
                ,{" "}
                <button
                  type="button"
                  onClick={() => onOpenPolicy?.("privacy")}
                  className="text-[#384a35] underline font-medium hover:text-[#20291e]"
                >
                  Privacy
                </button>
                , &{" "}
                <button
                  type="button"
                  onClick={() => onOpenPolicy?.("refund")}
                  className="text-[#384a35] underline font-medium hover:text-[#20291e]"
                >
                  Refund Policy
                </button>
                .
              </p>

              <div className="flex items-center justify-around pt-2 text-xs text-[#6f7a6b]">
                <div className="flex items-center gap-1">
                  <Shield size={13} className="text-[#384a35]" strokeWidth={2} />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck size={13} className="text-[#384a35]" strokeWidth={2} />
                  <span>Fast Dispatch</span>
                </div>
                <div className="flex items-center gap-1">
                  <RefreshCw size={13} className="text-[#384a35]" strokeWidth={2} />
                  <span>Easy Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE: Sticky bottom bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#fcfaf6]/95 backdrop-blur-md border-t border-[#e5ddd0] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40 p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between gap-3 max-w-xl mx-auto">
            <div className="flex-1">
              <p className="text-[10px] text-[#6f7a6b] font-semibold uppercase tracking-wider">Total</p>
              <p className="text-xl sm:text-2xl font-sans font-extrabold text-[#20291e] tracking-tight">
                ₹{total.toLocaleString()}
              </p>
              {discount > 0 && (
                <p className="text-[10px] text-[#455840] font-medium">
                  Save ₹{discount.toLocaleString()}
                </p>
              )}
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={isPaying}
              className="h-12 px-6 rounded-lg bg-[#384a35] text-[#faf7f2] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#283626] transition-all shrink-0 shadow-md disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isPaying ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay Online
                  <ArrowRight size={16} strokeWidth={2} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}