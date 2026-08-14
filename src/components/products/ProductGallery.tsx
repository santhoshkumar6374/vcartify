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

  const goPrev = () =>
    setActiveIdx((i) => (i - 1 + THUMB_LABELS.length) % THUMB_LABELS.length);
  const goNext = () =>
    setActiveIdx((i) => (i + 1) % THUMB_LABELS.length);

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
      {/* ═══ Thumbnails — Horizontal on mobile, vertical on desktop ═══ */}
      <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
        {THUMB_LABELS.map((label, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`shrink-0 h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20 rounded-lg bg-gray-100 flex items-center justify-center transition-all border-2 overflow-hidden ${
              activeIdx === idx
                ? "border-gray-900 shadow-md"
                : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
            }`}
          >
            {item.FileUrl ? (
              <img
                src={item.FileUrl}
                alt={label}
                className="h-full w-full object-contain p-1"
              />
            ) : (
              <span className="text-[9px] sm:text-[10px] font-medium text-gray-700 text-center px-1">
                {label}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ═══ Main Image ═══ */}
      <div className="relative flex-1 aspect-square rounded-xl sm:rounded-2xl bg-white overflow-hidden border border-gray-200 shadow-sm group">
        {item.FileUrl ? (
          <img
            src={item.FileUrl}
            alt={item.ItemName}
            className="h-full w-full object-contain p-4 sm:p-6 lg:p-8"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 text-center px-4 sm:px-6">
              {item.ItemName}
            </h2>
          </div>
        )}

        {/* Top-right icons — Always visible on mobile */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col gap-2">
          <button
            onClick={onToggleWishlist}
            aria-label="Add to wishlist"
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-gray-400 hover:scale-110 transition-all shadow-md"
          >
            <Heart
              size={16}
              className={
                isWishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 hover:text-gray-900"
              }
              strokeWidth={2}
            />
          </button>
          <button
            onClick={onShare}
            aria-label="Share product"
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-gray-400 hover:scale-110 transition-all shadow-md"
          >
            <Share2 size={16} className="text-gray-600 hover:text-gray-900" strokeWidth={2} />
          </button>
        </div>

        {/* Prev/Next arrows — Always visible on mobile */}
        <button
          onClick={goPrev}
          aria-label="Previous image"
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-md sm:opacity-0 sm:group-hover:opacity-100"
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>
        <button
          onClick={goNext}
          aria-label="Next image"
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-md sm:opacity-0 sm:group-hover:opacity-100"
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>

        {/* Image counter */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {activeIdx + 1} / {THUMB_LABELS.length}
        </div>
      </div>
    </div>
  );
}