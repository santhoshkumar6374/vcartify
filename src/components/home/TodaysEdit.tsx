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
    <section className="bg-gray-900 py-12 lg:py-16">
      <div className="mx-auto max-w-[1500px] px-4">
        {/* Header — REFINED */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-yellow-400" strokeWidth={2} />
              <p className="text-[11px] font-semibold tracking-[0.3em] text-yellow-400 uppercase">
                Limited Time
              </p>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Today's Best Deals
            </h2>
          </div>

          {/* Countdown — REFINED */}
          <div className="flex items-center gap-2">
            <TimeUnit value={h} label="HRS" />
            <span className="text-2xl font-bold text-white/60 pb-5">:</span>
            <TimeUnit value={m} label="MIN" />
            <span className="text-2xl font-bold text-white/60 pb-5">:</span>
            <TimeUnit value={s} label="SEC" />
          </div>
        </div>

        {/* Deal Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {dealItems.map((item) => {
            const discount = Math.round(
              ((item.MRP - item.SellingPrice) / item.MRP) * 100
            );

            return (
              <div
                key={item.ItemName}
                onClick={() => onProductClick(item)}
                className="bg-white rounded-xl overflow-hidden cursor-pointer group hover:-translate-y-1 transition-transform shadow-lg"
              >
                <div className="relative aspect-square bg-gray-50 p-3">
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
                    {discount}% OFF
                  </div>

                  {item.FileUrl ? (
                    <img
                      src={item.FileUrl}
                      alt={item.ItemName}
                      loading="lazy"
                      className="h-full w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <h3 className="text-base font-semibold text-gray-800 text-center line-clamp-3">
                        {item.ItemName}
                      </h3>
                    </div>
                  )}
                </div>

                <div className="p-3 space-y-1.5">
                  <p className="text-[10px] font-medium tracking-wider text-gray-500 uppercase">
                    vCartify
                  </p>
                  <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                    {item.ItemName}
                  </p>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-gray-900">
                      ₹{item.SellingPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{item.MRP.toLocaleString()}
                    </span>
                  </div>

                  <button className="w-full bg-gray-900 text-white text-xs font-semibold py-2 rounded-lg hover:bg-black transition-colors">
                    Shop Now →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={onViewAllClick}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            View All Deals
            <ChevronRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="h-14 w-14 lg:h-16 lg:w-16 rounded-lg bg-white flex items-center justify-center shadow-md">
        <span className="text-2xl lg:text-3xl font-bold text-gray-900 tabular-nums">
          {value}
        </span>
      </div>
      <span className="text-[10px] font-medium text-white/70 mt-1.5 tracking-wider">
        {label}
      </span>
    </div>
  );
}