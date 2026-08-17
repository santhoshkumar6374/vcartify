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
} from "lucide-react";
import { StoreItem } from "@/types/store";
import { sendOrderViaWhatsApp } from "@/utils/whatsappHelper";

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

  // ✨ Place Order → Direct WhatsApp
  const handlePlaceOrder = () => {
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('[data-error="true"]');
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Save customer details
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));

    const orderId = `VC${Date.now().toString().slice(-8)}`;
    const addressString = `${customer.address}, ${customer.city} - ${customer.pincode}`;

    // ✨ DEBUG LOGS
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🛒 PLACING ORDER");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Store Name:", storeName);
    console.log("Store Phone:", storePhone);
    console.log("Customer:", customer);
    console.log("Cart Items:", cart.length);
    console.log("Total:", total);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Send order to WhatsApp
    sendOrderViaWhatsApp({
      storeName,
      storePhone,
      cart,
      subtotal,
      discount,
      total,
      paymentMethod: "Contact for Payment",
      customerName: customer.name,
      customerMobile: customer.phone,
      address: addressString,
      orderId,
    });

    // Show success page
    onOrderComplete(orderId);
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

            {/* ✨ ADDRESS FORM */}
            <div className="bg-white rounded-lg sm:rounded-xl border-2 border-black p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-black" strokeWidth={2} />
                <h3 className="font-semibold text-black text-lg">
                  Delivery Details
                </h3>
              </div>
              <p className="text-xs text-gray-600 mb-5">
                Please provide your details to place the order
              </p>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    <User size={14} className="inline mr-1" strokeWidth={2} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    placeholder="Enter your name"
                    data-error={!!errors.name}
                    className={`w-full h-11 px-4 rounded-lg border-2 text-sm text-black focus:outline-none transition-colors ${
                      errors.name
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-black"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    <Phone size={14} className="inline mr-1" strokeWidth={2} />
                    Mobile Number *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border-2 border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-sm font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) =>
                        handleFieldChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      placeholder="10-digit mobile"
                      inputMode="numeric"
                      data-error={!!errors.phone}
                      className={`flex-1 h-11 px-4 rounded-r-lg border-2 text-sm text-black focus:outline-none transition-colors ${
                        errors.phone
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray-300 focus:border-black"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    <Home size={14} className="inline mr-1" strokeWidth={2} />
                    Full Address *
                  </label>
                  <textarea
                    value={customer.address}
                    onChange={(e) => handleFieldChange("address", e.target.value)}
                    placeholder="House no, street, area, landmark"
                    rows={3}
                    data-error={!!errors.address}
                    className={`w-full px-4 py-3 rounded-lg border-2 text-sm text-black focus:outline-none transition-colors resize-none ${
                      errors.address
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-black"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.address}</p>
                  )}
                </div>

                {/* City + Pincode (side by side) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      value={customer.city}
                      onChange={(e) => handleFieldChange("city", e.target.value)}
                      placeholder="City name"
                      data-error={!!errors.city}
                      className={`w-full h-11 px-4 rounded-lg border-2 text-sm text-black focus:outline-none transition-colors ${
                        errors.city
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray-300 focus:border-black"
                      }`}
                    />
                    {errors.city && (
                      <p className="text-xs text-red-600 mt-1 font-medium">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1.5">
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
                      className={`w-full h-11 px-4 rounded-lg border-2 text-sm text-black focus:outline-none transition-colors ${
                        errors.pincode
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray-300 focus:border-black"
                      }`}
                    />
                    {errors.pincode && (
                      <p className="text-xs text-red-600 mt-1 font-medium">{errors.pincode}</p>
                    )}
                  </div>
                </div>
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
                  <span className="font-semibold text-black">
                    ₹{originalTotal.toLocaleString()}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">−₹{discount.toLocaleString()}</span>
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
                    🎉 You save ₹{discount.toLocaleString()}!
                  </p>
                </div>
              )}

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                className="w-full h-12 rounded-lg bg-black text-white font-semibold text-base flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
              >
                Place Order
                <ArrowRight size={18} strokeWidth={2} />
              </button>

              <p className="text-xs text-center text-gray-500">
                Fill delivery details to place order
              </p>

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

        {/* MOBILE: Sticky bottom bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-[10px] text-gray-600 font-medium uppercase">Total</p>
              <p className="text-xl font-bold text-black">
                ₹{total.toLocaleString()}
              </p>
              {discount > 0 && (
                <p className="text-[10px] text-green-600 font-medium">
                  Save ₹{discount.toLocaleString()}
                </p>
              )}
            </div>
            <button
              onClick={handlePlaceOrder}
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