import { useState, useEffect } from "react";
import { X, Phone, Lock, User, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";

export interface LoggedInUser {
  name: string;
  mobile: string;
}

interface Props {
  isOpen: boolean;
  reason?: "cart" | "wishlist" | "checkout" | "profile" | "orders" | null;
  onClose: () => void;
  onLoginSuccess: (user: LoggedInUser) => void;
}

type Step = "mobile" | "otp" | "signup";

export function LoginModal({ isOpen, reason, onClose, onLoginSuccess }: Props) {
  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStep("mobile");
      setMobile("");
      setOtp("");
      setName("");
      setError("");
      setLoading(false);
      setResendTimer(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const getContextMessage = () => {
    switch (reason) {
      case "cart":
        return "Sign in to add items to your cart";
      case "wishlist":
        return "Sign in to save items to your wishlist";
      case "checkout":
        return "Sign in to complete your order";
      case "orders":
        return "Sign in to view your orders";
      case "profile":
        return "Sign in to access your account";
      default:
        return "Sign in to your vCartify account";
    }
  };

  const handleSendOtp = async () => {
    setError("");
    if (!/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    console.log(`[MOCK] OTP sent to ${mobile}: 1234`);
    setLoading(false);
    setStep("otp");
    setResendTimer(30);
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (otp.length !== 4) {
      setError("Please enter the 4-digit OTP");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);

    const isExistingUser = mobile.startsWith("9");

    if (isExistingUser) {
      const user: LoggedInUser = {
        name: `User ${mobile.slice(-4)}`,
        mobile,
      };
      onLoginSuccess(user);
    } else {
      setStep("signup");
    }
  };

  const handleSignup = async () => {
    setError("");
    if (name.trim().length < 2) {
      setError("Please enter your name");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const user: LoggedInUser = {
      name: name.trim(),
      mobile,
    };
    onLoginSuccess(user);
    setLoading(false);
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setOtp("");
    setError("");
    console.log(`[MOCK] OTP resent to ${mobile}: 1234`);
    setResendTimer(30);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 z-[90] transition-opacity"
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[95] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl pointer-events-auto max-h-[95vh] overflow-y-auto">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors z-10"
          >
            <X size={22} strokeWidth={2.5} className="text-black" />
          </button>

          <div className="bg-black text-white p-6 rounded-t-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                {step === "mobile" && <Phone size={22} strokeWidth={2.5} />}
                {step === "otp" && <ShieldCheck size={22} strokeWidth={2.5} />}
                {step === "signup" && <User size={22} strokeWidth={2.5} />}
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">
                  {step === "mobile" && "Sign In / Sign Up"}
                  {step === "otp" && "Verify OTP"}
                  {step === "signup" && "Complete Profile"}
                </h2>
                <p className="text-xs text-white/80 font-semibold">
                  {getContextMessage()}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {step === "mobile" && (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-black text-black mb-2 block">
                    Mobile Number
                  </span>
                  <div className="flex items-stretch border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-black transition-colors">
                    <span className="flex items-center px-3 bg-gray-100 text-black text-sm font-black border-r-2 border-gray-300">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
                        setError("");
                      }}
                      placeholder="10-digit mobile number"
                      className="flex-1 min-w-0 px-3 py-3 text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none"
                      autoFocus
                      inputMode="numeric"
                    />
                  </div>
                </label>

                {error && (
                  <p className="text-sm text-red-600 font-bold">{error}</p>
                )}

                <button
                  onClick={handleSendOtp}
                  disabled={loading || mobile.length !== 10}
                  className="w-full h-12 rounded-lg bg-black text-white font-black text-base flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-600 font-semibold text-center pt-2">
                  By continuing, you agree to our{" "}
                  <span className="text-black font-black underline">Terms</span> &{" "}
                  <span className="text-black font-black underline">
                    Privacy Policy
                  </span>
                </p>
              </div>
            )}

            {step === "otp" && (
              <div className="space-y-4">
                <div className="bg-gray-100 border-2 border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    OTP sent to
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-black">
                      +91 {mobile}
                    </span>
                    <button
                      onClick={() => setStep("mobile")}
                      className="text-xs text-black font-black hover:underline"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <label className="block">
                  <span className="text-sm font-black text-black mb-2 block">
                    Enter 4-digit OTP
                  </span>
                  <div className="flex items-stretch border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-black transition-colors">
                    <span className="flex items-center px-3 bg-gray-100 text-black border-r-2 border-gray-300">
                      <Lock size={16} strokeWidth={2.5} />
                    </span>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 4));
                        setError("");
                      }}
                      placeholder="• • • •"
                      className="flex-1 min-w-0 px-3 py-3 text-lg font-black text-black text-center tracking-[0.5em] placeholder:text-gray-300 placeholder:tracking-normal focus:outline-none"
                      autoFocus
                      inputMode="numeric"
                    />
                  </div>
                </label>

                {error && (
                  <p className="text-sm text-red-600 font-bold">{error}</p>
                )}

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-xs text-gray-600 font-semibold">
                      Resend OTP in{" "}
                      <span className="font-black text-black">
                        {resendTimer}s
                      </span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResendOtp}
                      className="text-sm text-black font-black hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 4}
                  className="w-full h-12 rounded-lg bg-black text-white font-black text-base flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Continue
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </>
                  )}
                </button>

                <button
                  onClick={() => setStep("mobile")}
                  className="w-full h-10 rounded-lg border-2 border-gray-300 text-black font-black text-sm flex items-center justify-center gap-2 hover:border-black transition-colors"
                >
                  <ArrowLeft size={14} strokeWidth={2.5} />
                  Back
                </button>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-2">
                  <p className="text-xs text-yellow-800 font-semibold text-center">
                    💡 Demo: Use any 4-digit OTP (e.g., 1234)
                  </p>
                </div>
              </div>
            )}

            {step === "signup" && (
              <div className="space-y-4">
                <div className="text-center pb-2">
                  <p className="text-sm text-gray-600 font-semibold">
                    Welcome to vCartify! 🎉
                  </p>
                  <p className="text-xs text-gray-500 font-semibold mt-1">
                    Let's set up your account
                  </p>
                </div>

                <label className="block">
                  <span className="text-sm font-black text-black mb-2 block">
                    Your Name
                  </span>
                  <div className="flex items-stretch border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-black transition-colors">
                    <span className="flex items-center px-3 bg-gray-100 text-black border-r-2 border-gray-300">
                      <User size={16} strokeWidth={2.5} />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your full name"
                      className="flex-1 min-w-0 px-3 py-3 text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none"
                      autoFocus
                    />
                  </div>
                </label>

                {error && (
                  <p className="text-sm text-red-600 font-bold">{error}</p>
                )}

                <button
                  onClick={handleSignup}
                  disabled={loading || name.trim().length < 2}
                  className="w-full h-12 rounded-lg bg-black text-white font-black text-base flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Complete Signup
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}