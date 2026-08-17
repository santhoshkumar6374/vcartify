import { useState, useEffect, useMemo } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { CategoryNav } from "@/components/layout/CategoryNav";
import { SideDrawer } from "@/components/layout/SideDrawer";
import { HomePage } from "@/components/pages/HomePage";
import { ProductListPage } from "@/components/pages/ProductListPage";
import { ProductDetailPage } from "@/components/pages/ProductDetailPage";
import { CartPage } from "@/components/pages/CartPage";
import { OrderSuccessPage } from "@/components/pages/OrderSuccessPage";
import { WishlistPage } from "@/components/pages/WishlistPage";
import { LocationModal, DeliveryLocation } from "@/components/modals/LocationModal";
import { API_ROUTES } from "@/constants/apiRoutes";
import { apiFetch } from "@/utils/apiFetch";
import { ApiEnvelope, StoreResponse, StoreItem } from "@/types/store";
import { getStoreCode } from "@/config/storeConfig";

const STORE_CODE = getStoreCode();
const CART_STORAGE_KEY = "store_cart_guest";
const WISHLIST_STORAGE_KEY = "store_wishlist_guest";
const LOCATION_STORAGE_KEY = "store_delivery_location";

type PageView =
  | "home" | "products" | "detail" | "cart" | "success" | "wishlist";

interface CartItem extends StoreItem {
  qty: number;
}

export default function App() {
  const [storeData, setStoreData] = useState<StoreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<PageView>("home");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<StoreItem | null>(null);
  const [lastOrderId, setLastOrderId] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [deliveryLocation, setDeliveryLocation] = useState<DeliveryLocation>({
    pincode: "641604",
    city: "Tirupur",
    state: "Tamil Nadu",
  });
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // Restore from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch { /* ignore */ }
    }
    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (savedWishlist) {
      try { setWishlist(JSON.parse(savedWishlist)); } catch { /* ignore */ }
    }
    const savedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (savedLocation) {
      try { setDeliveryLocation(JSON.parse(savedLocation)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(deliveryLocation));
  }, [deliveryLocation]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await apiFetch<ApiEnvelope<StoreResponse>>(
          API_ROUTES.ONLINE_STORE(STORE_CODE)
        );
        if (cancelled) return;
        if (!data.Status) setError(data.ErrorMessage || "Failed");
        else setStoreData(data.Response);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    document.title = storeData?.StoreName || "vCartify";
    const favicon = document.getElementById("favicon") as HTMLLinkElement | null;
    if (favicon && storeData?.StoreImage) {
      favicon.href = `data:image/png;base64,${storeData.StoreImage}`;
    }
  }, [storeData]);

  const filteredItems = useMemo(() => {
    if (!storeData) return [];
    let items = storeData.ItemList;

    if (activeCategory !== "all") {
      const cat = storeData.DropDownList.find(
        (c) => c.Text.toLowerCase() === activeCategory.toLowerCase()
      );
      if (cat) items = items.filter((i) => i.CategoryId === cat.Value);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((i) => i.ItemName.toLowerCase().includes(q));
    }

    return items;
  }, [storeData, activeCategory, searchQuery]);

  const currentCategoryName =
    activeCategory === "all"
      ? "All Products"
      : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

  const handleLocationClick = () => {
    setLocationModalOpen(true);
  };

  const handleLocationChange = (location: DeliveryLocation) => {
    setDeliveryLocation(location);
  };

  // ✨ NO LOGIN REQUIRED — Direct add to cart
  const handleAddToCart = (item: StoreItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.ItemName === item.ItemName);
      if (existing) {
        return prev.map((c) =>
          c.ItemName === item.ItemName ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
    // Optional: show alert
    // alert("Added to cart!");
  };

  const handleUpdateQty = (itemName: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(itemName);
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.ItemName === itemName ? { ...c, qty: newQty } : c))
    );
  };

  const handleRemoveFromCart = (itemName: string) => {
    setCart((prev) => prev.filter((c) => c.ItemName !== itemName));
  };

  const handleToggleWishlist = (name: string) => {
    setWishlist((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleWishlistClick = () => {
    setCurrentView("wishlist");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearWishlist = () => {
    if (window.confirm("Clear all items from wishlist?")) {
      setWishlist([]);
    }
  };

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    setSearchQuery("");
    setCurrentView("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogoClick = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setSelectedProduct(null);
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShopAllClick = () => {
    setActiveCategory("all");
    setCurrentView("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (v: string) => {
    setSearchQuery(v);
    if (v.trim() && currentView === "home") {
      setCurrentView("products");
    }
  };

  const handleProductClick = (item: StoreItem) => {
    setSelectedProduct(item);
    setCurrentView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCartClick = () => {
    setCurrentView("cart");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOrderComplete = (orderId: string) => {
    setLastOrderId(orderId);
    setCart([]);
    setCurrentView("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBuyNow = (item: StoreItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.ItemName === item.ItemName);
      if (existing) {
        return prev.map((c) =>
          c.ItemName === item.ItemName ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setTimeout(() => setCurrentView("cart"), 100);
  };

  const handleShare = () => {
    if (navigator.share && selectedProduct) {
      navigator.share({
        title: selectedProduct.ItemName,
        text: `Check out ${selectedProduct.ItemName} on ${storeData?.StoreName || "vCartify"}!`,
        url: window.location.href,
      }).catch(() => { /* user cancelled */ });
    } else {
      alert("Product link copied!");
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 rounded-full border-4 border-black border-t-transparent animate-spin" />
          <p className="mt-4 text-gray-600 font-bold">Loading store...</p>
        </div>
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold mb-2">Couldn't load the store</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const hideHeader = currentView === "success";

  return (
    <div className="min-h-screen bg-white font-sans">
      {!hideHeader && (
        <>
          <AnnouncementBar />
          <Header
            storeName={storeData.StoreName || "vCartify"}
            storeImage={storeData.StoreImage}
            cartCount={cartCount}
            wishlistCount={wishlist.length}
            searchQuery={searchQuery}
            categories={storeData.DropDownList}
            user={null}
            deliveryLocation={deliveryLocation}
            onSearchChange={handleSearchChange}
            onCartClick={handleCartClick}
            onWishlistClick={handleWishlistClick}
            onProfileClick={() => alert("Profile feature disabled")}
            onOrdersClick={() => alert("Orders feature disabled")}
            onAddressesClick={() => alert("Addresses feature disabled")}
            onNotificationsClick={() => alert("Notifications feature disabled")}
            onSettingsClick={() => alert("Settings feature disabled")}
            onLogout={() => {}}
            onLogoClick={handleLogoClick}
            onMobileMenuClick={() => setDrawerOpen(true)}
            onLocationClick={handleLocationClick}
          />
          <CategoryNav
            categories={storeData.DropDownList}
            activeCategory={activeCategory}
            currentView={currentView}
            onCategorySelect={handleCategorySelect}
            onAllMenuClick={() => setDrawerOpen(true)}
            onHomeClick={handleLogoClick}
          />
        </>
      )}

      {currentView === "home" && (
        <HomePage
          items={storeData.ItemList}
          categories={storeData.DropDownList}
          banners={storeData.CarouselImages || undefined}
          storeName={storeData.StoreName || "vCartify"}
          wishlist={wishlist}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          onProductClick={handleProductClick}
          onCategoryClick={handleCategorySelect}
          onShopAllClick={handleShopAllClick}
        />
      )}

      {currentView === "products" && (
        <ProductListPage
          items={filteredItems}
          categoryName={currentCategoryName}
          wishlist={wishlist}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          onProductClick={handleProductClick}
          onHomeClick={handleLogoClick}
        />
      )}

      {currentView === "detail" && selectedProduct && (
        <ProductDetailPage
          item={selectedProduct}
          allItems={storeData.ItemList}
          categoryName={currentCategoryName}
          wishlist={wishlist}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          onProductClick={handleProductClick}
          onHomeClick={handleLogoClick}
          onCategoryClick={() => setCurrentView("products")}
          onBuyNow={handleBuyNow}
          onShare={handleShare}
        />
      )}

      {currentView === "cart" && (
        <CartPage
          cart={cart}
          storeName={storeData.StoreName || "vCartify"}
          storePhone={storeData.PhoneNumber || ""}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemoveFromCart}
          onOrderComplete={handleOrderComplete}
          onContinueShopping={handleLogoClick}
        />
      )}

      {currentView === "success" && (
        <OrderSuccessPage
          orderId={lastOrderId}
          onContinueShopping={handleLogoClick}
        />
      )}

      {currentView === "wishlist" && (
        <WishlistPage
          wishlist={wishlist}
          allItems={storeData.ItemList}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          onProductClick={handleProductClick}
          onContinueShopping={handleLogoClick}
          onClearAll={handleClearWishlist}
        />
      )}

      <SideDrawer
        isOpen={drawerOpen}
        categories={storeData.DropDownList}
        wishlistCount={wishlist.length}
        cartCount={cartCount}
        user={null}
        onClose={() => setDrawerOpen(false)}
        onCategorySelect={handleCategorySelect}
        onSignInClick={() => alert("Login not required")}
        onWishlistClick={handleWishlistClick}
        onOrdersClick={() => alert("Orders feature disabled")}
        onAddressesClick={() => alert("Addresses feature disabled")}
        onNotificationsClick={() => alert("Notifications feature disabled")}
        onSettingsClick={() => alert("Settings feature disabled")}
        onLogout={() => {}}
      />

      <LocationModal
        isOpen={locationModalOpen}
        currentLocation={deliveryLocation}
        onClose={() => setLocationModalOpen(false)}
        onLocationChange={handleLocationChange}
      />
    </div>
  );
}