import { StoreItem } from "@/types/store";
import { ProductCard } from "./ProductCard";

interface Props {
  currentItem: StoreItem;
  allItems: StoreItem[];
  wishlist: string[];
  onAddToCart: (item: StoreItem) => void;
  onToggleWishlist: (name: string) => void;
  onProductClick: (item: StoreItem) => void;
}

export function SimilarProducts({
  currentItem,
  allItems,
  wishlist,
  onAddToCart,
  onToggleWishlist,
  onProductClick,
}: Props) {
  const similar = allItems
    .filter(
      (i) =>
        i.CategoryId === currentItem.CategoryId &&
        i.ItemName !== currentItem.ItemName
    )
    .slice(0, 5);

  const displayItems =
    similar.length > 0
      ? similar
      : allItems.filter((i) => i.ItemName !== currentItem.ItemName).slice(0, 5);

  if (displayItems.length === 0) return null;

  return (
    <section className="mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 px-3 sm:px-0">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-4 sm:mb-6">
        Similar Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
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
    </section>
  );
}