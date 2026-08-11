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
  onAddToCart: (item: StoreItem) => void;
  onToggleWishlist: (name: string) => void;
  onProductClick: (item: StoreItem) => void;
  onViewAllClick: () => void;
}

export function ProductShowcase({
  tagline,
  title,
  items,
  bgColor = "bg-white",
  wishlist,
  maxItems = 5,
  onAddToCart,
  onToggleWishlist,
  onProductClick,
  onViewAllClick,
}: Props) {
  const displayItems = items.slice(0, maxItems);

  if (displayItems.length === 0) return null;

  return (
    <section className={`${bgColor} py-10 lg:py-14 border-b border-gray-100`}>
      <div className="mx-auto max-w-[1500px] px-4">
        {/* Header — REFINED */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-gray-500 mb-2 uppercase">
              {tagline}
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              {title}
            </h2>
          </div>

          <button
            onClick={onViewAllClick}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:gap-2 transition-all"
          >
            View All
            <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
          {displayItems.map((item) => (
            <ProductCard
              key={item.ItemName}
              item={item}
              brand="vCARTIFY EXCLUSIVE"
              isWishlisted={wishlist.includes(item.ItemName)}
              rating={4}
              reviewCount={2543}
              onAddToCart={() => onAddToCart(item)}
              onToggleWishlist={() => onToggleWishlist(item.ItemName)}
              onClick={() => onProductClick(item)}
            />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-6 text-center sm:hidden">
          <button
            onClick={onViewAllClick}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            View All Products
            <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}