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
        <linearGradient id="vBlueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="vOrangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <path d="M 15 25 L 22 25 L 28 62 L 72 62 L 76 42" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M 32 20 L 50 62 L 50 20 Z" fill="url(#vBlueGradient)"/>
      <path d="M 50 20 L 50 62 L 68 20 Z" fill="url(#vOrangeGradient)"/>
      <path d="M 78 40 L 92 40" stroke="#fb923c" strokeWidth="4" strokeLinecap="round"/>
      <path d="M 76 48 L 90 48" stroke="#fb923c" strokeWidth="4" strokeLinecap="round"/>
      <path d="M 78 56 L 88 56" stroke="#fb923c" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="35" cy="80" r="5" fill="#1a1a2e"/>
      <circle cx="65" cy="80" r="5" fill="#1a1a2e"/>
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
          style={{ backgroundImage: "linear-gradient(180deg, #3b82f6 0%, #1e40af 100%)" }}
        >
          v
        </span>
        <span className="text-[#1a1a2e]">Cartify</span>
      </span>

      {showTagline && (
        <span className={`${t.tagline} font-semibold text-gray-500 tracking-[0.15em] uppercase mt-0.5 flex items-center gap-1.5`}>
          <span className="h-px w-3 bg-gray-400" />
          Shop Smart, Live Better
          <span className="h-px w-3 bg-gray-400" />
        </span>
      )}
    </div>
  );
}