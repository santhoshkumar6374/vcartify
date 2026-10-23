import { useEffect, useState } from "react";
import { CheckCircle, Package, ArrowRight, Sparkles, RefreshCw } from "lucide-react";

interface Props {
  orderId: string;
  onContinueShopping: () => void;
  onViewOrders?: () => void;
}

interface BlastParticle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rot: number;
  delay: number;
  scale: number;
}

const CELEBRATION_EMOJIS = [
  "👍", "👍", "👍🏻", "👍🏼", // Thumbs-up
  "🚚", "🚚", "🛵", "📦", "📦", "🛍️", "🎁", // Delivery & parcels
  "🎉", "✨", "🥳", "🌟", "🚀" // Celebration
];

export function OrderSuccessPage({ orderId, onContinueShopping }: Props) {
  const [particles, setParticles] = useState<BlastParticle[]>([]);
  const [blastKey, setBlastKey] = useState(0);

  const triggerEmojiBlast = () => {
    // Generate 34 particles radiating outward from center
    const count = 34;
    const newParticles: BlastParticle[] = Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * 2 * Math.PI + (Math.random() * 0.3 - 0.15);
      const distance = 120 + Math.random() * 200; // outward spread
      const emoji = CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)];

      return {
        id: Date.now() + i + Math.random(),
        emoji,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 30, // slight upward bias
        rot: Math.floor(Math.random() * 360) - 180,
        delay: Math.floor(Math.random() * 280),
        scale: 0.9 + Math.random() * 0.6,
      };
    });

    setParticles(newParticles);
    setBlastKey((k) => k + 1);
  };

  useEffect(() => {
    // Blast on initial confirmation
    triggerEmojiBlast();
    // Second wave 450ms later for extra celebration
    const timer = setTimeout(() => {
      triggerEmojiBlast();
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f6f0] flex items-center justify-center p-4 relative overflow-hidden animate-page-entrance">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial from-[#384a35]/10 via-transparent to-transparent pointer-events-none" />

      {/* ═══ Emoji Blast Particles ═══ */}
      <div key={blastKey} className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute text-2xl sm:text-4xl animate-emoji-blast select-none drop-shadow-md"
            style={{
              "--blast-x": `${p.x}px`,
              "--blast-y": `${p.y}px`,
              "--blast-rot": `${p.rot}deg`,
              animationDelay: `${p.delay}ms`,
              transform: `scale(${p.scale})`,
            } as React.CSSProperties}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      <div className="max-w-md w-full bg-[#fcfaf6] rounded-3xl border border-[#d8cfbf] shadow-2xl p-6 sm:p-8 text-center relative z-10">
        {/* Success badge with animated ring */}
        <div className="relative mx-auto mb-6 h-24 w-24">
          <div className="absolute inset-0 rounded-full bg-[#384a35] animate-ping opacity-25" />
          <div className="relative h-24 w-24 rounded-full bg-[#384a35] flex items-center justify-center shadow-lg text-[#faf7f2]">
            <CheckCircle size={52} strokeWidth={2.2} />
          </div>
          {/* Sparkle decorative badge */}
          <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-[#c89b3c] flex items-center justify-center text-[#1b241a] shadow-md animate-bounce">
            <Sparkles size={16} strokeWidth={2.5} />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#384a35]/15 text-[#384a35] text-xs font-bold uppercase tracking-wider mb-2">
          <span>Order Confirmed</span>
          <span>🎉</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#20291e] mb-2 tracking-tight">
          Thank You!
        </h1>
        <p className="text-[#556350] mb-6 font-medium text-sm sm:text-base">
          Your order has been placed successfully and sent to WhatsApp for quick processing.
        </p>

        {orderId && (
          <div className="bg-[#f2ece2] border border-[#d8cfbf] rounded-2xl p-4 mb-6 text-center">
            <p className="text-[10px] text-[#6b7766] uppercase tracking-widest font-bold mb-0.5">
              Order ID
            </p>
            <p className="text-xl font-mono font-bold text-[#20291e] tracking-tight">{orderId}</p>
          </div>
        )}

        <div className="flex items-center gap-3 justify-center text-sm text-[#20291e] font-semibold mb-7 bg-[#f5f0e6] py-2.5 px-4 rounded-xl border border-[#e5ddd0]">
          <Package size={18} className="text-[#384a35]" strokeWidth={2.2} />
          <span>Expected delivery within 3-5 business days</span>
        </div>

        <div className="space-y-3">
          <button
            onClick={onContinueShopping}
            className="w-full h-12 rounded-xl bg-[#384a35] text-[#faf7f2] font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#283626] transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-98"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={18} strokeWidth={2.2} />
          </button>

          <button
            type="button"
            onClick={triggerEmojiBlast}
            className="w-full h-10 rounded-xl border border-[#d8cfbf] bg-white text-[#384a35] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#f0ebe1] transition-colors cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Replay Emoji Celebration 👍🚚🎉</span>
          </button>
        </div>
      </div>
    </div>
  );
}