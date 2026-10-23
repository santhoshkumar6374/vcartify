import { useState, useEffect } from "react";
import { ChevronRight, Clock } from "lucide-react";
import { StoreItem } from "@/types/store";

interface Props {
  items: StoreItem[];
  onProductClick: (item: StoreItem) => void;
  onViewAllClick: () => void;
}

function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

export function TodaysEdit({ items, onProductClick, onViewAllClick }: Props) {
  const [seconds, setSeconds] = useState(getSecondsUntilMidnight);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(getSecondsUntilMidnight()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dealItems = items
    .filter((i) => i.MRP > i.SellingPrice)
    .sort((a, b) => {
      const dA = (a.MRP - a.SellingPrice) / a.MRP;
      const dB = (b.MRP - b.SellingPrice) / b.MRP;
      return dB - dA;
    })
    .slice(0, 6);

  const pad = (n: number) => String(n).padStart(2, "0");
  const h = pad(Math.floor(seconds / 3600));
  const m = pad(Math.floor((seconds % 3600) / 60));
  const s = pad(seconds % 60);

  if (dealItems.length === 0) return null;

  return (
    <section className="bg-[#243122] py-12 lg:py-16 border-y border-[#354631]">
      <div className="mx-auto w-full max-w-[1920px] px-2.5 sm:px-4 lg:px-6 xl:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-[#d8c29d]" strokeWidth={2.2} />
              <p className="text-[11px] font-semibold tracking-[0.3em] text-[#d8c29d] uppercase">
                Limited Time Offer
              </p>
            </div>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#faf7f2] tracking-tight">
              Today's Curated Deals
            </h2>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2">
            <TimeUnit value={h} label="HOURS" />
            <span className="text-2xl font-serif font-bold text-[#faf7f2]/50 pb-5">:</span>
            <TimeUnit value={m} label="MINS" />
            <span className="text-2xl font-serif font-bold text-[#faf7f2]/50 pb-5">:</span>
            <TimeUnit value={s} label="SECS" />
          </div>
        </div>

        {/* Deal Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {dealItems.map((item) => {
            const discount = Math.round(
              ((item.MRP - item.SellingPrice) / item.MRP) * 100
            );
            const savings = item.MRP - item.SellingPrice;

            return (
              <div
                key={item.ItemName}
                onClick={() => onProductClick(item)}
                className="h-full flex flex-col bg-[#fcfaf6] rounded-2xl overflow-hidden cursor-pointer group hover:-translate-y-1.5 transition-all duration-300 shadow-md hover:shadow-2xl border border-[#e5ddd0]"
              >
                <div className="relative aspect-square bg-[#f5f0e6] p-2.5 shrink-0">
                  <div className="absolute top-3.5 left-3.5 bg-[#9c4124] text-[#faf7f2] text-[10px] font-bold px-2 py-0.5 rounded-md z-10 tracking-wider shadow-xs">
                    {discount}% OFF
                  </div>

                  <div className="h-full w-full rounded-xl bg-white border border-[#e5ddd0]/70 p-2.5 flex items-center justify-center overflow-hidden shadow-2xs">
                    {item.FileUrl ? (
                      <img
                        src={item.FileUrl}
                        alt={item.ItemName}
                        loading="lazy"
                        className="h-full w-full object-contain group-hover:scale-108 transition-transform duration-300"
                      />
                    ) : (
                      <h3 className="text-sm font-serif font-semibold text-[#20291e] text-center line-clamp-3">
                        {item.ItemName}
                      </h3>
                    )}
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col">
                  <div className="space-y-1 mb-2.5">
                    <p className="text-[10px] font-medium tracking-wider text-[#6f7a6b] uppercase">
                      Limited Deal
                    </p>
                    <p className="text-xs font-semibold text-[#20291e] line-clamp-2 leading-snug">
                      {item.ItemName}
                    </p>
                  </div>

                  <div className="mt-auto space-y-2">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-[#20291e]">
                          ₹{item.SellingPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-[#8c9487] line-through">
                          ₹{item.MRP.toLocaleString()}
                        </span>
                      </div>
                      {savings > 0 && (
                        <p className="text-[10px] text-[#455840] font-semibold">
                          Save ₹{savings.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <button className="w-full bg-[#384a35] text-[#faf7f2] text-xs font-semibold py-2 rounded-lg hover:bg-[#283626] transition-colors shadow-xs cursor-pointer">
                      Shop Now →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-9">
          <button
            onClick={onViewAllClick}
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-lg bg-[#faf7f2] text-[#243122] text-sm font-semibold hover:bg-[#ede5d7] transition-all shadow-md"
          >
            Explore All Deals
            <ChevronRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="h-14 w-14 lg:h-16 lg:w-16 rounded-xl bg-[#faf7f2] flex items-center justify-center shadow-md border border-[#d8cfbf]/40">
        <span className="text-2xl lg:text-3xl font-serif font-bold text-[#243122] tabular-nums">
          {value}
        </span>
      </div>
      <span className="text-[10px] font-medium text-[#ede5d7]/80 mt-1.5 tracking-widest">
        {label}
      </span>
    </div>
  );
}