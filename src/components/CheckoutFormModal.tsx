import { useState, useEffect } from "react";
import {
  X,
  MapPin,
  ShieldCheck,
  Loader2,
  User,
  Phone,
  Home,
  Hash,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react";
import {
  checkCustomerByMobile,
  sendOtp,
  verifyOtp,
  placeOrder,
  type SavedCustomer,
} from "../api/mockCustomerApi";

const isValidMobile = (v: string) => /^\d{10}$/.test(v);
const isValidName = (v: string) => v.trim().length >= 2;
const isValidPincode = (v: string) => /^\d{6}$/.test(v);

export interface ShippingDetails extends SavedCustomer {
  companyName: string;
}

export interface PlacedOrder {
  orderId: string;
  shipping: ShippingDetails;
}

interface Props {
  isOpen: boolean;
  companyName: string;
  cartTotal: number;
  cartCount: number;
  defaults?: SavedCustomer | null; // prefill from last successful order
  onClose: () => void;
  onOrderPlaced: (order: PlacedOrder) => void;
}

type Step = "form" | "checking" | "otp" | "placing";

// Steps shown in the progress bar. "checking"/"placing" are transient
// loading states layered on top of "form"/"otp" for progress purposes.
const STEP_ORDER: { key: Step; label: string }[] = [
  { key: "form", label: "Details" },
  { key: "otp", label: "Verify" },
  { key: "placing", label: "Confirm" },
];

function stepIndex(step: Step) {
  if (step === "checking") return 0;
  if (step === "form") return 0;
  if (step === "otp") return 1;
  return 2; // placing
}

export function CheckoutFormModal({
  isOpen,
  companyName,
  cartTotal,
  cartCount,
  defaults,
  onClose,
  onOrderPlaced,
}: Props) {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [pincode, setPincode] = useState("");
  const [touched, setTouched] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpResendCooldown, setOtpResendCooldown] = useState(0);
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep("form");
      setName(defaults?.name ?? "");
      setMobile(defaults?.mobile ?? "");
      setAddressLine1(defaults?.addressLine1 ?? "");
      setAddressLine2(defaults?.addressLine2 ?? "");
      setPincode(defaults?.pincode ?? "");
      setTouched(false);
      setOtp("");
      setOtpError("");
    }
  }, [isOpen, defaults]);

  useEffect(() => {
    if (otpResendCooldown <= 0) return;
    const t = setTimeout(() => setOtpResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [otpResendCooldown]);

  if (!isOpen) return null;

  const nameValid = isValidName(name);
  const mobileValid = isValidMobile(mobile);
  const addressValid = addressLine1.trim().length >= 4;
  const pincodeValid = isValidPincode(pincode);
  const allValid = nameValid && mobileValid && addressValid && pincodeValid;

  const currentShipping = (): ShippingDetails => ({
    name: name.trim(),
    mobile,
    companyName,
    addressLine1: addressLine1.trim(),
    addressLine2: addressLine2.trim(),
    pincode,
  });

  const finalizeOrder = async (shipping: ShippingDetails) => {
    setStep("placing");
    const { orderId } = await placeOrder({
      storeName: companyName,
      customer: shipping,
      itemCount: cartCount,
      total: cartTotal,
    });
    onOrderPlaced({ orderId, shipping });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!allValid) return;

    const shipping = currentShipping();
    setStep("checking");

    const { exists } = await checkCustomerByMobile(shipping.mobile);
    if (exists) {
      setIsNewCustomer(false);
      await finalizeOrder(shipping);
    } else {
      setIsNewCustomer(true);
      await sendOtp(shipping.mobile);
      setOtpResendCooldown(30);
      setStep("otp");
    }
  };

  const handleResendOtp = async () => {
    if (otpResendCooldown > 0) return;
    await sendOtp(mobile);
    setOtpResendCooldown(30);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 4) return;
    setOtpError("");
    const { verified } = await verifyOtp(mobile, otp);
    if (!verified) {
      setOtpError("Incorrect code. Please try again.");
      return;
    }
    await finalizeOrder(currentShipping());
  };

  const inputWrapClass = (valid: boolean) =>
    `flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gray-50 border transition-colors ${
      touched && !valid
        ? "border-red-300 ring-1 ring-red-100"
        : "border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
    }`;

  const activeStepIdx = stepIndex(step);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={step === "form" ? onClose : undefined}
      />
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---- Header ---- */}
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 px-6 pt-6 pb-8 text-white shrink-0">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 20%, #fff 1px, transparent 1px), radial-gradient(circle at 85% 60%, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                {step === "otp" ? (
                  <ShieldCheck size={22} />
                ) : (
                  <MapPin size={22} />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight">
                  {step === "otp" ? "Verify Your Number" : "Checkout"}
                </h2>
                <p className="text-xs text-white/70 mt-0.5">
                  {step === "otp"
                    ? `Confirming +91 ${mobile}`
                    : `${cartCount} item${cartCount === 1 ? "" : "s"} · ${companyName}`}
                </p>
              </div>
            </div>
            {step === "form" && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/15 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Step progress */}
          <div className="relative flex items-center gap-2 mt-6">
            {STEP_ORDER.map((s, idx) => (
              <div
                key={s.key}
                className="flex items-center flex-1 last:flex-none"
              >
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                      idx < activeStepIdx
                        ? "bg-white text-indigo-600"
                        : idx === activeStepIdx
                          ? "bg-white text-indigo-600 ring-4 ring-white/25"
                          : "bg-white/20 text-white/60"
                    }`}
                  >
                    {idx < activeStepIdx ? <CheckCircle2 size={14} /> : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide ${
                      idx <= activeStepIdx ? "text-white" : "text-white/50"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < STEP_ORDER.length - 1 && (
                  <div className="flex-1 h-0.5 mx-1.5 rounded-full bg-white/20 overflow-hidden -mt-4">
                    <div
                      className={`h-full bg-white transition-all duration-500 ${
                        idx < activeStepIdx ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ---- Step: shipping form ---- */}
        {step === "form" && (
          <form
            onSubmit={handleFormSubmit}
            className="p-6 overflow-y-auto space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Full Name
                </label>
                <div className={inputWrapClass(nameValid)}>
                  <User size={16} className="text-gray-400 shrink-0" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                </div>
                {touched && !nameValid && (
                  <p className="text-xs text-red-500 mt-1">Enter your name</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Mobile Number
                </label>
                <div className={inputWrapClass(mobileValid)}>
                  <Phone size={16} className="text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-400 shrink-0">+91</span>
                  <input
                    inputMode="numeric"
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="10-digit number"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                  />
                </div>
                {touched && !mobileValid && (
                  <p className="text-xs text-red-500 mt-1">Invalid number</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Address
              </label>
              <div className={inputWrapClass(addressValid)}>
                <Home size={16} className="text-gray-400 shrink-0" />
                <input
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="House no., street, area, city, state"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>
              {touched && !addressValid && (
                <p className="text-xs text-red-500 mt-1">Enter your address</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Landmark{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-colors">
                <MapPin size={16} className="text-gray-400 shrink-0" />
                <input
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Nearby landmark, apartment name, etc."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="w-1/2 pr-1.5">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Pincode
              </label>
              <div className={inputWrapClass(pincodeValid)}>
                <Hash size={16} className="text-gray-400 shrink-0" />
                <input
                  inputMode="numeric"
                  value={pincode}
                  onChange={(e) =>
                    setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="6-digit pincode"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                />
              </div>
              {touched && !pincodeValid && (
                <p className="text-xs text-red-500 mt-1">Invalid pincode</p>
              )}
            </div>

            {/* Order summary strip */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100 mt-2">
              <div className="flex items-center gap-2 text-indigo-700">
                <ShoppingBag size={16} />
                <span className="text-sm font-medium">
                  {cartCount} item{cartCount === 1 ? "" : "s"}
                </span>
              </div>
              <span className="text-sm font-bold text-indigo-900">
                ₹{cartTotal.toLocaleString()}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 mt-2"
            >
              Continue <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* ---- Step: checking / placing (loading) ---- */}
        {(step === "checking" || step === "placing") && (
          <div className="p-12 flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center">
                <Loader2 size={26} className="animate-spin text-indigo-600" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-800 text-sm font-semibold">
                {step === "checking"
                  ? "Checking your details…"
                  : "Placing your order…"}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                This will just take a moment
              </p>
            </div>
          </div>
        )}

        {/* ---- Step: OTP verification (new customer only) ---- */}
        {step === "otp" && (
          <form
            onSubmit={handleVerifyOtp}
            className="p-6 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <ShieldCheck size={26} className="text-indigo-600" />
              </div>
              <p className="text-sm text-gray-600">
                We've sent a 4-digit code to{" "}
                <span className="font-semibold text-gray-900">
                  +91 {mobile}
                </span>
              </p>
              {isNewCustomer && (
                <p className="text-xs text-gray-400 mt-1">
                  Looks like this is your first order with us
                </p>
              )}
            </div>

            <input
              inputMode="numeric"
              autoFocus
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 4));
                setOtpError("");
              }}
              placeholder="• • • •"
              className={`w-full text-center text-3xl font-bold tracking-[0.6em] px-4 py-4 rounded-2xl bg-gray-50 border-2 text-gray-900 outline-none transition-colors ${
                otpError
                  ? "border-red-300"
                  : "border-gray-200 focus:border-indigo-500"
              }`}
            />
            {otpError && (
              <p className="text-xs text-red-500 text-center -mt-2">
                {otpError}
              </p>
            )}

            <button
              type="submit"
              disabled={otp.length !== 4}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 disabled:shadow-none flex items-center justify-center gap-2"
            >
              Verify &amp; Place Order <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1"
              >
                <ArrowLeft size={12} /> Edit details
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={otpResendCooldown > 0}
                className="text-indigo-600 font-semibold disabled:text-gray-400"
              >
                {otpResendCooldown > 0
                  ? `Resend in ${otpResendCooldown}s`
                  : "Resend code"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
