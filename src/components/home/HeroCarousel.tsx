import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Slide {
  id: string;
  tagline: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  bgImage: string;
}

const DEFAULT_SLIDES: Slide[] = [
  {
    id: "1",
    tagline: "TRUSTED SINCE 2020",
    title: "Your One-Stop Shopping Destination",
    subtitle: "Discover quality products at unbeatable prices",
    ctaLabel: "SHOP NOW",
    bgImage: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1920&q=80",
  },
];

interface Props {
  banners?: string[];
  storeName?: string;
  onCtaClick?: () => void;
}

export function HeroCarousel({ banners, storeName = "vCartify", onCtaClick }: Props) {
  const hasBackendBanners = banners && banners.length > 0;
  const [current, setCurrent] = useState(0);
  const slideCount = hasBackendBanners ? banners.length : DEFAULT_SLIDES.length;

  useEffect(() => {
    if (slideCount <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slideCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [slideCount]);

  const goPrev = () => setCurrent((c) => (c - 1 + slideCount) % slideCount);
  const goNext = () => setCurrent((c) => (c + 1) % slideCount);

  // ─── Backend banners (full-width, edge-to-edge) ─────────────
  if (hasBackendBanners) {
    return (
      <section className="relative w-full bg-gray-100 overflow-hidden">
        {/* ✨ Responsive aspect ratios for perfect fit at all sizes */}
        <div
          className="relative w-full 
            aspect-[16/10]        
            sm:aspect-[16/7]     
            md:aspect-[21/8]      
            lg:aspect-[24/8]      
            xl:aspect-[28/9]      
            max-h-[550px]"
        >
          {banners.map((bannerUrl, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ${
                idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* ✨ object-cover fills entire area, no whitespace */}
              <img
                src={bannerUrl}
                alt={`${storeName} banner ${idx + 1}`}
                className="h-full w-full object-cover cursor-pointer"
                onClick={onCtaClick}
              />
            </div>
          ))}

          {/* Nav Arrows (bigger on desktop, hidden on very small mobile) */}
          {slideCount > 1 && (
            <>
              <button
                onClick={goPrev}
                aria-label="Previous slide"
                className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 
                  h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14
                  rounded-full bg-white/90 backdrop-blur text-gray-800 
                  flex items-center justify-center 
                  hover:bg-white shadow-lg transition-all z-20
                  hover:scale-110"
              >
                <ChevronLeft size={22} className="lg:w-7 lg:h-7" />
              </button>
              <button
                onClick={goNext}
                aria-label="Next slide"
                className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 
                  h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14
                  rounded-full bg-white/90 backdrop-blur text-gray-800 
                  flex items-center justify-center 
                  hover:bg-white shadow-lg transition-all z-20
                  hover:scale-110"
              >
                <ChevronRight size={22} className="lg:w-7 lg:h-7" />
              </button>

              {/* Slide indicators */}
              <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 
                flex items-center gap-2 z-20 
                bg-black/30 backdrop-blur px-3 py-1.5 rounded-full">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === current
                        ? "w-8 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    );
  }

  // ─── Fallback slides (if no backend banners) ───────────────
  return (
    <section className="relative w-full h-[500px] sm:h-[550px] lg:h-[600px] overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700">
      {DEFAULT_SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <img
            src={slide.bgImage}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="relative h-full mx-auto max-w-7xl px-6 lg:px-12 flex items-center">
            <div className="max-w-xl text-white space-y-5">
              <p className="text-xs sm:text-sm font-semibold tracking-[0.3em] text-[#ffd66b]">
                {slide.tagline}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                {slide.title}
              </h1>
              <p className="text-base sm:text-lg text-white/90 max-w-md">
                {slide.subtitle}
              </p>
              <button
                onClick={onCtaClick}
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#ec4899] text-white text-sm font-bold tracking-wider hover:bg-[#db2777] shadow-xl transition-all"
              >
                {slide.ctaLabel}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}