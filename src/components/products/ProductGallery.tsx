import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react";
import { StoreItem } from "@/types/store";

interface Props {
  item: StoreItem;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onShare: () => void;
}

const THUMB_LABELS = ["Main", "Side View", "Detail", "Back"];

export function ProductGallery({
  item,
  isWishlisted,
  onToggleWishlist,
  onShare,
}: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [heartParticles, setHeartParticles] = useState<
    Array<{ id: number; emoji: string; x: number; y: number; rot: number; delay: number }>
  >([]);

  const triggerHeartSpread = () => {
    const emojis = ["❤️", "💖", "💕", "✨", "💗", "💘", "🥰", "💓"];
    const particles = Array.from({ length: 12 }).map((_, i) => {
      const angle = (i / 12) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
      const distance = 50 + Math.random() * 90;
      return {
        id: Date.now() + i + Math.random(),
        emoji: emojis[i % emojis.length],
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 30,
        rot: Math.floor(Math.random() * 60) - 30,
        delay: Math.floor(Math.random() * 100),
      };
    });
    setHeartParticles(particles);
    setTimeout(() => {
      setHeartParticles([]);
    }, 1150);
  };

  const handleWishlistClick = () => {
    triggerHeartSpread();
    onToggleWishlist();
  };

  const goPrev = () =>
    setActiveIdx((i) => (i - 1 + THUMB_LABELS.length) % THUMB_LABELS.length);
  const goNext = () =>
    setActiveIdx((i) => (i + 1) % THUMB_LABELS.length);

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
      {/* ═══ Thumbnails ═══ */}
      <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
        {THUMB_LABELS.map((label, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`shrink-0 h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 rounded-xl bg-[#f5f0e6] flex items-center justify-center transition-all border overflow-hidden ${
              activeIdx === idx
                ? "border-[#384a35] ring-2 ring-[#384a35]/20 shadow-xs"
                : "border-[#d8cfbf] hover:border-[#6f7a6b] opacity-80 hover:opacity-100"
            }`}
          >
            {item.FileUrl ? (
              <img
                src={item.FileUrl}
                alt={label}
                className="h-full w-full object-contain p-1"
              />
            ) : (
              <span className="text-[9px] sm:text-[10px] font-medium text-[#495445] text-center px-1">
                {label}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ═══ Main Image ═══ */}
      <div className="relative flex-1 aspect-square rounded-xl sm:rounded-2xl bg-[#fcfaf6] overflow-hidden border border-[#e5ddd0] shadow-xs group">
        {item.FileUrl ? (
          <img
            src={item.FileUrl}
            alt={item.ItemName}
            className="h-full w-full object-contain p-4 sm:p-6 lg:p-8"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f5f0e6]">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#20291e] text-center px-4 sm:px-6">
              {item.ItemName}
            </h2>
          </div>
        )}

        {/* Floating Heart Particles Spread */}
        {heartParticles.length > 0 && (
          <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden">
            {heartParticles.map((p) => (
              <span
                key={p.id}
                className="absolute text-2xl sm:text-3xl animate-heart-spread select-none"
                style={{
                  "--spread-x": `${p.x}px`,
                  "--spread-y": `${p.y}px`,
                  "--spread-rot": `${p.rot}deg`,
                  animationDelay: `${p.delay}ms`,
                } as React.CSSProperties}
              >
                {p.emoji}
              </span>
            ))}
          </div>
        )}

        {/* Top-right icons */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col gap-2 z-20">
          <button
            onClick={handleWishlistClick}
            aria-label="Add to wishlist"
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[#faf7f2] border border-[#d8cfbf] flex items-center justify-center hover:border-[#384a35] hover:scale-105 active:scale-90 transition-all shadow-xs cursor-pointer"
          >
            <Heart
              size={16}
              className={
                isWishlisted
                  ? "fill-[#8b3a2b] text-[#8b3a2b]"
                  : "text-[#495445] hover:text-[#20291e]"
              }
              strokeWidth={2}
            />
          </button>
          <button
            onClick={onShare}
            aria-label="Share product"
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[#faf7f2] border border-[#d8cfbf] flex items-center justify-center hover:border-[#384a35] hover:scale-105 transition-all shadow-xs"
          >
            <Share2 size={16} className="text-[#495445] hover:text-[#20291e]" strokeWidth={2} />
          </button>
        </div>

        {/* Prev/Next arrows */}
        <button
          onClick={goPrev}
          aria-label="Previous image"
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[#faf7f2] border border-[#d8cfbf] flex items-center justify-center hover:bg-[#384a35] hover:text-[#faf7f2] hover:border-[#384a35] transition-all shadow-xs sm:opacity-0 sm:group-hover:opacity-100 text-[#20291e]"
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>
        <button
          onClick={goNext}
          aria-label="Next image"
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[#faf7f2] border border-[#d8cfbf] flex items-center justify-center hover:bg-[#384a35] hover:text-[#faf7f2] hover:border-[#384a35] transition-all shadow-xs sm:opacity-0 sm:group-hover:opacity-100 text-[#20291e]"
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>

        {/* Image counter */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-[#243122]/75 backdrop-blur text-[#faf7f2] text-xs font-medium px-2.5 py-1 rounded-full border border-[#d8cfbf]/30">
          {activeIdx + 1} / {THUMB_LABELS.length}
        </div>
      </div>
    </div>
  );
}