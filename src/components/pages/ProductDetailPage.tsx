import { ShoppingCart, Zap } from "lucide-react";
import { StoreItem } from "@/types/store";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductInfo } from "@/components/products/ProductInfo";
import { ProductOffers } from "@/components/products/ProductOffers";
import { ProductTabs } from "@/components/products/ProductTabs";
import { SimilarProducts } from "@/components/products/SimilarProducts";

interface Props {
  item: StoreItem;
  allItems: StoreItem[];
  categoryName: string;
  wishlist: string[];
  onAddToCart: (item: StoreItem) => void;
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
    <div className="bg-gray-50/50 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", onClick: onHomeClick },
            { label: categoryName, onClick: onCategoryClick },
            { label: item.ItemName },
          ]}
        />

        {/* Main content card */}
        <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-8">
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
            <div className="space-y-6">
              <ProductInfo item={item} />

              <ProductOffers />

              {/* CTAs — Refined */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => onAddToCart(item)}
                  disabled={item.AvailableStock <= 0}
                  className="h-12 rounded-lg bg-white border-2 border-gray-900 text-gray-900 font-medium text-base flex items-center justify-center gap-2 hover:bg-gray-900 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={18} strokeWidth={2} />
                  Add to Cart
                </button>
                <button
                  onClick={() => onBuyNow(item)}
                  disabled={item.AvailableStock <= 0}
                  className="h-12 rounded-lg bg-gray-900 text-white font-medium text-base flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  <Zap size={18} fill="currentColor" strokeWidth={0} />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="mt-6">
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
    </div>
  );
}