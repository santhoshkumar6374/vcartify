import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className="fixed bottom-6 right-6 z-40 h-11 w-11 rounded-full bg-[#384a35] hover:bg-[#20291e] text-[#faf7f2] shadow-xl border border-[#c89b3c]/50 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer animate-page-entrance focus:outline-none focus:ring-2 focus:ring-[#c89b3c]"
    >
      <ChevronUp size={20} strokeWidth={2.5} />
    </button>
  );
}
