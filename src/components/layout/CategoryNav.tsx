import { Menu, ChevronRight, Home } from "lucide-react";
import { StoreCategory } from "@/types/store";

interface Props {
  categories: StoreCategory[];
  activeCategory: string;
  currentView?: string;
  onCategorySelect: (id: string) => void;
  onAllMenuClick: () => void;
  onHomeClick: () => void;
}

export function CategoryNav({
  categories,
  activeCategory,
  currentView = "home",
  onCategorySelect,
  onAllMenuClick,
  onHomeClick,
}: Props) {
  const displayCategories = categories.filter(
    (c) => c.Text.toLowerCase() !== "all"
  );

  const isHomeActive = currentView === "home";

  return (
    <nav className="bg-white text-gray-800 sticky top-14 sm:top-[60px] z-30 shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-[1500px] px-2 sm:px-3 lg:px-4">
        <div className="flex items-center h-10 sm:h-11">

          {/* LEFT: Menu icon + Home + Categories (scrollable) */}
          <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide min-w-0">

            {/* ✨ Menu Icon ONLY (no text) */}
            <button
              onClick={onAllMenuClick}
              aria-label="Open menu"
              title="Browse all categories"
              className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg border border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all shrink-0 text-gray-800 group"
            >
              <Menu size={16} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
            </button>

            {/* Home */}
            <button
              onClick={onHomeClick}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 h-7 sm:h-8 text-xs sm:text-sm font-medium whitespace-nowrap border rounded-lg transition-all shrink-0 ${
                isHomeActive
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-transparent hover:border-gray-900 hover:bg-gray-100 text-gray-800"
              }`}
            >
              <Home size={14} strokeWidth={2} />
              <span>Home</span>
            </button>

            {/* Divider */}
            <div className="h-5 sm:h-6 w-px bg-gray-300 mx-0.5 sm:mx-1 shrink-0" />

            {/* Categories */}
            {displayCategories.map((cat) => {
              const id = cat.Text.toLowerCase();
              const isActive = !isHomeActive && activeCategory === id;
              return (
                <button
                  key={cat.Value}
                  onClick={() => onCategorySelect(id)}
                  className={`px-2.5 sm:px-3 h-7 sm:h-8 text-xs sm:text-sm whitespace-nowrap border rounded-lg transition-all shrink-0 ${
                    isActive
                      ? "border-gray-900 bg-gray-900 text-white font-medium"
                      : "border-transparent hover:border-gray-900 hover:bg-gray-100 text-gray-700 font-normal"
                  }`}
                >
                  {cat.Text}
                </button>
              );
            })}
          </div>

          {/* RIGHT: Sale Badge */}
          <div className="hidden lg:flex items-center shrink-0 ml-2 pl-3 border-l border-gray-200">
            <button className="flex items-center gap-2 h-8 px-3 rounded-lg bg-gray-900 hover:bg-black transition-colors whitespace-nowrap">
              <span className="text-sm font-medium text-white">Big Sale</span>
              <span className="h-4 w-px bg-white/40" />
              <span className="text-sm font-medium text-white flex items-center gap-0.5">
                Live Now
                <ChevronRight size={13} strokeWidth={2} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}