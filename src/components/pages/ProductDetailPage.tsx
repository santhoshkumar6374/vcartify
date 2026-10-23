import { ShoppingCart, Zap, Heart } from "lucide-react";
import { StoreItem } from "@/types/store";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductInfo } from "@/components/products/ProductInfo";
import { ProductTabs } from "@/components/products/ProductTabs";
import { SimilarProducts } from "@/components/products/SimilarProducts";

interface Props {
  item: StoreItem;
  allItems: StoreItem[];
  categoryName: string;
  wishlist: string[];
  onAddToCart: (item: StoreItem, e?: React.MouseEvent) => void;
  onToggleWishlist: (name: string) => void;
  onProductClick: (item: StoreItem) => void;
  onHomeClick: () => void;
  onCategoryClick: () => void;
  onBuyNow: (item: StoreItem) => void;
  onShare: () => void;
}

export function ProductDetailPage({
  item,
  allItems,
  categoryName,
  wishlist,
  onAddToCart,
  onToggleWishlist,
  onProductClick,
  onHomeClick,
  onCategoryClick,
  onBuyNow,
  onShare,
}: Props) {
  const isWishlisted = wishlist.includes(item.ItemName);

  return (
    <div className="bg-[#f9f6f0] min-h-screen pb-20 lg:pb-8 animate-page-entrance">
      <div className="mx-auto w-full max-w-[1920px] px-2.5 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-6">
        <div className="hidden sm:block">
          <Breadcrumb
            items={[
              { label: "Home", onClick: onHomeClick },
              { label: "All Products", onClick: onCategoryClick },
              ...(categoryName && categoryName.toLowerCase() !== "all products"
                ? [{ label: categoryName, onClick: onCategoryClick }]
                : []),
              { label: item.ItemName },
            ]}
          />
        </div>

        <div className="mt-0 sm:mt-4 bg-[#fcfaf6] rounded-none sm:rounded-2xl border-0 sm:border border-[#e5ddd0] sm:shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-12 p-3 sm:p-6 lg:p-8">
            {/* LEFT: Gallery */}
            <div>
              <ProductGallery
                item={item}
                isWishlisted={isWishlisted}
                onToggleWishlist={() => onToggleWishlist(item.ItemName)}
                onShare={onShare}
              />
            </div>

            {/* RIGHT: Info */}
            <div className="space-y-4 sm:space-y-6">
              <ProductInfo item={item} />

              {/* Desktop CTAs */}
              <div className="hidden lg:grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={(e) => onAddToCart(item, e)}
                  disabled={item.AvailableStock <= 0}
                  className="h-12 rounded-lg bg-transparent border-2 border-[#384a35] text-[#384a35] font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#384a35] hover:text-[#faf7f2] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-98"
                >
                  <ShoppingCart size={18} strokeWidth={2} />
                  Add to Cart
                </button>
                <button
                  onClick={() => onBuyNow(item)}
                  disabled={item.AvailableStock <= 0}
                  className="h-12 rounded-lg bg-[#384a35] text-[#faf7f2] font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#283626] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  <Zap size={18} fill="currentColor" strokeWidth={0} />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="mt-3 sm:mt-6">
          <ProductTabs item={item} />
        </div>

        {/* Similar Products */}
        <SimilarProducts
          currentItem={item}
          allItems={allItems}
          wishlist={wishlist}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          onProductClick={onProductClick}
        />
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#fcfaf6] border-t border-[#e5ddd0] shadow-2xl z-40">
        <div className="flex items-stretch gap-2 p-3">
          <button
            onClick={() => onToggleWishlist(item.ItemName)}
            aria-label="Wishlist"
            className="shrink-0 h-12 w-12 rounded-lg border border-[#d8cfbf] flex items-center justify-center hover:border-[#384a35] transition-colors bg-white"
          >
            <Heart
              size={22}
              strokeWidth={2}
              className={
                isWishlisted
                  ? "fill-[#8b3a2b] text-[#8b3a2b]"
                  : "text-[#495445]"
              }
            />
          </button>

          <button
            onClick={(e) => onAddToCart(item, e)}
            disabled={item.AvailableStock <= 0}
            className="flex-1 h-12 rounded-lg bg-transparent border-2 border-[#384a35] text-[#384a35] font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-[#384a35] hover:text-[#faf7f2] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-98"
          >
            <ShoppingCart size={16} strokeWidth={2} />
            Add to Cart
          </button>

          <button
            onClick={() => onBuyNow(item)}
            disabled={item.AvailableStock <= 0}
            className="flex-1 h-12 rounded-lg bg-[#384a35] text-[#faf7f2] font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-[#283626] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <Zap size={16} fill="currentColor" strokeWidth={0} />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}