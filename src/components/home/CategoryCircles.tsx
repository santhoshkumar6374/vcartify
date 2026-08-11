import { StoreCategory, StoreItem } from "@/types/store";

interface Props {
  categories: StoreCategory[];
  items?: StoreItem[];
  onCategoryClick: (id: string) => void;
}

const CARD_COLORS = [
  "bg-orange-100", "bg-purple-100", "bg-red-100", "bg-emerald-100",
  "bg-blue-100", "bg-yellow-100", "bg-pink-100", "bg-indigo-100",
  "bg-cyan-100", "bg-rose-100", "bg-amber-100", "bg-teal-100",
  "bg-lime-100", "bg-violet-100",
];

const CATEGORY_EMOJI: Array<{ keywords: string[]; emoji: string }> = [
  { keywords: ["masala", "spice", "food", "cook"], emoji: "🍛" },
  { keywords: ["publication", "book", "novel", "story"], emoji: "📚" },
  { keywords: ["stationar", "office", "school"], emoji: "✏️" },
  { keywords: ["paper"], emoji: "📄" },
  { keywords: ["map"], emoji: "🗺️" },
  { keywords: ["art", "colour", "color", "paint"], emoji: "🎨" },
  { keywords: ["pen", "writing"], emoji: "🖊️" },
  { keywords: ["cherni", "cherry"], emoji: "🍒" },
  { keywords: ["fan"], emoji: "🌀" },
  { keywords: ["dhall", "dal"], emoji: "🫘" },
  { keywords: ["gift"], emoji: "🎁" },
  { keywords: ["bag"], emoji: "🎒" },
];

function getCategoryEmoji(name: string): string {
  const lower = name.toLowerCase();
  const rule = CATEGORY_EMOJI.find((r) =>
    r.keywords.some((kw) => lower.includes(kw))
  );
  return rule?.emoji || "📦";
}

export function CategoryCircles({ categories, items = [], onCategoryClick }: Props) {
  const displayCategories = categories
    .filter((c) => c.Text.toLowerCase() !== "all")
    .slice(0, 16);

  if (displayCategories.length === 0) return null;

  const getCategoryImage = (categoryId: number): string | null => {
    const productWithImage = items.find(
      (item) => item.CategoryId === categoryId && item.FileUrl
    );
    return productWithImage?.FileUrl || null;
  };

  return (
    <section className="bg-white py-10 lg:py-14 border-b border-gray-100">
      <div className="mx-auto max-w-[1500px] px-4">
        {/* Section Heading — REFINED */}
        <div className="text-center mb-8">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-gray-500 mb-2 uppercase">
            Shop by Category
          </p>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 tracking-tight">
            Browse Our Collections
          </h2>
          <p className="text-sm text-gray-600">
            Explore quality products across {displayCategories.length} categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 xl:grid-cols-9 gap-2 lg:gap-3">
          {displayCategories.map((cat, idx) => {
            const bgColor = CARD_COLORS[idx % CARD_COLORS.length];
            const productImage = getCategoryImage(cat.Value);
            const emoji = getCategoryEmoji(cat.Text);

            return (
              <button
                key={cat.Value}
                onClick={() => onCategoryClick(cat.Text.toLowerCase())}
                className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-0.5"
              >
                <div
                  className={`w-full aspect-square rounded-xl ${bgColor} shadow-sm group-hover:shadow-md transition-all overflow-hidden flex items-center justify-center relative`}
                >
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={cat.Text}
                      loading="lazy"
                      className="h-[75%] w-[75%] object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-3xl lg:text-4xl group-hover:scale-110 transition-transform duration-300">
                      {emoji}
                    </span>
                  )}
                </div>

                {/* Category name — REFINED (not too bold) */}
                <span className="text-[11px] lg:text-xs font-medium text-gray-700 text-center leading-tight px-0.5 line-clamp-2 group-hover:text-gray-900 transition-colors">
                  {cat.Text}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}