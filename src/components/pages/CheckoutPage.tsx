import { useState } from "react";
import { ArrowLeft, MapPin, Plus } from "lucide-react";
import { StoreItem } from "@/types/store";
import { sendOrderViaWhatsApp } from "@/utils/whatsappHelper";

interface CartItem extends StoreItem {
  qty: number;
}

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
}

interface Props {
  cart: CartItem[];
  storeName?: string;
  storePhone?: string;
  user?: { name: string; mobile: string } | null;
  onBackToCart: () => void;
  onOrderComplete: (orderId: string) => void;
}

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: "1",
    name: "Priya Sharma",
    phone: "9876543210",
    address: "42, Rose Garden, 3rd Cross",
    city: "Tirupur",
    pincode: "641604",
    isDefault: true,
  },
  {
    id: "2",
    name: "Priya Sharma",
    phone: "9876543210",
    address: "Office block, Tech Park",
    city: "Coimbatore",
    pincode: "641014",
  },
];

export function CheckoutPage({
  cart,
  storeName = "vCartify",
  storePhone = "",
  user,
  onBackToCart,
  onOrderComplete,
}: Props) {
  const [selectedAddressId, setSelectedAddressId] = useState("1");

  const selectedAddress = DEFAULT_ADDRESSES.find((a) => a.id === selectedAddressId);
  const subtotal = cart.reduce((sum, item) => sum + item.SellingPrice * item.qty, 0);
  const total = subtotal;

  // ✨ Place Order → Direct to WhatsApp
  const handlePlaceOrder = () => {
    const orderId = `VC${Date.now().toString().slice(-8)}`;

    const addressString = selectedAddress
      ? `${selectedAddress.address}, ${selectedAddress.city} - ${selectedAddress.pincode}`
      : "";

    // ✨ DEBUG LOGS
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🛒 PLACING ORDER");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Store Name:", storeName);
    console.log("Store Phone:", storePhone);
    console.log("Cart Items:", cart.length);
    cart.forEach((item, idx) => {
      const phone = item.PhoneNumber || item.VendorPhone || storePhone;
      console.log(`  ${idx + 1}. ${item.ItemName} → Phone: ${phone}`);
    });
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Send order via WhatsApp (auto-groups by phone)
    sendOrderViaWhatsApp({
      storeName,
      storePhone,
      cart,
      subtotal,
      total,
      paymentMethod: "Contact for Payment",
      customerName: user?.name || selectedAddress?.name || "",
      customerMobile: user?.mobile || selectedAddress?.phone || "",
      address: addressString,
      orderId,
    });

    // Show success page
    onOrderComplete(orderId);
  };

  return (
    <div className="bg-white min-h-screen py-4 sm:py-8">
      <div className="mx-auto max-w-[1500px] px-3 sm:px-4">
        {/* Back to Cart */}
        <button
          onClick={onBackToCart}
          className="flex items-center gap-2 text-black font-semibold text-sm hover:underline mb-6"
        >
          <ArrowLeft size={18} strokeWidth={2} />
          Back to Cart
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-black mb-2">
            Checkout
          </h1>
          <p className="text-sm text-gray-600">
            Confirm your delivery address to place order
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Address Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin size={22} className="text-black" strokeWidth={2} />
                <h2 className="text-xl font-semibold text-black">Delivery Address</h2>
              </div>

              <div className="space-y-3 mb-6">
                {DEFAULT_ADDRESSES.map((addr) => (
                  <label
                    key={addr.id}
                    className={`block cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      selectedAddressId === addr.id
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 accent-black h-4 w-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-black">{addr.name}</span>
                          {addr.isDefault && (
                            <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                              Home
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-800">
                          {addr.address}, {addr.city} - {addr.pincode}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Phone: {addr.phone}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Add New Address */}
              <button className="flex items-center gap-2 text-black font-semibold text-sm hover:underline mb-6">
                <Plus size={16} strokeWidth={2} />
                Add New Address
              </button>

              {/* ✨ Direct Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                className="w-full h-12 rounded-lg bg-black text-white font-semibold text-base hover:bg-gray-800 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Place Order ₹{total.toLocaleString()} →
              </button>

              <p className="text-xs text-center text-gray-500 mt-3">
                📱 You'll be redirected to complete your order
              </p>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-32">
              <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.ItemName} className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 p-1">
                      {item.FileUrl ? (
                        <img
                          src={item.FileUrl}
                          alt={item.ItemName}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-black font-semibold text-[8px] text-center px-0.5 line-clamp-2">
                          {item.ItemName}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 font-medium truncate">
                        {item.ItemName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.qty}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-black">
                      ₹{(item.SellingPrice * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold text-black">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">Delivery</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-black">Total</span>
                  <span className="text-2xl font-bold text-black">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Trust Info */}
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="text-green-600">✓</span>
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="text-green-600">✓</span>
                  <span>Cash on Delivery Available</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="text-green-600">✓</span>
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}