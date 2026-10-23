import { useState, useEffect, useMemo, useRef } from "react";
import {
  Flame,
  Sparkles,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShoppingBag,
  Zap,
  Tag,
  Percent,
  Gift,
} from "lucide-react";
import { StoreCategory, StoreItem } from "../../types/store";

interface CategoryCirclesProps {
  categories?: StoreCategory[];
  items?: StoreItem[];
  activeCategory?: string;
  onCategoryClick?: (categoryId: string) => void;
  onProductClick?: (item: StoreItem) => void;
  onAddToCart?: (item: StoreItem, e?: React.MouseEvent) => void;
}

function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

function formatImageSrc(item?: StoreItem): string | null {
  if (!item) return null;
  const raw = item.FileUrl || item.ImageUrl;
  if (!raw) return null;
  if (raw.startsWith("data:") || raw.startsWith("http")) return raw;
  return `data:image/jpeg;base64,${raw}`;
}

export function CategoryCircles({
  items = [],
  onCategoryClick,
  onProductClick,
  onAddToCart,
}: CategoryCirclesProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(getSecondsUntilMidnight);
  const ribbonRef = useRef<HTMLDivElement>(null);

  // Live countdown timer for Today's Deals
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(getSecondsUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const hours = pad(Math.floor(secondsLeft / 3600));
  const mins = pad(Math.floor((secondsLeft % 3600) / 60));
  const secs = pad(secondsLeft % 60);

  // Rank products with best discounts (or fallback to featured items with images)
  const dealProducts = useMemo(() => {
    if (!items || items.length === 0) return [];
    const discounted = items
      .filter((i) => i && i.MRP > i.SellingPrice && (i.FileUrl || i.ImageUrl))
      .sort((a, b) => {
        const dA = (a.MRP - a.SellingPrice) / a.MRP;
        const dB = (b.MRP - b.SellingPrice) / b.MRP;
        return dB - dA;
      });

    const withImages = items.filter((i) => i && (i.FileUrl || i.ImageUrl));
    const combined = [...discounted];
    for (const item of withImages) {
      if (!combined.some((c) => c.ItemName === item.ItemName)) {
        combined.push(item);
      }
      if (combined.length >= 14) break;
    }
    return combined.length > 0 ? combined : items.slice(0, 10);
  }, [items]);

  // Build 4 rich animated promotional ad banner slides from actual catalog items
  const adSlides = useMemo(() => {
    const p0 = dealProducts[0] || items[0];
    const p1 = dealProducts[1] || items[1] || p0;
    const p2 = dealProducts[2] || items[2] || p0;
    const p3 = dealProducts[3] || items[3] || p0;

    return [
      {
        id: "mega-deal",
        badge: "TODAY'S BLOCKBUSTER DEAL",
        headline: "Super Saver Flash Offer",
        subtitle:
          "Grab our highest-rated daily essentials & spices at exclusive limited-time prices before midnight.",
        bgClass:
          "bg-gradient-to-br from-[#20291e] via-[#2c3b29] to-[#3d5239] text-[#faf7f2] border-[#4c6247]",
        accentBadgeClass: "bg-[#c89b3c] text-[#20291e]",
        ctaClass:
          "bg-[#e2b857] hover:bg-[#c89b3c] text-[#20291e] shadow-lg shadow-black/20",
        secondaryCtaClass:
          "bg-white/12 hover:bg-white/20 text-[#faf7f2] border border-white/25",
        isDark: true,
        product: p0,
      },
      {
        id: "spice-festival",
        badge: "FESTIVAL OF OFFERS",
        headline: "Authentic Quality, Big Savings",
        subtitle:
          "Handpicked masalas, books, stationery & home favourites with instant doorstep delivery.",
        bgClass:
          "bg-gradient-to-br from-[#7c331b] via-[#9c4124] to-[#b86236] text-[#faf7f2] border-[#b86236]",
        accentBadgeClass: "bg-[#faf7f2] text-[#9c4124]",
        ctaClass:
          "bg-[#faf7f2] hover:bg-[#f5f0e6] text-[#20291e] shadow-lg shadow-black/20",
        secondaryCtaClass:
          "bg-black/20 hover:bg-black/30 text-[#faf7f2] border border-white/25",
        isDark: true,
        product: p1,
      },
      {
        id: "curated-bundle",
        badge: "LIMITED PERIOD AD OFFER",
        headline: "Smart Shopping, Extra Discounts",
        subtitle:
          "Stock up on your favourite household & study supplies with guaranteed savings on every pack.",
        bgClass:
          "bg-gradient-to-br from-[#ebe3d2] via-[#f5f0e6] to-[#dfe8dc] text-[#20291e] border-[#c89b3c]/60",
        accentBadgeClass: "bg-[#384a35] text-[#faf7f2]",
        ctaClass:
          "bg-[#384a35] hover:bg-[#20291e] text-[#faf7f2] shadow-md shadow-[#20291e]/15",
        secondaryCtaClass:
          "bg-white hover:bg-[#f5f0e6] text-[#20291e] border border-[#c7bda9]",
        isDark: false,
        product: p2,
      },
      {
        id: "bestseller-drop",
        badge: "HOT MOVING PRODUCT AD",
        headline: "Top-Rated Customer Favourites",
        subtitle:
          "Discover our fastest-moving products loved by families across Tirupur with instant WhatsApp checkout.",
        bgClass:
          "bg-gradient-to-br from-[#2a3828] via-[#384a35] to-[#52684d] text-[#faf7f2] border-[#5c7457]",
        accentBadgeClass: "bg-[#e2b857] text-[#20291e]",
        ctaClass:
          "bg-[#e2b857] hover:bg-[#c89b3c] text-[#20291e] shadow-lg shadow-black/20",
        secondaryCtaClass:
          "bg-white/12 hover:bg-white/20 text-[#faf7f2] border border-white/25",
        isDark: true,
        product: p3,
      },
    ];
  }, [dealProducts, items]);

  // Auto-advance main promotional banner carousel every 3.8s
  useEffect(() => {
    if (isPaused || adSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % adSlides.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isPaused, adSlides.length]);

  // Auto-scroll bottom deal cards ribbon gently
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      const el = ribbonRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 10) return;
      if (el.scrollLeft >= maxScroll - 20) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 260, behavior: "smooth" });
      }
    }, 3200);
    return () => clearInterval(timer);
  }, [isPaused]);

  const scrollRibbon = (dir: "left" | "right") => {
    if (!ribbonRef.current) return;
    ribbonRef.current.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const sideAd1 = dealProducts[4] || dealProducts[1] || items[0];
  const sideAd2 = dealProducts[5] || dealProducts[2] || items[1] || sideAd1;
  const ribbonProducts = dealProducts.slice(0, 12);

  if (!items || items.length === 0) return null;

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-gradient-to-b from-[#f9f6f0] via-[#f4efe4] to-[#f9f6f0] pb-8 lg:pb-10 border-b border-[#e5ddd0] overflow-hidden"
    >
      {/* 1. CONTINUOUS MOVING MARQUEE TICKER STRIP */}
      <div className="bg-[#20291e] text-[#faf7f2] border-b border-[#384a35] py-2 overflow-hidden relative">
        <div className="animate-marquee flex items-center gap-8 text-[11px] sm:text-xs font-bold tracking-wider uppercase">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center gap-8 shrink-0">
              <span className="inline-flex items-center gap-2 text-[#e2b857]">
                <Flame size={13} className="fill-[#e2b857] text-[#e2b857]" />
                <span>TODAY'S LIVE DEALS — UP TO 50% OFF SELECTED ITEMS</span>
              </span>
              <span className="text-[#6f8769]">•</span>
              <span className="inline-flex items-center gap-2">
                <Zap size={13} className="text-[#e2b857]" />
                <span>FLASH PRODUCT OFFERS — ENDS AT MIDNIGHT ({hours}:{mins}:{secs})</span>
              </span>
              <span className="text-[#6f8769]">•</span>
              <span className="inline-flex items-center gap-2 text-[#e3ebe0]">
                <Gift size={13} className="text-[#e2b857]" />
                <span>AUTHENTIC SPICES, BOOKS, STATIONERY & HOUSEHOLD ESSENTIALS</span>
              </span>
              <span className="text-[#6f8769]">•</span>
              <span className="inline-flex items-center gap-2 text-[#e2b857]">
                <Percent size={13} />
                <span>EXTRA SAVINGS ON COMBO & VALUE PACKS — SHOP SMART, LIVE BETTER</span>
              </span>
              <span className="text-[#6f8769]">•</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1920px] px-2.5 sm:px-4 lg:px-6 xl:px-8 pt-6 sm:pt-8">
        {/* Section Header with Live Deal Timer */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f7ebe6] border border-[#d69b88] text-[#9c4124] text-[10px] font-extrabold tracking-widest uppercase mb-1.5 animate-gentle-pulse">
              <Flame size={11} className="fill-[#9c4124]" />
              <span>Live Promotional Offers & Ads</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#20291e] tracking-tight">
              Today's Deals & Spotlight Product Offers
            </h2>
          </div>

          {/* Live Countdown Pill */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-[#fcfaf6] border border-[#d8cfbf] px-3.5 py-1.5 rounded-2xl shadow-2xs">
            <Clock size={14} className="text-[#9c4124] animate-spin" style={{ animationDuration: "8s" }} />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5c6e56]">
              Deals Refresh In:
            </span>
            <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-extrabold text-[#20291e]">
              <span className="bg-[#20291e] text-[#faf7f2] px-1.5 py-0.5 rounded-md">
                {hours}h
              </span>
              <span>:</span>
              <span className="bg-[#20291e] text-[#faf7f2] px-1.5 py-0.5 rounded-md">
                {mins}m
              </span>
              <span>:</span>
              <span className="bg-[#9c4124] text-white px-1.5 py-0.5 rounded-md">
                {secs}s
              </span>
            </div>
          </div>
        </div>

        {/* 2. ANIMATED OFFER BANNERS BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
          {/* LEFT: Auto-Sliding Main Promotional Product Ad Carousel (8 cols) */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-lg border border-[#d8cfbf] min-h-[280px] sm:min-h-[320px]">
            {adSlides.map((slide, idx) => {
              const isCurrent = idx === activeSlide;
              const product = slide.product;
              const imgSrc = formatImageSrc(product);
              const discount =
                product && product.MRP > product.SellingPrice
                  ? Math.round(
                      ((product.MRP - product.SellingPrice) / product.MRP) * 100
                    )
                  : 20;
              const savings =
                product && product.MRP > product.SellingPrice
                  ? product.MRP - product.SellingPrice
                  : 0;

              return (
                <div
                  key={slide.id}
                  aria-hidden={!isCurrent}
                  className={`${
                    isCurrent
                      ? "relative opacity-100 translate-x-0 z-10"
                      : "absolute inset-0 opacity-0 translate-x-6 pointer-events-none z-0"
                  } ${
                    slide.bgClass
                  } h-full w-full p-5 sm:p-7 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 transition-all duration-500 ease-out overflow-hidden`}
                >
                  {/* Animated Gloss Shine Sweep Overlay */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shine-sweep"
                  />

                  {/* Decorative Background Glow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#c89b3c]/15 blur-2xl"
                  />

                  {/* Left Copy & Offer CTA */}
                  <div className="relative z-10 flex-1 space-y-3 text-left max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase shadow-xs ${slide.accentBadgeClass}`}
                      >
                        <Sparkles size={11} />
                        <span>{slide.badge}</span>
                      </span>
                      {discount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#9c4124] text-white shadow-xs animate-gentle-pulse">
                          FLAT {discount}% OFF
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold leading-tight tracking-tight">
                      {slide.headline}
                    </h3>

                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        slide.isDark ? "text-[#e5ddd0]" : "text-[#455840]"
                      }`}
                    >
                      {slide.subtitle}
                    </p>

                    {product && (
                      <div
                        className={`inline-flex items-center gap-3 px-3.5 py-2 rounded-2xl border ${
                          slide.isDark
                            ? "bg-black/20 border-white/15"
                            : "bg-white/80 border-[#d8cfbf]"
                        }`}
                      >
                        <div className="min-w-0">
                          <p
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                              slide.isDark ? "text-[#e2b857]" : "text-[#9c4124]"
                            }`}
                          >
                            Featured Deal Item
                          </p>
                          <p className="text-xs sm:text-sm font-bold truncate max-w-[210px] sm:max-w-[260px]">
                            {product.ItemName}
                          </p>
                        </div>
                        <div className="pl-3 border-l border-current/15 text-right shrink-0">
                          <span className="text-base sm:text-xl font-extrabold block leading-none">
                            ₹{product.SellingPrice.toLocaleString()}
                          </span>
                          {product.MRP > product.SellingPrice && (
                            <span className="text-[10px] opacity-70 line-through">
                              MRP ₹{product.MRP.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2.5 pt-1 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          if (product && onProductClick) {
                            onProductClick(product);
                          } else if (onCategoryClick) {
                            onCategoryClick("all");
                          }
                        }}
                        className={`h-10 px-5 rounded-xl text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${slide.ctaClass}`}
                      >
                        <span>Grab Offer Now</span>
                        <ArrowRight size={15} strokeWidth={2.5} />
                      </button>

                      {product && onAddToCart && (
                        <button
                          type="button"
                          onClick={(e) => onAddToCart(product, e)}
                          className={`h-10 px-4 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${slide.secondaryCtaClass}`}
                        >
                          <ShoppingBag size={14} />
                          <span>
                            Add to Cart{" "}
                            {savings > 0 ? `(Save ₹${savings})` : ""}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Floating Product Ad Stage */}
                  {product && (
                    <div
                      onClick={() => onProductClick && onProductClick(product)}
                      className="relative z-10 shrink-0 cursor-pointer group/stage"
                    >
                      <div className="animate-deal-float relative w-40 h-40 sm:w-48 sm:h-48 lg:w-52 lg:h-52 rounded-3xl bg-white p-4 shadow-2xl border-2 border-[#e2b857]/60 flex items-center justify-center overflow-hidden">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={product.ItemName}
                            className="h-full w-full object-contain group-hover/stage:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <span className="text-sm font-serif font-bold text-[#20291e] text-center px-2">
                            {product.ItemName}
                          </span>
                        )}

                        {/* Floating Discount Price Tag */}
                        <div className="absolute top-2.5 right-2.5 bg-[#9c4124] text-white text-[10px] sm:text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md">
                          {discount > 0 ? `-${discount}%` : "HOT DEAL"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Carousel Prev / Next Controls & Slide Dots */}
            <div className="absolute bottom-3.5 right-4 z-20 flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2 bg-black/25 backdrop-blur-xs px-2.5 py-1 rounded-full">
                {adSlides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Go to offer slide ${i + 1}`}
                    onClick={() => setActiveSlide(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      i === activeSlide
                        ? "w-6 bg-[#e2b857]"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Previous offer banner"
                onClick={() =>
                  setActiveSlide(
                    (prev) => (prev - 1 + adSlides.length) % adSlides.length
                  )
                }
                className="h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Next offer banner"
                onClick={() =>
                  setActiveSlide((prev) => (prev + 1) % adSlides.length)
                }
                className="h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* RIGHT: Dual Moving Spotlight Ad Cards (4 cols) */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {[
              {
                tag: "⚡ FLASH DEAL OF THE HOUR",
                cardBg:
                  "bg-gradient-to-br from-[#fcfaf6] via-[#f5f0e6] to-[#e9e1d2] border-[#d8cfbf]",
                tagBg: "bg-[#9c4124] text-white",
                item: sideAd1,
              },
              {
                tag: "🎁 TODAY'S SUPER VALUE PICK",
                cardBg:
                  "bg-gradient-to-br from-[#eef2ec] via-[#fcfaf6] to-[#e3ebe0] border-[#c5d4c0]",
                tagBg: "bg-[#384a35] text-[#faf7f2]",
                item: sideAd2,
              },
            ].map((card, idx) => {
              const prod = card.item;
              if (!prod) return null;
              const img = formatImageSrc(prod);
              const disc =
                prod.MRP > prod.SellingPrice
                  ? Math.round(
                      ((prod.MRP - prod.SellingPrice) / prod.MRP) * 100
                    )
                  : 15;
              const saveAmt = Math.max(0, prod.MRP - prod.SellingPrice);

              return (
                <div
                  key={idx}
                  onClick={() => onProductClick && onProductClick(prod)}
                  className={`group relative rounded-3xl border ${card.cardBg} p-4 sm:p-5 flex items-center justify-between gap-3.5 shadow-sm hover:shadow-xl hover:border-[#384a35] transition-all duration-300 cursor-pointer overflow-hidden`}
                >
                  {/* Moving Shimmer Sweep */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine-sweep"
                  />

                  <div className="flex-1 min-w-0 space-y-1.5 relative z-10">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider ${card.tagBg}`}
                    >
                      {card.tag}
                    </span>

                    <h4 className="text-sm sm:text-base font-bold text-[#20291e] line-clamp-2 leading-snug group-hover:text-[#384a35] transition-colors">
                      {prod.ItemName}
                    </h4>

                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-lg sm:text-xl font-extrabold text-[#20291e]">
                        ₹{prod.SellingPrice.toLocaleString()}
                      </span>
                      {prod.MRP > prod.SellingPrice && (
                        <span className="text-xs text-[#8a8275] line-through font-medium">
                          ₹{prod.MRP.toLocaleString()}
                        </span>
                      )}
                      {saveAmt > 0 && (
                        <span className="text-[10px] font-bold text-[#9c4124] bg-[#f7ebe6] px-2 py-0.5 rounded-full border border-[#d69b88]">
                          Save ₹{saveAmt}
                        </span>
                      )}
                    </div>

                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#384a35] group-hover:translate-x-1 transition-transform">
                        <span>Shop This Offer</span>
                        <ArrowRight size={13} strokeWidth={2.5} />
                      </span>
                    </div>
                  </div>

                  {/* Floating Product Image */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-[#e5ddd0] p-2.5 flex items-center justify-center shrink-0 shadow-sm animate-deal-float">
                    {img ? (
                      <img
                        src={img}
                        alt={prod.ItemName}
                        className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-xs font-serif font-bold text-[#20291e] text-center line-clamp-2">
                        {prod.ItemName}
                      </span>
                    )}
                    {disc > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#9c4124] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                        -{disc}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. AUTO-MOVING HORIZONTAL PRODUCT OFFERS & DEALS CAROUSEL */}
        <div className="bg-[#fcfaf6] rounded-3xl border border-[#d8cfbf] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-3.5">
            <div className="flex items-center gap-2">
              <span className="h-7 w-7 rounded-xl bg-[#384a35] text-[#faf7f2] flex items-center justify-center">
                <Tag size={14} strokeWidth={2.4} />
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#20291e] leading-tight">
                  Moving Product Offer Ads — Today's Price Drops
                </h3>
                <p className="text-[11px] text-[#5c6e56] font-medium">
                  Auto-scrolling live discounts • Click any offer to view or add to cart
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollRibbon("left")}
                aria-label="Scroll offers left"
                className="h-8 w-8 rounded-full border border-[#d8cfbf] bg-[#f5f0e6] hover:bg-[#384a35] text-[#20291e] hover:text-[#faf7f2] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                onClick={() => scrollRibbon("right")}
                aria-label="Scroll offers right"
                className="h-8 w-8 rounded-full border border-[#d8cfbf] bg-[#f5f0e6] hover:bg-[#384a35] text-[#20291e] hover:text-[#faf7f2] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          <div
            ref={ribbonRef}
            className="flex items-stretch gap-3 overflow-x-auto scrollbar-hide pb-1"
          >
            {ribbonProducts.map((item, idx) => {
              const img = formatImageSrc(item);
              const disc =
                item.MRP > item.SellingPrice
                  ? Math.round(
                      ((item.MRP - item.SellingPrice) / item.MRP) * 100
                    )
                  : 0;
              const save = Math.max(0, item.MRP - item.SellingPrice);

              return (
                <div
                  key={`${item.ItemName}-${idx}`}
                  onClick={() => onProductClick && onProductClick(item)}
                  className="group min-w-[220px] sm:min-w-[245px] max-w-[245px] rounded-2xl bg-gradient-to-b from-[#f5f0e6]/80 to-white border border-[#e5ddd0] hover:border-[#384a35] p-3 flex items-center gap-3 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300 shrink-0"
                >
                  <div className="relative h-18 w-18 sm:h-20 sm:w-20 rounded-xl bg-white border border-[#e5ddd0] p-2 flex items-center justify-center shrink-0 overflow-hidden">
                    {img ? (
                      <img
                        src={img}
                        alt={item.ItemName}
                        loading="lazy"
                        className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-[10px] font-serif font-bold text-[#20291e] text-center line-clamp-2">
                        {item.ItemName}
                      </span>
                    )}
                    {disc > 0 && (
                      <span className="absolute top-1 left-1 bg-[#9c4124] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">
                        -{disc}%
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#9c4124] block">
                      {save > 0 ? `Save ₹${save}` : "Special Offer"}
                    </span>
                    <h4 className="text-xs font-bold text-[#20291e] line-clamp-2 leading-snug group-hover:text-[#384a35]">
                      {item.ItemName}
                    </h4>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-sm font-extrabold text-[#20291e]">
                        ₹{item.SellingPrice.toLocaleString()}
                      </span>
                      {item.MRP > item.SellingPrice && (
                        <span className="text-[10px] text-[#8a8275] line-through">
                          ₹{item.MRP.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {onAddToCart && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(item, e);
                        }}
                        className="mt-1.5 w-full h-7 rounded-lg bg-[#384a35] hover:bg-[#20291e] text-[#faf7f2] text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <ShoppingBag size={10} />
                        <span>Add Deal</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}