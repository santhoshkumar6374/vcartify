interface LogoProps {
  imageUrl?: string;              // ✨ NEW: pass your image URL
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "horizontal" | "stacked" | "icon-only" | "image-only";
  showTagline?: boolean;
  alt?: string;
}

export function Logo({
  imageUrl,
  size = "md",
  variant = "horizontal",
  showTagline = false,
  alt = "vCartify logo",
}: LogoProps) {
  const dimensions = {
    sm: 32,
    md: 42,
    lg: 56,
    xl: 80,
  };

  const iconSize = dimensions[size];

  // ─── If image URL is provided, use it ───────────────────
  if (imageUrl) {
    // Image-only variant
    if (variant === "image-only" || variant === "icon-only") {
      return (
        <img
          src={imageUrl}
          alt={alt}
          style={{ height: iconSize, width: "auto" }}
          className="object-contain shrink-0"
        />
      );
    }

    // Stacked: image on top, text below
    if (variant === "stacked") {
      return (
        <div className="flex flex-col items-center gap-2">
          <img
            src={imageUrl}
            alt={alt}
            style={{ height: iconSize, width: "auto" }}
            className="object-contain shrink-0"
          />
          <LogoText size={size} showTagline={showTagline} />
        </div>
      );
    }

    // Horizontal: image + text side by side
    return (
      <div className="flex items-center gap-2.5">
        <img
          src={imageUrl}
          alt={alt}
          style={{ height: iconSize, width: "auto" }}
          className="object-contain shrink-0"
        />
        <LogoText size={size} showTagline={showTagline} />
      </div>
    );
  }

  // ─── Fallback: SVG icon (if no image URL) ───────────────
  if (variant === "icon-only" || variant === "image-only") {
    return <LogoIcon size={size} />;
  }

  if (variant === "stacked") {
    return (
      <div className="flex flex-col items-center gap-2">
        <LogoIcon size={size} />
        <LogoText size={size} showTagline={showTagline} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <LogoIcon size={size} />
      <LogoText size={size} showTagline={showTagline} />
    </div>
  );
}

// ─── SVG Icon Fallback ─────────────────────────────────
function LogoIcon({ size }: { size: "sm" | "md" | "lg" | "xl" }) {
  const dimensions = { sm: 32, md: 42, lg: 56, xl: 80 };
  const d = dimensions[size];

  return (
    <svg
      width={d}
      height={d}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-label="vCartify logo"
    >
      <defs>
        <linearGradient id="vOliveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6f8769" />
          <stop offset="100%" stopColor="#384a35" />
        </linearGradient>
        <linearGradient id="vGoldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e2b857" />
          <stop offset="100%" stopColor="#b58326" />
        </linearGradient>
      </defs>
      <path d="M 15 25 L 22 25 L 28 62 L 72 62 L 76 42" stroke="#20291e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M 32 20 L 50 62 L 50 20 Z" fill="url(#vOliveGradient)"/>
      <path d="M 50 20 L 50 62 L 68 20 Z" fill="url(#vGoldGradient)"/>
      <path d="M 78 40 L 92 40" stroke="#9c4124" strokeWidth="4" strokeLinecap="round"/>
      <path d="M 76 48 L 90 48" stroke="#b58326" strokeWidth="4" strokeLinecap="round"/>
      <path d="M 78 56 L 88 56" stroke="#9c4124" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="35" cy="80" r="5" fill="#20291e"/>
      <circle cx="65" cy="80" r="5" fill="#20291e"/>
    </svg>
  );
}

// ─── Text Component ─────────────────────────────────────
function LogoText({
  size,
  showTagline,
}: {
  size: "sm" | "md" | "lg" | "xl";
  showTagline: boolean;
}) {
  const textSizes = {
    sm: { main: "text-base", tagline: "text-[8px]" },
    md: { main: "text-xl lg:text-2xl", tagline: "text-[9px] lg:text-[10px]" },
    lg: { main: "text-3xl lg:text-4xl", tagline: "text-[10px] lg:text-xs" },
    xl: { main: "text-5xl lg:text-6xl", tagline: "text-xs lg:text-sm" },
  };
  const t = textSizes[size];

  return (
    <div className="flex flex-col leading-tight">
      <span className={`${t.main} font-black tracking-tight leading-none`}>
        <span
          className="bg-clip-text text-transparent"
          style={{ backgroundImage: "linear-gradient(180deg, #c89b3c 0%, #8c661c 100%)" }}
        >
          V
        </span>
        <span className="text-[#20291e]">Cartify</span>
      </span>

      {showTagline && (
        <span className={`${t.tagline} font-semibold text-[#5c6e56] tracking-[0.15em] uppercase mt-0.5 flex items-center gap-1.5`}>
          <span className="h-px w-3 bg-[#c89b3c]" />
          Shop Smart, Live Better
          <span className="h-px w-3 bg-[#c89b3c]" />
        </span>
      )}
    </div>
  );
}