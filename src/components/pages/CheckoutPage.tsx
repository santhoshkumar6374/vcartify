import { useState } from "react";
import { ArrowLeft, Check, MapPin, CreditCard, Smartphone, Building, Wallet, Package, Plus } from "lucide-react";
import { StoreItem } from "@/types/store";

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

export function CheckoutPage({ cart, onBackToCart, onOrderComplete }: Props) {
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
    onOrderComplete(orderId);
  };

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="mx-auto max-w-[1500px] px-4">
        {/* Back button */}
        <button
          onClick={step === "address" ? onBackToCart : () => setStep(step === "confirm" ? "payment" : "address")}
          className="flex items-center gap-2 text-black hover:underline mb-6 font-black"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          {step === "address" ? "Back to Cart" : "Back"}
        </button>

        {/* Progress Steps — B&W */}
        <div className="flex items-center justify-center gap-2 mb-10 max-w-2xl mx-auto">
          <StepIndicator num={1} label="Address" active={step === "address"} completed={step === "payment" || step === "confirm"} />
          <div className={`h-1 flex-1 ${step !== "address" ? "bg-black" : "bg-gray-300"}`} />
          <StepIndicator num={2} label="Payment" active={step === "payment"} completed={step === "confirm"} />
          <div className={`h-1 flex-1 ${step === "confirm" ? "bg-black" : "bg-gray-300"}`} />
          <StepIndicator num={3} label="Confirm" active={step === "confirm"} completed={false} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Step content */}
          <div className="lg:col-span-2">

            {/* ═══ Step 1: Address ═══ */}
            {step === "address" && (
              <div className="bg-white rounded-xl border-2 border-black p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin size={22} className="text-black" strokeWidth={2.5} />
                  <h2 className="text-xl font-black text-black">Delivery Address</h2>
                </div>

                <div className="space-y-3 mb-6">
                  {DEFAULT_ADDRESSES.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block cursor-pointer border-2 rounded-lg p-4 transition-all ${
                        selectedAddressId === addr.id
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-black"
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
                            <span className="font-black text-black">{addr.name}</span>
                            {addr.isDefault && (
                              <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded font-black">
                                Home
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-black font-semibold">
                            {addr.address}, {addr.city} - {addr.pincode}
                          </p>
                          <p className="text-sm text-gray-600 font-semibold mt-1">
                            Phone: {addr.phone}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <button className="flex items-center gap-2 text-black font-black text-sm hover:underline mb-6">
                  <Plus size={16} strokeWidth={2.5} />
                  Add New Address
                </button>

                <button
                  onClick={() => setStep("payment")}
                  className="w-full h-12 rounded-lg bg-black text-white font-black text-base hover:bg-gray-800 transition-all"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* ═══ Step 2: Payment ═══ */}
            {step === "payment" && (
              <div className="bg-white rounded-xl border-2 border-black p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard size={22} className="text-black" strokeWidth={2.5} />
                  <h2 className="text-xl font-black text-black">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  <PaymentOption
                    icon={<Smartphone size={20} strokeWidth={2.5} />}
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
                            className={`px-4 py-2 rounded-lg border-2 text-sm font-bold transition-colors ${
                              upiApp === app
                                ? "border-black bg-black text-white"
                                : "border-gray-300 text-black hover:border-black"
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
                        className="w-full h-11 px-4 rounded-lg border-2 border-gray-300 text-sm font-semibold text-black focus:outline-none focus:border-black transition-colors"
                      />
                    </div>
                  </PaymentOption>

                  <PaymentOption
                    icon={<CreditCard size={20} strokeWidth={2.5} />}
                    title="Credit/Debit Card"
                    desc="Visa, Mastercard, RuPay"
                    selected={paymentMethod === "card"}
                    onClick={() => setPaymentMethod("card")}
                  />

                  <PaymentOption
                    icon={<Building size={20} strokeWidth={2.5} />}
                    title="Net Banking"
                    desc="SBI, HDFC, ICICI & more"
                    selected={paymentMethod === "netbanking"}
                    onClick={() => setPaymentMethod("netbanking")}
                  />

                  <PaymentOption
                    icon={<Package size={20} strokeWidth={2.5} />}
                    title="Cash on Delivery"
                    desc="+₹40 handling fee"
                    selected={paymentMethod === "cod"}
                    onClick={() => setPaymentMethod("cod")}
                  />

                  <PaymentOption
                    icon={<Wallet size={20} strokeWidth={2.5} />}
                    title="Wallet"
                    desc="Paytm Wallet, Amazon Pay"
                    selected={paymentMethod === "wallet"}
                    onClick={() => setPaymentMethod("wallet")}
                  />
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setStep("address")}
                    className="flex-1 h-12 rounded-lg border-2 border-black text-black font-black hover:bg-gray-100 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep("confirm")}
                    className="flex-1 h-12 rounded-lg bg-black text-white font-black hover:bg-gray-800 transition-all"
                  >
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* ═══ Step 3: Confirm ═══ */}
            {step === "confirm" && (
              <div className="bg-white rounded-xl border-2 border-black p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Check size={22} className="text-black" strokeWidth={2.5} />
                  <h2 className="text-xl font-black text-black">Review & Confirm</h2>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item.ItemName} className="flex gap-3 items-center border-b-2 border-gray-100 pb-3 last:border-b-0">
                      <div className="h-14 w-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 p-1">
                        {item.FileUrl ? (
                          <img
                            src={item.FileUrl}
                            alt={item.ItemName}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-black font-black text-[10px] text-center px-1 line-clamp-2">
                            {item.ItemName}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-black text-sm truncate">{item.ItemName}</p>
                        <p className="text-xs text-gray-600 font-semibold">
                          Qty: {item.qty} × ₹{item.SellingPrice.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-black text-black">
                        ₹{(item.SellingPrice * item.qty).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Delivery info */}
                <div className="bg-gray-100 border-2 border-black rounded-lg p-4 mb-3">
                  <p className="text-xs text-black uppercase font-black mb-1 tracking-wider">
                    Delivering to:
                  </p>
                  {selectedAddress && (
                    <p className="text-sm text-black font-black">
                      {selectedAddress.name}, {selectedAddress.address}, {selectedAddress.city} - {selectedAddress.pincode}
                    </p>
                  )}
                </div>

                {/* Payment info */}
                <div className="bg-gray-100 border-2 border-black rounded-lg p-4 mb-6">
                  <p className="text-xs text-black uppercase font-black mb-1 tracking-wider">
                    Payment:
                  </p>
                  <p className="text-sm text-black font-black uppercase">
                    {paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("payment")}
                    className="flex-1 h-12 rounded-lg border-2 border-black text-black font-black hover:bg-gray-100 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 h-12 rounded-lg bg-black text-white font-black hover:bg-gray-800 transition-all"
                  >
                    PAY ₹{total.toLocaleString()} →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border-2 border-black p-6 sticky top-32">
              <h3 className="text-xs font-black tracking-widest text-black uppercase mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.ItemName} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 p-0.5">
                      {item.FileUrl ? (
                        <img
                          src={item.FileUrl}
                          alt={item.ItemName}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-black font-black text-[8px] text-center px-0.5 line-clamp-2">
                          {item.ItemName}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-black font-semibold flex-1 truncate">
                      {item.ItemName}
                    </span>
                    <span className="text-sm font-black text-black">
                      ₹{item.SellingPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-black font-semibold">Subtotal</span>
                  <span className="font-black text-black">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black font-semibold">Delivery</span>
                  <span className="text-black font-black">FREE</span>
                </div>
                {codFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-black font-semibold">COD Fee</span>
                    <span className="font-black text-black">₹{codFee}</span>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-black pt-4 mt-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-black text-black">Total</span>
                  <span className="text-2xl font-black text-black">
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

// ─── Step Indicator ────────────────────────────────
function StepIndicator({ num, label, active, completed }: {
  num: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <div
        className={`h-11 w-11 rounded-full flex items-center justify-center font-black text-sm transition-all border-2 ${
          completed
            ? "bg-black text-white border-black"
            : active
            ? "bg-black text-white border-black ring-4 ring-gray-200"
            : "bg-white text-gray-400 border-gray-300"
        }`}
      >
        {completed ? <Check size={18} strokeWidth={2.5} /> : num}
      </div>
      <span className={`text-xs font-black ${active || completed ? "text-black" : "text-gray-500"}`}>
        {label}
      </span>
    </div>
  );
}

// ─── Payment Option ────────────────────────────────
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
        selected
          ? "border-black bg-gray-50"
          : "border-gray-200 hover:border-black"
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
          selected ? "bg-black text-white" : "bg-gray-100 text-black"
        }`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-black text-black">{title}</p>
          <p className="text-xs text-gray-600 font-semibold">{desc}</p>
        </div>
      </div>
      {selected && children}
    </div>
  );
}