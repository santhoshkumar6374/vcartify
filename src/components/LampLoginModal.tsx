// src/components/LampLoginModal.tsx
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const isValidMobile = (v: string) => /^\d{10}$/.test(v);
const isValidName = (v: string) => v.trim().length >= 2;

interface Props {
  isOpen: boolean;
  mandatory: boolean;
  onClose: () => void;
  onLogin: (mobile: string, name: string) => void;
}

export function LampLoginModal({ isOpen, mandatory, onClose, onLogin }: Props) {
  const [lampOn, setLampOn] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [touched, setTouched] = useState(false);
  const [dragY, setDragY] = useState(0);
  // Tracks whether the person has ever grabbed the cord in this modal
  // session. Once true, the "hand pulling the cord" tutorial hint is
  // dismissed for good (until the modal is reopened).
  const [hasInteracted, setHasInteracted] = useState(false);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setLampOn(false);
      setName("");
      setMobile("");
      setTouched(false);
      setDragY(0);
      setHasInteracted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const nameValid = isValidName(name);
  const mobileValid = isValidMobile(mobile);
  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));
  const showTutorial = !lampOn && !hasInteracted;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!nameValid || !mobileValid) return;
    onLogin(mobile, name.trim());
  };

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    setHasInteracted(true);
    startYRef.current = e.clientY - dragY;
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    setDragY(clamp(e.clientY - startYRef.current, 0, 60));
  };
  const onPointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (dragY > 30) setLampOn((v) => !v);
    setDragY(0);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm"
        onClick={() => !mandatory && onClose()}
      />
      <div
        className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: lampOn ? "#1e1b2e" : "#121417",
          transition: "background 0.5s",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!mandatory && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg"
          >
            <X size={18} />
          </button>
        )}

        {/* PURPLE ambient glow instead of gold */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: lampOn ? 1 : 0,
            background:
              "radial-gradient(circle at 50% 30%, rgba(168,85,247,0.35), transparent 65%)",
          }}
        />

        {/*
          Mobile: form on top (order-1), lamp on bottom (order-2).
          md+: back to the original side-by-side layout, lamp left / form right.
        */}
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 px-5 py-8 md:p-12 min-h-[420px]">
          {/* LAMP — smaller on mobile so it doesn't dominate the card;
              back to full size once there's room to sit beside the form. */}
          <div className="relative w-[150px] h-[205px] md:w-[220px] md:h-[300px] shrink-0 flex justify-center touch-none select-none order-2 md:order-1">
            <svg
              viewBox="0 0 200 300"
              className="w-full h-full overflow-visible"
            >
              {/* inner glow - purple */}
              <ellipse
                cx="100"
                cy="110"
                rx="60"
                ry="30"
                fill="#c4b5fd"
                style={{
                  opacity: lampOn ? 0.7 : 0,
                  filter: "blur(15px)",
                  transition: "opacity 0.5s",
                }}
              />
              <rect
                x="92"
                y="100"
                width="16"
                height="160"
                rx="8"
                fill="#d1ccc2"
              />
              <rect
                x="60"
                y="250"
                width="80"
                height="12"
                rx="6"
                fill="#d1ccc2"
              />
              <g>
                <line
                  x1="130"
                  y1="110"
                  x2="130"
                  y2={180 + dragY}
                  stroke="#666"
                  strokeWidth={2}
                />
                <circle cx="130" cy={190 + dragY} r="6" fill="#a855f7" />
                <circle
                  cx="130"
                  cy={190 + dragY}
                  r="25"
                  fill="transparent"
                  style={{ cursor: "grab" }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                />
              </g>
              <path
                d="M30 110 C 30 50, 170 50, 170 110 C 170 125, 30 125, 30 110 Z"
                fill={lampOn ? "#fff" : "#f5f0e6"}
                style={{
                  filter: lampOn
                    ? "drop-shadow(0 0 30px rgba(168,85,247,0.5))"
                    : "none",
                  transition: "fill 0.5s",
                }}
              />

              {/* Tutorial hint: a drawn hand (not an emoji, so it renders
                  everywhere) that grabs the cord and pulls it down, looping
                  until the person makes their first pull attempt. Native SVG
                  <animate>/<animateTransform> so it doesn't depend on any
                  external stylesheet being applied. */}
              {showTutorial && (
                <g aria-hidden="true">
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 0,32; 0,32; 0,0; 0,0"
                      keyTimes="0; 0.4; 0.58; 0.88; 1"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0; 1; 1; 1; 0"
                      keyTimes="0; 0.1; 0.55; 0.85; 1"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                    <defs>
                      <linearGradient
                        id="lampHandSkin"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#f6cda3" />
                        <stop offset="100%" stopColor="#e8b183" />
                      </linearGradient>
                    </defs>
                    {/* curled middle / ring / pinky fingers */}
                    <path
                      d="M137 143 C136 140 139 139 140 142"
                      fill="none"
                      stroke="#c98f5c"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M141 145 C140 141 144 140 145 144"
                      fill="none"
                      stroke="#c98f5c"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M145 148 C145 144 149 144 149 148"
                      fill="none"
                      stroke="#c98f5c"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    {/* palm */}
                    <ellipse
                      cx="130"
                      cy="150"
                      rx="11"
                      ry="8"
                      fill="url(#lampHandSkin)"
                      stroke="#c98f5c"
                      strokeWidth="0.8"
                      transform="rotate(-8 130 150)"
                    />
                    {/* thumb + index pinching the cord */}
                    <path
                      d="M122 151 C118 154 118 159 124 162 C126 163 128 163 129 161"
                      fill="none"
                      stroke="url(#lampHandSkin)"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M137 149 C141 152 141 158 135 161 C133 163 131 163 130 161"
                      fill="none"
                      stroke="url(#lampHandSkin)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle cx="129.5" cy="161" r="1.4" fill="#a855f7" />
                  </g>
                </g>
              )}
            </svg>

            <p className="absolute -bottom-1 text-xs text-white/40 w-full text-center">
              {showTutorial
                ? "Pull the cord to sign in"
                : lampOn
                  ? "Pull the cord to close"
                  : "Pull the cord to sign in"}
            </p>
          </div>

          {/* FORM — width is a % of its own cell (not just capped by
              max-w-xs) so it keeps a visible, even margin on narrow phones
              instead of stretching edge-to-edge. */}
          <div
            className={`w-[90%] max-w-xs mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all duration-700 order-1 md:order-2 ${lampOn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}`}
          >
            <h2 className="text-white text-center text-lg font-semibold mb-1">
              {mandatory ? "Login to Checkout" : "Welcome!"}
            </h2>
            <p className="text-white/50 text-xs text-center mb-5">
              {mandatory
                ? "Enter your name & mobile to continue"
                : "Sign in for a faster experience"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wide">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className={`w-full px-4 py-3 rounded-xl bg-white/[.07] border text-white text-sm placeholder:text-white/30 outline-none ${touched && !nameValid ? "border-red-400/60" : "border-transparent focus:border-violet-400/60"}`}
                />
                {touched && !nameValid && (
                  <p className="text-[11px] text-red-400 mt-1">
                    At least 2 characters
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-white/40 mb-1.5 uppercase tracking-wide">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">
                    +91
                  </span>
                  <input
                    inputMode="numeric"
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="10-digit number"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/[.07] border text-white text-sm placeholder:text-white/30 outline-none ${touched && !mobileValid ? "border-red-400/60" : "border-transparent focus:border-violet-400/60"}`}
                  />
                </div>
                {touched && !mobileValid && (
                  <p className="text-[11px] text-red-400 mt-1">
                    Enter valid 10-digit number
                  </p>
                )}
              </div>

              {/* PURPLE GRADIENT BUTTON */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-br from-violet-600 via-fuchsia-500 to-indigo-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all"
              >
                Sign In
              </button>

              {!mandatory && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-1.5 text-xs text-white/40 hover:text-white/70"
                >
                  Skip for now
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
