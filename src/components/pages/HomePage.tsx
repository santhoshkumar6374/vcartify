import { StoreItem, StoreCategory } from "@/types/store";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryCircles } from "@/components/home/CategoryCircles";
import { TodaysEdit } from "@/components/home/TodaysEdit";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { JournalStories } from "@/components/home/JournalStories";
import { MembershipBanner } from "@/components/home/MembershipBanner";
import { Testimonials } from "@/components/home/Testimonials";

interface Props {
  items: StoreItem[];
  categories: StoreCategory[];
  banners?: string[];
  storeName?: string;
  wishlist: string[];
  onAddToCart: (item: StoreItem) => void;
  onToggleWishlist: (name: string) => void;
  onProductClick: (item: StoreItem) => void;
  onCategoryClick: (id: string) => void;
  onShopAllClick: () => void;
}

export function HomePage({
  items,
  categories,
  banners,
  storeName = "vCartify",
  wishlist,
  onAddToCart,
  onToggleWishlist,
  onProductClick,
  onCategoryClick,
  onShopAllClick,
}: Props) {
  // Filter usable categories (skip "all")
  const realCategories = categories.filter(
    (c) => c.Text.toLowerCase() !== "all"
  );

  // Get products by first 3 categories dynamically
  const cat1 = realCategories[0];
  const cat2 = realCategories[1];
  const cat3 = realCategories[2];

  const section1Items = cat1
    ? items.filter((i) => i.CategoryId === cat1.Value).slice(0, 5)
    : items.slice(0, 5);

  const section2Items = cat2
    ? items.filter((i) => i.CategoryId === cat2.Value).slice(0, 5)
    : items.slice(5, 10);

  const section3Items = cat3
    ? items.filter((i) => i.CategoryId === cat3.Value).slice(0, 5)
    : items.slice(10, 15);

  return (
    <>
      {/* 1. Hero Carousel (uses real backend banners) */}
      <HeroCarousel
        banners={banners}
        storeName={storeName}
        onCtaClick={onShopAllClick}
      />

      {/* 2. Category Circles (dynamic from backend) */}
      <CategoryCircles
        categories={categories}
        onCategoryClick={onCategoryClick}
      />

      {/* 3. Today's Best Deals (dark countdown) */}
      <TodaysEdit
        items={items}
        onProductClick={onProductClick}
        onViewAllClick={onShopAllClick}
      />

      {/* 4. Section 1: First backend category */}
      {section1Items.length > 0 && cat1 && (
        <ProductShowcase
          tagline={cat1.Text.toUpperCase()}
          title={`Best of ${cat1.Text}`}
          items={section1Items}
          bgColor="bg-white"
          taglineColor="text-[#ec4899]"
          wishlist={wishlist}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          onProductClick={onProductClick}
          onViewAllClick={() => onCategoryClick(cat1.Text.toLowerCase())}
        />
      )}

      {/* 5. Section 2: Second backend category */}
      {section2Items.length > 0 && cat2 && (
        <ProductShowcase
          tagline={cat2.Text.toUpperCase()}
          title={`Explore ${cat2.Text}`}
          items={section2Items}
          bgColor="bg-blue-50/50"
          taglineColor="text-blue-600"
          wishlist={wishlist}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          onProductClick={onProductClick}
          onViewAllClick={() => onCategoryClick(cat2.Text.toLowerCase())}
        />
      )}

      {/* 6. Section 3: Third backend category */}
      {section3Items.length > 0 && cat3 && (
        <ProductShowcase
          tagline={cat3.Text.toUpperCase()}
          title={`Shop ${cat3.Text}`}
          items={section3Items}
          bgColor="bg-amber-50/50"
          taglineColor="text-amber-600"
          wishlist={wishlist}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          onProductClick={onProductClick}
          onViewAllClick={() => onCategoryClick(cat3.Text.toLowerCase())}
        />
      )}

      {/* 7. Journal / Shopping Guides */}
      <JournalStories storeName={storeName} />

      {/* 8. Membership Banner */}
      <MembershipBanner storeName={storeName} />

      {/* 9. Testimonials */}
      <Testimonials storeName={storeName} />
    </>
  );
}