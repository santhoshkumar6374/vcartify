import { Sparkles } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-black text-white">
      <div className="mx-auto max-w-[1500px] px-3 py-1.5">
        <p className="flex items-center justify-center gap-1.5 sm:gap-2 text-center text-[10px] sm:text-xs font-medium tracking-wider">
          <Sparkles size={10} className="text-white shrink-0 hidden sm:inline" />
          <span className="truncate">
            <span className="hidden sm:inline">FREE SHIPPING ABOVE ₹999 | </span>
            <span className="sm:hidden">FREE SHIPPING | </span>
            USE CODE{" "}
            <span className="font-bold underline underline-offset-2">VCLUXE</span>
            <span className="hidden sm:inline"> FOR 15% OFF</span>
            <span className="sm:hidden"> - 15% OFF</span>
          </span>
          <Sparkles size={10} className="text-white shrink-0 hidden sm:inline" />
        </p>
      </div>
    </div>
  );
}