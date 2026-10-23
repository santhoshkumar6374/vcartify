import homeBannerImg from "@/assets/home-banner.png";

interface Props {
  banners?: string[];
  storeName?: string;
  onCtaClick?: () => void;
}

export function HeroCarousel({ storeName = "VCartify", onCtaClick }: Props) {
  return (
    <section className="w-full bg-[#f3ede0] p-0 m-0 overflow-hidden">
      <div
        onClick={onCtaClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onCtaClick?.();
          }
        }}
        aria-label={`Explore ${storeName} catalog`}
        className="w-full relative p-0 m-0 cursor-pointer group overflow-hidden bg-[#f3ede0] select-none"
      >
        <img
          src={homeBannerImg}
          alt={`${storeName} — Your Trusted Online Shopping Destination`}
          className="block w-full h-auto select-none transition-transform duration-500 group-hover:scale-[1.01]"
          draggable={false}
        />
      </div>
    </section>
  );
}