import { useRef, useEffect, useState } from "react";
import {
  Menu,
  ChevronRight,
  ChevronLeft,
  Home,
  LayoutGrid,
  Sparkles,
  Laptop,
  Shirt,
  Sofa,
  HeartHandshake,
  Trophy,
  Watch,
  BookOpen,
  Palette,
  PenTool,
  FileText,
  Map,
  UtensilsCrossed,
  ShoppingBag,
  Layers,
  Flame,
  Gift,
} from "lucide-react";
import { StoreCategory, StoreItem } from "@/types/store";

export interface CategoryTheme {
  gradient: string;
  softBg: string;
  iconBg: string;
  iconText: string;
  hoverBorder: string;
  activeShadow: string;
  badgeBg: string;
  accentHex: string;
}

const CATEGORY_THEMES: CategoryTheme[] = [
  {
    gradient: "from-[#9c4124] to-[#b85a3a]",
    softBg: "bg-[#f7ebe6]",
    iconBg: "bg-[#f3e2dc]",
    iconText: "text-[#9c4124]",
    hoverBorder: "hover:border-[#c99583]",
    activeShadow: "shadow-[#9c4124]/25",
    badgeBg: "bg-[#9c4124]",
    accentHex: "#9c4124",
  },
  {
    gradient: "from-[#384a35] to-[#20291e]",
    softBg: "bg-[#eef2ec]",
    iconBg: "bg-[#e3ebe0]",
    iconText: "text-[#384a35]",
    hoverBorder: "hover:border-[#8fa38a]",
    activeShadow: "shadow-[#384a35]/25",
    badgeBg: "bg-[#384a35]",
    accentHex: "#384a35",
  },
  {
    gradient: "from-[#b58326] to-[#c89b3c]",
    softBg: "bg-[#f8f2e4]",
    iconBg: "bg-[#f2e7ce]",
    iconText: "text-[#8c661c]",
    hoverBorder: "hover:border-[#d4b675]",
    activeShadow: "shadow-[#b58326]/25",
    badgeBg: "bg-[#b58326]",
    accentHex: "#b58326",
  },
  {
    gradient: "from-[#4e6347] to-[#384a35]",
    softBg: "bg-[#eff3ee]",
    iconBg: "bg-[#e2eae0]",
    iconText: "text-[#3b4d36]",
    hoverBorder: "hover:border-[#9bad96]",
    activeShadow: "shadow-[#384a35]/25",
    badgeBg: "bg-[#455840]",
    accentHex: "#455840",
  },
  {
    gradient: "from-[#7a5230] to-[#5e3d22]",
    softBg: "bg-[#f5eee8]",
    iconBg: "bg-[#ebe0d5]",
    iconText: "text-[#7a5230]",
    hoverBorder: "hover:border-[#bfa38a]",
    activeShadow: "shadow-[#7a5230]/25",
    badgeBg: "bg-[#7a5230]",
    accentHex: "#7a5230",
  },
  {
    gradient: "from-[#5c6e56] to-[#384a35]",
    softBg: "bg-[#f0f3ef]",
    iconBg: "bg-[#e4ebe2]",
    iconText: "text-[#455840]",
    hoverBorder: "hover:border-[#9eb098]",
    activeShadow: "shadow-[#384a35]/25",
    badgeBg: "bg-[#5c6e56]",
    accentHex: "#5c6e56",
  },
  {
    gradient: "from-[#a85826] to-[#874318]",
    softBg: "bg-[#f8efe8]",
    iconBg: "bg-[#f0dfd1]",
    iconText: "text-[#9c4124]",
    hoverBorder: "hover:border-[#cf9f7e]",
    activeShadow: "shadow-[#9c4124]/25",
    badgeBg: "bg-[#9c4124]",
    accentHex: "#a85826",
  },
];

export function getCategoryTheme(name: string, idx = 0): CategoryTheme {
  const lower = (name || "").toLowerCase();
  if (lower.includes("masala") || lower.includes("spice") || lower.includes("food"))
    return CATEGORY_THEMES[0];
  if (lower.includes("book") || lower.includes("publication") || lower.includes("electronic"))
    return CATEGORY_THEMES[1];
  if (lower.includes("stationar") || lower.includes("pen") || lower.includes("home") || lower.includes("dhall"))
    return CATEGORY_THEMES[2];
  if (lower.includes("art") || lower.includes("colour") || lower.includes("color") || lower.includes("beauty") || lower.includes("fashion"))
    return CATEGORY_THEMES[3];
  if (lower.includes("novel") || lower.includes("story") || lower.includes("accessor"))
    return CATEGORY_THEMES[4];
  if (lower.includes("map") || lower.includes("sport") || lower.includes("paper"))
    return CATEGORY_THEMES[5];
  return CATEGORY_THEMES[idx % CATEGORY_THEMES.length];
}

export function getCategoryIconComponent(name: string) {
  const lower = (name || "").toLowerCase();
  if (
    lower.includes("electronic") ||
    lower.includes("tech") ||
    lower.includes("gadget") ||
    lower.includes("fan")
  )
    return Laptop;
  if (lower.includes("fashion") || lower.includes("cloth") || lower.includes("wear"))
    return Shirt;
  if (lower.includes("home") || lower.includes("kitchen") || lower.includes("decor"))
    return Sofa;
  if (lower.includes("beauty") || lower.includes("care") || lower.includes("cosmetic"))
    return HeartHandshake;
  if (lower.includes("sport") || lower.includes("fitness") || lower.includes("game"))
    return Trophy;
  if (lower.includes("accessor") || lower.includes("watch") || lower.includes("bag"))
    return Watch;
  if (lower.includes("gift"))
    return Gift;
  if (
    lower.includes("masala") ||
    lower.includes("spice") ||
    lower.includes("dhall") ||
    lower.includes("dal") ||
    lower.includes("food") ||
    lower.includes("cherni")
  )
    return UtensilsCrossed;
  if (
    lower.includes("book") ||
    lower.includes("publication") ||
    lower.includes("novel") ||
    lower.includes("story")
  )
    return BookOpen;
  if (
    lower.includes("art") ||
    lower.includes("colour") ||
    lower.includes("color") ||
    lower.includes("paint")
  )
    return Palette;
  if (lower.includes("stationar") || lower.includes("pen") || lower.includes("office"))
    return PenTool;
  if (lower.includes("paper"))
    return FileText;
  if (lower.includes("map"))
    return Map;
  return ShoppingBag;
}

// Dynamically extract relevant subcategory tags from actual items in the selected category
export interface SubcategoryTag {
  id: string;
  label: string;
  keywords: string[];
  count: number;
}

const SUBCATEGORY_RULES: Array<{ id: string; label: string; keywords: string[] }> = [
  { id: "powder", label: "Powders & Podi", keywords: ["podi", "powder", "masala", "மஞ்சள்", "மிளகாய்", "மல்லி"] },
  { id: "whole-spice", label: "Whole Spices & Seeds", keywords: ["जीरा", "சீரகம்", "மிளகு", "கடுகு", "வெந்தயம்", "பட்டை", "கிராம்பு", "ஏலக்காய்", "சோம்பு", "உப்பு"] },
  { id: "pulses", label: "Pulses, Dal & Grains", keywords: ["பருப்பு", "பட்டாணி", "கடலை", "பயறு", "dhall", "dal", "gram"] },
  { id: "pens-pencils", label: "Pens & Pencils", keywords: ["pen", "pencil", "apsara", "nataraj", "camlin", "marker", "chalk"] },
  { id: "erasers-tools", label: "Erasers, Scales & Tools", keywords: ["eraser", "sharpener", "scale", "geometry", "tape", "gum", "glue", "scissor", "stapler"] },
  { id: "notebooks-paper", label: "Notebooks & Sheets", keywords: ["note", "paper", "sheet", "a4", "chart", "pad", "file", "envelope", "cover"] },
  { id: "colours-art", label: "Colours, Crayons & Paint", keywords: ["color", "colour", "crayon", "sketch", "paint", "brush", "oil pastel", "water"] },
  { id: "books-guides", label: "Books & Publications", keywords: ["book", "guide", "dictionary", "atlas", "novel", "story", "tamil", "english", "table"] },
  { id: "maps-charts", label: "Maps & Educational Charts", keywords: ["map", "india", "world", "tamilnadu", "chart", "outline"] },
  { id: "pack-100g", label: "100g / Small Packs", keywords: ["100 g", "100g", "50 g", "50g"] },
  { id: "value-packs", label: "Bulk & Value Packs", keywords: ["kg", "1 kgs", "500 g", "500g", "250 g", "box", "100 pieces", "set", "pack"] },
];

export function getSubcategoriesForItems(items: StoreItem[]): SubcategoryTag[] {
  if (!items || items.length < 3) return [];
  const matches: SubcategoryTag[] = [];

  for (const rule of SUBCATEGORY_RULES) {
    const count = items.filter((item) => {
      const text = `${item.ItemName} ${item.Description || ""}`.toLowerCase();
      return rule.keywords.some((kw) => text.includes(kw.toLowerCase()));
    }).length;

    if (count > 0 && count < items.length) {
      matches.push({
        id: rule.id,
        label: rule.label,
        keywords: rule.keywords,
        count,
      });
    }
  }

  return matches.slice(0, 6);
}

interface Props {
  categories: StoreCategory[];
  activeCategory: string;
  currentView?: string;
  storeName?: string;
  onCategorySelect: (id: string) => void;
  onAllMenuClick: () => void;
  onHomeClick: () => void;
}

export function CategoryNav({
  categories,
  activeCategory,
  currentView = "home",
  storeName,
  onCategorySelect,
  onAllMenuClick,
  onHomeClick,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number; visible: boolean }>({
    left: 0,
    width: 0,
    visible: false,
  });

  const cleanStoreLabel = (() => {
    if (!storeName || storeName.toLowerCase() === "vcartify") return "All Products";
    if (storeName.toLowerCase().includes("cherni")) return "Cherni";
    const cleaned = storeName.replace(/\s*(traders?|store|shop)\s*$/i, "").trim();
    return cleaned || storeName;
  })();

  const allTabLabel = cleanStoreLabel;

  const displayCategories = categories.filter((c) => {
    if (!c || !c.Text) return false;
    const txt = c.Text.toLowerCase();
    if (txt === "all") return false;
    if (txt === allTabLabel.toLowerCase()) return false;
    if (txt.includes("trader")) return false;
    if (allTabLabel.toLowerCase().includes(txt)) return false;
    if (txt.includes(allTabLabel.toLowerCase())) return false;
    return true;
  });

  const isHomeActive = currentView === "home";
  const isProductsView = currentView === "products";
  const isAllActive =
    isProductsView &&
    (activeCategory.toLowerCase() === "all" ||
      (displayCategories.length === 0 && isProductsView));

  const activeKey = isHomeActive
    ? "__home__"
    : isAllActive
    ? "__all__"
    : isProductsView && activeCategory
    ? activeCategory.toLowerCase()
    : "";

  // Update sliding active pill indicator position smoothly
  useEffect(() => {
    const updatePosition = () => {
      if (!activeKey) {
        setIndicator({ left: 0, width: 0, visible: false });
        return;
      }

      const btn = buttonRefs.current[activeKey];
      const container = scrollRef.current;
      if (btn && container) {
        setIndicator({
          left: btn.offsetLeft,
          width: btn.offsetWidth,
          visible: true,
        });
      } else {
        setIndicator((prev) => ({ ...prev, visible: false }));
      }
    };

    updatePosition();
    if (activeKey) {
      const activeBtn = buttonRefs.current[activeKey];
      if (activeBtn && scrollRef.current) {
        activeBtn.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }

    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [activeKey, displayCategories.length]);

  const scrollByAmount = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  return (
    <nav className="bg-[#f5f0e6]/95 backdrop-blur-md text-[#20291e] sticky top-14 sm:top-[62px] z-30 shadow-xs border-b border-[#e5ddd0]">
      <div className="mx-auto w-full max-w-[1920px] px-2.5 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center h-12 sm:h-13 gap-1.5">
          {/* LEFT: All Categories Drawer Trigger */}
          <button
            onClick={onAllMenuClick}
            aria-label="Open all categories menu"
            title="Browse all categories"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 h-8 sm:h-9 rounded-xl border border-[#d8cfbf] hover:border-[#384a35] bg-[#fcfaf6] hover:bg-[#ebe4d6] text-[#20291e] transition-all shrink-0 group shadow-2xs cursor-pointer"
          >
            <Menu
              size={15}
              strokeWidth={2.3}
              className="text-[#384a35] group-hover:scale-110 transition-transform"
            />
            <span className="hidden md:inline text-xs font-bold tracking-tight">
              All Departments
            </span>
          </button>

          {/* Divider */}
          <div className="h-5 w-px bg-[#d8cfbf] mx-0.5 shrink-0" />

          {/* Scroll Left Button (Desktop) */}
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            aria-label="Scroll categories left"
            className="hidden lg:flex h-7 w-7 rounded-full border border-[#d8cfbf] bg-[#fcfaf6] hover:bg-[#ebe4d6] hover:border-[#384a35] text-[#455840] hover:text-[#20291e] items-center justify-center shrink-0 transition-all shadow-2xs cursor-pointer"
          >
            <ChevronLeft size={14} strokeWidth={2.4} />
          </button>

          {/* Horizontally Scrollable Category Bar with Sliding Active Indicator */}
          <div
            ref={scrollRef}
            className="relative flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-hide min-w-0 py-1.5 px-0.5"
          >
            {/* Animated Sliding Background Pill */}
            {indicator.visible && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1.5 bottom-1.5 rounded-xl bg-gradient-to-r from-[#384a35] via-[#2c3b29] to-[#20291e] shadow-md shadow-[#20291e]/20 transition-all duration-300 ease-out z-0"
                style={{
                  left: `${indicator.left}px`,
                  width: `${indicator.width}px`,
                }}
              />
            )}

            {/* Home Tab */}
            <button
              ref={(el) => {
                buttonRefs.current["__home__"] = el;
              }}
              onClick={onHomeClick}
              title="Go to Home page"
              className={`relative z-10 flex items-center gap-1.5 px-3 sm:px-3.5 h-8 sm:h-9 text-xs sm:text-sm font-bold whitespace-nowrap rounded-xl transition-all duration-200 shrink-0 cursor-pointer ${
                isHomeActive
                  ? "text-[#faf7f2]"
                  : "text-[#293526] hover:text-[#20291e] hover:bg-[#e9e1d2]/80"
              }`}
            >
              <span
                className={`h-5 w-5 rounded-lg flex items-center justify-center transition-colors ${
                  isHomeActive
                    ? "bg-white/20 text-[#faf7f2]"
                    : "bg-[#e3ebe0] text-[#384a35]"
                }`}
              >
                <Home size={12} strokeWidth={2.4} />
              </span>
              <span>Home</span>
            </button>

            {/* All Products Tab */}
            <button
              ref={(el) => {
                buttonRefs.current["__all__"] = el;
              }}
              onClick={() => onCategorySelect("all")}
              title={`Browse all ${allTabLabel}`}
              className={`relative z-10 flex items-center gap-1.5 px-3 sm:px-3.5 h-8 sm:h-9 text-xs sm:text-sm font-bold whitespace-nowrap rounded-xl transition-all duration-200 shrink-0 cursor-pointer ${
                isAllActive
                  ? "text-[#faf7f2]"
                  : "text-[#293526] hover:text-[#20291e] hover:bg-[#e9e1d2]/80"
              }`}
            >
              <span
                className={`h-5 w-5 rounded-lg flex items-center justify-center transition-colors ${
                  isAllActive
                    ? "bg-white/20 text-[#faf7f2]"
                    : "bg-[#e3ebe0] text-[#384a35]"
                }`}
              >
                <LayoutGrid size={12} strokeWidth={2.4} />
              </span>
              <span>{allTabLabel}</span>
            </button>

            {/* Category Pills with Colourful Icon Badges */}
            {displayCategories.map((cat, idx) => {
              const id = cat.Text.toLowerCase();
              const isActive = currentView === "products" && activeCategory === id;
              const Icon = getCategoryIconComponent(cat.Text);
              const theme = getCategoryTheme(cat.Text, idx);

              return (
                <button
                  key={cat.Value}
                  ref={(el) => {
                    buttonRefs.current[id] = el;
                  }}
                  onClick={() => onCategorySelect(id)}
                  title={
                    isActive
                      ? "Click again to unselect category"
                      : `Explore ${cat.Text}`
                  }
                  className={`group relative z-10 px-2.5 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm whitespace-nowrap rounded-xl transition-all duration-200 shrink-0 cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                    isActive
                      ? "text-[#faf7f2] font-bold"
                      : "text-[#293526] hover:text-[#20291e] font-semibold hover:bg-[#e9e1d2]/80"
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${
                      isActive
                        ? "bg-white/20 text-[#faf7f2]"
                        : `${theme.iconBg} ${theme.iconText}`
                    }`}
                  >
                    <Icon size={12} strokeWidth={2.3} />
                  </span>
                  <span>{cat.Text}</span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button (Desktop) */}
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            aria-label="Scroll categories right"
            className="hidden lg:flex h-7 w-7 rounded-full border border-[#d8cfbf] bg-[#fcfaf6] hover:bg-[#ebe4d6] hover:border-[#384a35] text-[#455840] hover:text-[#20291e] items-center justify-center shrink-0 transition-all shadow-2xs cursor-pointer"
          >
            <ChevronRight size={14} strokeWidth={2.4} />
          </button>

          {/* RIGHT: Flash Deals Pill */}
          <div className="hidden xl:flex items-center shrink-0 ml-1 pl-2.5 border-l border-[#d8cfbf]">
            <button
              onClick={() => onCategorySelect("all")}
              className="flex items-center gap-1.5 h-8 px-3.5 rounded-xl bg-gradient-to-r from-[#384a35] to-[#20291e] hover:opacity-95 text-[#faf7f2] border border-[#c89b3c]/40 transition-all whitespace-nowrap shadow-sm shadow-[#20291e]/15 cursor-pointer active:scale-95"
            >
              <Flame size={13} className="fill-[#e2b857] text-[#e2b857]" />
              <span className="text-xs font-bold tracking-wide">
                Super Saver Deals
              </span>
              <ChevronRight size={13} strokeWidth={2.4} className="text-[#e2b857]" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
export { Layers, Sparkles };