import { Star, MessageCircle } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  name: string;
  date: string;
  comment: string;
}

const REVIEWS: Review[] = [
  {
    id: "1",
    rating: 5,
    name: "Priya M.",
    date: "Aug 2, 2026",
    comment: "Absolutely love this product! Quality is amazing and delivery was fast.",
  },
  {
    id: "2",
    rating: 4,
    name: "Rahul K.",
    date: "Jul 28, 2026",
    comment: "Good product for the price. Matches the description well.",
  },
  {
    id: "3",
    rating: 5,
    name: "Anita S.",
    date: "Jul 20, 2026",
    comment: "Excellent quality! Exactly as described. Will definitely buy again.",
  },
];

const RATING_DISTRIBUTION = [
  { stars: 5, count: 1200 },
  { stars: 4, count: 800 },
  { stars: 3, count: 300 },
  { stars: 2, count: 150 },
  { stars: 1, count: 93 },
];

interface Props {
  reviewCount?: number;
  averageRating?: number;
}

export function ReviewsSection({
  reviewCount = 2543,
  averageRating = 4.3,
}: Props) {
  const maxCount = Math.max(...RATING_DISTRIBUTION.map((r) => r.count));

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Rating Summary */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pb-6 sm:pb-8 border-b border-[#e5ddd0]">
        {/* Average */}
        <div className="text-center sm:text-left space-y-2 shrink-0">
          <h3 className="text-4xl sm:text-5xl font-serif font-bold text-[#20291e]">{averageRating}</h3>
          <div className="flex items-center justify-center sm:justify-start gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(averageRating)
                    ? "fill-[#c89b3c] text-[#c89b3c]"
                    : "fill-[#d8cfbf] text-[#d8cfbf]"
                }
              />
            ))}
          </div>
          <p className="text-xs sm:text-sm text-[#6f7a6b]">
            {reviewCount.toLocaleString()} verified ratings
          </p>
        </div>

        {/* Distribution bars */}
        <div className="flex-1 space-y-2">
          {RATING_DISTRIBUTION.map((row) => {
            const pct = (row.count / maxCount) * 100;
            return (
              <div key={row.stars} className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-0.5 w-6 sm:w-8 text-xs sm:text-sm">
                  <span className="font-medium text-[#20291e]">{row.stars}</span>
                  <Star size={9} className="fill-[#c89b3c] text-[#c89b3c]" />
                </div>
                <div className="flex-1 h-2 bg-[#ede5d7] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c89b3c] rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] sm:text-xs text-[#6f7a6b] w-10 sm:w-12 text-right">
                  {row.count.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4 sm:space-y-6">
        {REVIEWS.map((review) => (
          <div
            key={review.id}
            className="pb-4 sm:pb-6 border-b border-[#e5ddd0] last:border-b-0"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
              <div className="flex items-center gap-1 bg-[#455840] text-[#faf7f2] text-xs font-semibold px-1.5 py-0.5 rounded">
                <span>{review.rating}</span>
                <Star size={9} className="fill-[#faf7f2]" />
              </div>
              <span className="font-semibold text-[#20291e] text-sm">{review.name}</span>
              <span className="text-xs text-[#8c9487]">{review.date}</span>
            </div>
            <p className="text-[#3b4737] text-xs sm:text-sm leading-relaxed font-serif italic">
              "{review.comment}"
            </p>
          </div>
        ))}
      </div>

      {/* Write review button */}
      <button className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-[#384a35] text-[#faf7f2] font-semibold text-sm hover:bg-[#283626] transition-colors shadow-xs">
        <MessageCircle size={14} strokeWidth={2} />
        Write a Review
      </button>
    </div>
  );
}