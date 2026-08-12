import { ShoppingCart, Zap, Heart, Share2 } from "lucide-react";
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
    <div className="bg-gray-50/50 min-h-screen pb-20 lg:pb-6">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-4 py-3 sm:py-6">

        {/* Breadcrumb — Hidden on mobile */}
        <div className="hidden sm:block">
          <Breadcrumb
            items={[
              { label: "Home", onClick: onHomeClick },
              { label: categoryName, onClick: onCategoryClick },
              { label: item.ItemName },
            ]}
          />
        </div>

        {/* Main content card */}
        <div className="mt-0 sm:mt-4 bg-white rounded-none sm:rounded-2xl border-0 sm:border border-gray-200 sm:shadow-sm overflow-hidden">
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

              <ProductOffers />

              {/* Desktop CTAs — hidden on mobile (sticky bottom bar instead) */}
              <div className="hidden lg:grid grid-cols-2 gap-3 pt-2">
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

      {/* ✨ MOBILE STICKY BOTTOM BAR (Add to Cart + Buy Now) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-40 safe-area-bottom">
        <div className="flex items-stretch gap-2 p-3">
          {/* Wishlist icon */}
          <button
            onClick={() => onToggleWishlist(item.ItemName)}
            aria-label="Wishlist"
            className="shrink-0 h-12 w-12 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors"
          >
            <Heart
              size={22}
              strokeWidth={2}
              className={
                isWishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700"
              }
            />
          </button>

          {/* Add to Cart */}
          <button
            onClick={() => onAddToCart(item)}
            disabled={item.AvailableStock <= 0}
            className="flex-1 h-12 rounded-lg bg-white border-2 border-gray-900 text-gray-900 font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-gray-900 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} strokeWidth={2} />
            Add to Cart
          </button>

          {/* Buy Now */}
          <button
            onClick={() => onBuyNow(item)}
            disabled={item.AvailableStock <= 0}
            className="flex-1 h-12 rounded-lg bg-gray-900 text-white font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-black transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <Zap size={16} fill="currentColor" strokeWidth={0} />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}