import { Sparkles, Check, Copy } from "lucide-react";
import { useState } from "react";

export function AnnouncementBar() {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText("OLIVELUXE");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="bg-[#243122] text-[#f5f1e8] border-b border-[#344531]">
      <div className="mx-auto w-full max-w-[1920px] px-2.5 sm:px-4 lg:px-6 xl:px-8 py-2">
        <p className="flex items-center justify-center gap-1.5 sm:gap-2.5 text-center text-[10px] sm:text-xs font-medium tracking-widest uppercase">
          <Sparkles size={11} className="text-[#d8c29d] shrink-0 hidden sm:inline" />
          <span className="truncate">
            <span className="hidden sm:inline">COMPLIMENTARY SHIPPING ON ORDERS OVER ₹999 | </span>
            <span className="sm:hidden">FREE SHIPPING &gt; ₹999 | </span>
            USE CODE{" "}
            <button
              type="button"
              onClick={handleCopyCode}
              title="Click to copy coupon code"
              className="inline-flex items-center gap-1 font-bold underline underline-offset-4 tracking-wider text-[#ede5d7] bg-[#344531] hover:bg-[#43593f] px-1.5 py-0.5 rounded text-[10px] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={10} className="text-[#c89b3c]" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy size={9} className="opacity-70" />
                  <span>OLIVELUXE</span>
                </>
              )}
            </button>
            <span className="hidden sm:inline"> FOR 15% OFF</span>
            <span className="sm:hidden"> - 15% OFF</span>
          </span>
          <Sparkles size={11} className="text-[#d8c29d] shrink-0 hidden sm:inline" />
        </p>
      </div>
    </div>
  );
}