import { useState } from "react";
import { ArrowLeft, Check, MapPin, CreditCard, Smartphone, Building, Wallet, Package, Plus } from "lucide-react";
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

type CheckoutStep = "address" | "payment" | "confirm";
type PaymentMethod = "upi" | "card" | "netbanking" | "cod" | "wallet";

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
  const [step, setStep] = useState<CheckoutStep>("address");
  const [selectedAddressId, setSelectedAddressId] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [upiApp, setUpiApp] = useState("PhonePe");
  const [upiId, setUpiId] = useState("");

  const selectedAddress = DEFAULT_ADDRESSES.find((a) => a.id === selectedAddressId);
  const subtotal = cart.reduce((sum, item) => sum + item.SellingPrice * item.qty, 0);
  const codFee = paymentMethod === "cod" ? 40 : 0;
  const total = subtotal + codFee;

  const handlePlaceOrder = () => {
    const orderId = `VC${Date.now().toString().slice(-8)}`;

    const addressString = selectedAddress
      ? `${selectedAddress.address}, ${selectedAddress.city} - ${selectedAddress.pincode}`
      : "";

    const paymentLabel = {
      upi: `UPI (${upiApp})`,
      card: "Credit/Debit Card",
      netbanking: "Net Banking",
      cod: "Cash on Delivery",
      wallet: "Wallet",
    }[paymentMethod];

    // ✨ DEBUG: Show what phones will be used
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🛒 PLACING ORDER");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Store Name (fallback):", storeName);
    console.log("Store Phone (fallback):", storePhone);
    console.log("\nCart Analysis:");
    cart.forEach((item, idx) => {
      const willSendTo = item.PhoneNumber || item.VendorPhone || storePhone;
      const vendorName = item.StoreName || item.VendorName || storeName;
      console.log(`  ${idx + 1}. ${item.ItemName}`);
      console.log(`     → Vendor: ${vendorName}`);
      console.log(`     → Phone: ${willSendTo}`);
      console.log(`     → Own PhoneNumber: ${item.PhoneNumber || "❌ Uses fallback"}`);
    });
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Send order via WhatsApp - Auto-groups by phone number
    sendOrderViaWhatsApp({
      storeName,
      storePhone,
      cart,
      subtotal,
      total,
      paymentMethod: paymentLabel,
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
        <button
          onClick={step === "address" ? onBackToCart : () => setStep(step === "confirm" ? "payment" : "address")}
          className="flex items-center gap-2 text-black font-semibold text-sm hover:underline mb-6"
        >
          <ArrowLeft size={18} strokeWidth={2} />
          {step === "address" ? "Back to Cart" : "Back"}
        </button>

        <div className="flex items-center justify-center gap-2 mb-10 max-w-2xl mx-auto">
          <StepIndicator num={1} label="Address" active={step === "address"} completed={step === "payment" || step === "confirm"} />
          <div className={`h-1 flex-1 ${step !== "address" ? "bg-black" : "bg-gray-300"}`} />
          <StepIndicator num={2} label="Payment" active={step === "payment"} completed={step === "confirm"} />
          <div className={`h-1 flex-1 ${step === "confirm" ? "bg-black" : "bg-gray-300"}`} />
          <StepIndicator num={3} label="Confirm" active={step === "confirm"} completed={false} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {step === "address" && (
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

                <button className="flex items-center gap-2 text-black font-semibold text-sm hover:underline mb-6">
                  <Plus size={16} strokeWidth={2} />
                  Add New Address
                </button>

                <button
                  onClick={() => setStep("payment")}
                  className="w-full h-12 rounded-lg bg-black text-white font-semibold text-base hover:bg-gray-800 transition-all"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {step === "payment" && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard size={22} className="text-black" strokeWidth={2} />
                  <h2 className="text-xl font-semibold text-black">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  <PaymentOption
                    icon={<Smartphone size={20} strokeWidth={2} />}
                    title="UPI"
                    desc="PhonePe, GPay, Paytm"
                    selected={paymentMethod === "upi"}
                    onClick={() => setPaymentMethod("upi")}
                  >
                    <div className="pt-4 space-y-3">
                      <div className="flex gap-2 flex-wrap">
                        {["PhonePe", "Google Pay", "Paytm", "BHIM"].map((app) => (
                          <button
                            key={app}
                            onClick={() => setUpiApp(app)}
                            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                              upiApp === app
                                ? "border-black bg-black text-white"
                                : "border-gray-300 text-gray-800 hover:border-gray-500"
                            }`}
                          >
                            {app}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="Enter UPI ID (eg: yourname@gpay)"
                        className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm text-black focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                  </PaymentOption>

                  <PaymentOption
                    icon={<CreditCard size={20} strokeWidth={2} />}
                    title="Credit/Debit Card"
                    desc="Visa, Mastercard, RuPay"
                    selected={paymentMethod === "card"}
                    onClick={() => setPaymentMethod("card")}
                  />

                  <PaymentOption
                    icon={<Building size={20} strokeWidth={2} />}
                    title="Net Banking"
                    desc="SBI, HDFC, ICICI & more"
                    selected={paymentMethod === "netbanking"}
                    onClick={() => setPaymentMethod("netbanking")}
                  />

                  <PaymentOption
                    icon={<Package size={20} strokeWidth={2} />}
                    title="Cash on Delivery"
                    desc="+₹40 handling fee"
                    selected={paymentMethod === "cod"}
                    onClick={() => setPaymentMethod("cod")}
                  />

                  <PaymentOption
                    icon={<Wallet size={20} strokeWidth={2} />}
                    title="Wallet"
                    desc="Paytm Wallet, Amazon Pay"
                    selected={paymentMethod === "wallet"}
                    onClick={() => setPaymentMethod("wallet")}
                  />
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setStep("address")}
                    className="flex-1 h-12 rounded-lg border-2 border-gray-300 text-gray-800 font-semibold hover:border-black transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep("confirm")}
                    className="flex-1 h-12 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-all"
                  >
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {step === "confirm" && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Check size={22} className="text-green-600" strokeWidth={2} />
                  <h2 className="text-xl font-semibold text-black">Review & Confirm</h2>
                </div>

                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item.ItemName} className="flex gap-3 items-center border-b border-gray-100 pb-3 last:border-b-0">
                      <div className="h-14 w-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 p-1">
                        {item.FileUrl ? (
                          <img src={item.FileUrl} alt={item.ItemName} className="h-full w-full object-contain" />
                        ) : (
                          <span className="text-black font-semibold text-[10px] text-center px-1 line-clamp-2">
                            {item.ItemName}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-black text-sm truncate">{item.ItemName}</p>
                        <p className="text-xs text-gray-600">
                          Qty: {item.qty} × ₹{item.SellingPrice.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-semibold text-black">
                        ₹{(item.SellingPrice * item.qty).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1 tracking-wider">
                    Delivering to:
                  </p>
                  {selectedAddress && (
                    <p className="text-sm text-black font-medium">
                      {selectedAddress.name}, {selectedAddress.address}, {selectedAddress.city} - {selectedAddress.pincode}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1 tracking-wider">
                    Payment:
                  </p>
                  <p className="text-sm text-black font-medium">
                    {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod.toUpperCase()}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("payment")}
                    className="flex-1 h-12 rounded-lg border-2 border-gray-300 text-gray-800 font-semibold hover:border-black transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 h-12 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 hover:shadow-lg transition-all"
                  >
                    Place Order ₹{total.toLocaleString()} →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-32">
              <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.ItemName} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 p-0.5">
                      {item.FileUrl ? (
                        <img src={item.FileUrl} alt={item.ItemName} className="h-full w-full object-contain" />
                      ) : (
                        <span className="text-black font-semibold text-[8px] text-center px-0.5 line-clamp-2">
                          {item.ItemName}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-800 flex-1 truncate">
                      {item.ItemName}
                    </span>
                    <span className="text-sm font-semibold text-black">
                      ₹{item.SellingPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold text-black">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-medium">Delivery</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                {codFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">COD Fee</span>
                    <span className="font-semibold text-black">₹{codFee}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-black">Total</span>
                  <span className="text-2xl font-bold text-black">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ num, label, active, completed }: {
  num: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <div
        className={`h-11 w-11 rounded-full flex items-center justify-center font-semibold text-sm transition-all border-2 ${
          completed
            ? "bg-black text-white border-black"
            : active
            ? "bg-black text-white border-black ring-4 ring-gray-200"
            : "bg-white text-gray-400 border-gray-300"
        }`}
      >
        {completed ? <Check size={18} strokeWidth={2.5} /> : num}
      </div>
      <span className={`text-xs font-semibold ${active || completed ? "text-black" : "text-gray-500"}`}>
        {label}
      </span>
    </div>
  );
}

function PaymentOption({
  icon, title, desc, selected, onClick, children,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
        selected ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-400"
      }`}
    >
      <div className="flex items-center gap-3">
        <input
          type="radio"
          checked={selected}
          onChange={onClick}
          className="accent-black h-4 w-4"
        />
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
          selected ? "bg-black text-white" : "bg-gray-100 text-gray-700"
        }`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-black">{title}</p>
          <p className="text-xs text-gray-600">{desc}</p>
        </div>
      </div>
      {selected && children}
    </div>
  );
}