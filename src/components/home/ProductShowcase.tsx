import { ArrowRight } from "lucide-react";
import { StoreItem } from "@/types/store";
import { ProductCard } from "@/components/products/ProductCard";

interface Props {
  tagline: string;
  title: string;
  items: StoreItem[];
  bgColor?: string;
  taglineColor?: string;
  wishlist: string[];
  maxItems?: number;
  onAddToCart: (item: StoreItem, e?: React.MouseEvent) => void;
  onToggleWishlist: (name: string) => void;
  onProductClick: (item: StoreItem) => void;
  onQuickView?: (item: StoreItem) => void;
  onViewAllClick: () => void;
}

export function ProductShowcase({
  tagline,
  title,
  items,
  bgColor = "bg-white",
  taglineColor,
  wishlist,
  maxItems = 5,
  onAddToCart,
  onToggleWishlist,
  onProductClick,
  onQuickView,
  onViewAllClick,
}: Props) {
  const displayItems = items.slice(0, maxItems);

  if (displayItems.length === 0) return null;

  return (
    <section className={`${bgColor} py-10 lg:py-14 border-b border-[#e5ddd0]`}>
      <div className="mx-auto w-full max-w-[1920px] px-2.5 sm:px-4 lg:px-6 xl:px-8">
        {/* Structured Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 lg:mb-7 pb-4 border-b border-[#d8cfbf]/60 gap-3">
          <div>
            <div className="inline-flex items-center gap-2 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#384a35]" />
              <p
                className={`text-[10px] sm:text-[11px] font-bold tracking-[0.25em] ${
                  taglineColor || "text-[#55694f]"
                } uppercase`}
              >
                {tagline}
              </p>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#384a35]/10 text-[#384a35]">
                {items.length} {items.length === 1 ? "Product" : "Products"}
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-serif font-bold text-[#20291e] tracking-tight">
              {title}
            </h2>
          </div>

          <button
            onClick={onViewAllClick}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#fcfaf6] border border-[#d8cfbf] text-xs lg:text-sm font-semibold text-[#384a35] hover:bg-[#384a35] hover:text-[#faf7f2] hover:border-[#384a35] transition-all shadow-2xs cursor-pointer"
          >
            <span>Explore Collection</span>
            <ArrowRight size={14} strokeWidth={2.2} />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
          {displayItems.map((item) => (
            <ProductCard
              key={item.ItemName}
              item={item}
              brand="vCARTIFY EXCLUSIVE"
              isWishlisted={wishlist.includes(item.ItemName)}
              onAddToCart={(e) => onAddToCart(item, e)}
              onToggleWishlist={() => onToggleWishlist(item.ItemName)}
              onQuickView={() =>
                onQuickView ? onQuickView(item) : onProductClick(item)
              }
              onClick={() => onProductClick(item)}
            />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-5 text-center sm:hidden">
          <button
            onClick={onViewAllClick}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#fcfaf6] border border-[#d8cfbf] text-xs font-semibold text-[#384a35] hover:bg-[#384a35] hover:text-[#faf7f2] transition-all"
          >
            Explore All Products
            <ArrowRight size={14} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </section>
  );
}