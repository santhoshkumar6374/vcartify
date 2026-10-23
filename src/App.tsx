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
import { PolicyPage } from "@/components/pages/PolicyPage";
import { LocationModal, DeliveryLocation } from "@/components/modals/LocationModal";
import { QuickViewModal } from "@/components/modals/QuickViewModal";
import { BackToTop } from "@/components/ui/BackToTop";
import { Footer } from "@/components/layout/Footer";
import { PolicyModal, PolicyType } from "@/components/modals/PolicyModal";
import { API_ROUTES } from "@/constants/apiRoutes";
import { apiFetch } from "@/utils/apiFetch";
import { ApiEnvelope, StoreResponse, StoreItem } from "@/types/store";
import { getStoreCode, getInitialRoute, PageView } from "@/config/storeConfig";
import { searchProducts } from "@/utils/searchHelper";

const CART_STORAGE_KEY = "store_cart_guest";
const WISHLIST_STORAGE_KEY = "store_wishlist_guest";
const LOCATION_STORAGE_KEY = "store_delivery_location";

interface CartItem extends StoreItem {
  qty: number;
}

interface FlyingCartItem {
  id: number;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
  imageUrl?: string | null;
  name: string;
}

interface AppToast {
  id: number;
  title: string;
  badge?: string;
  icon?: string;
}

export default function App() {
  const initialRoute = useMemo(() => getInitialRoute(), []);
  const [storeCode, setStoreCode] = useState<string>(getStoreCode);
  const [storeData, setStoreData] = useState<StoreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<PageView>(initialRoute.view);
  const [activeCategory, setActiveCategory] = useState<string>(initialRoute.category);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<StoreItem | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<StoreItem | null>(null);
  const [lastOrderId, setLastOrderId] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Fly-to-Cart and UI animation states
  const [flyingItems, setFlyingItems] = useState<FlyingCartItem[]>([]);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const [activeToast, setActiveToast] = useState<AppToast | null>(null);

  const showToast = (title: string, badge?: string, icon?: string) => {
    setActiveToast({ id: Date.now(), title, badge, icon });
  };

  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => setActiveToast(null), 2400);
    return () => clearTimeout(timer);
  }, [activeToast]);

  const [deliveryLocation, setDeliveryLocation] = useState<DeliveryLocation>({
    pincode: "641604",
    city: "Tirupur",
    state: "Tamil Nadu",
  });
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType>("privacy");

  const handleOpenPolicy = (policy: PolicyType, fullPage = false) => {
    setActivePolicy(policy);
    if (fullPage) {
      setCurrentView("policy");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setPolicyModalOpen(true);
    }
  };

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

  // Sync browser back/forward buttons with current view and category
  useEffect(() => {
    const handlePopState = () => {
      const newStore = getStoreCode();
      const route = getInitialRoute();
      if (newStore !== storeCode) {
        setStoreCode(newStore);
      }
      setCurrentView(route.view);
      setActiveCategory(route.category);
      setSelectedProduct(null);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [storeCode]);

  // Sync current view and active category with URL pathname
  useEffect(() => {
    let targetPath = "/";
    if (currentView === "home") {
      targetPath = "/";
    } else if (storeCode === "cherni") {
      if (currentView === "cart") {
        targetPath = "/cherni/cart";
      } else if (currentView === "wishlist") {
        targetPath = "/cherni/wishlist";
      } else {
        targetPath = "/cherni";
      }
    } else {
      if (currentView === "cart") {
        targetPath = "/cart";
      } else if (currentView === "wishlist") {
        targetPath = "/wishlist";
      } else if (currentView === "products") {
        targetPath = "/products";
      }
    }

    if (targetPath && window.location.pathname !== targetPath) {
      window.history.pushState({ view: currentView, category: activeCategory, store: storeCode }, "", targetPath);
    }
  }, [currentView, activeCategory, storeCode]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<ApiEnvelope<StoreResponse>>(
          API_ROUTES.ONLINE_STORE(storeCode)
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
  }, [storeCode]);

  const cleanStoreName = useMemo(() => {
    if (!storeData?.StoreName) return "vCartify";
    if (storeData.StoreName.toLowerCase() === "vcartify") return "vCartify";
    if (storeData.StoreName.toLowerCase().includes("cherni")) return "Cherni";
    const cleaned = storeData.StoreName.replace(/\s*(traders?|store|shop)\s*$/i, "").trim();
    return cleaned || storeData.StoreName;
  }, [storeData]);

  const currentCategoryName =
    activeCategory === "all"
      ? (cleanStoreName !== "vCartify" ? cleanStoreName : "All Products")
      : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

  useEffect(() => {
    const baseName = cleanStoreName;
    switch (currentView) {
      case "products":
        document.title = `${currentCategoryName} — ${baseName}`;
        break;
      case "detail":
        document.title = selectedProduct ? `${selectedProduct.ItemName} — ${baseName}` : baseName;
        break;
      case "cart":
        document.title = `Shopping Cart (${cart.reduce((s, i) => s + i.qty, 0)}) — ${baseName}`;
        break;
      case "wishlist":
        document.title = `My Wishlist (${wishlist.length}) — ${baseName}`;
        break;
      case "success":
        document.title = `Order Confirmed — ${baseName}`;
        break;
      case "home":
      default:
        document.title = `${baseName} — Curated Online Store`;
        break;
    }
    const favicon = document.getElementById("favicon") as HTMLLinkElement | null;
    if (favicon && storeData?.StoreImage) {
      favicon.href = `data:image/png;base64,${storeData.StoreImage}`;
    }
  }, [storeData, currentView, currentCategoryName, selectedProduct, cart, wishlist.length]);

  const filteredItems = useMemo(() => {
    if (!storeData) return [];
    const allItems = storeData.ItemList || [];
    const trimmed = searchQuery.trim();

    if (activeCategory !== "all") {
      const cleanActive = activeCategory.toLowerCase().replace(/[-_]/g, " ").trim();
      const cat = storeData.DropDownList?.find((c) => {
        const cleanText = c.Text.toLowerCase().replace(/[-_]/g, " ").trim();
        return (
          c.Text.toLowerCase() === activeCategory.toLowerCase() ||
          cleanText === cleanActive
        );
      });

      if (cat) {
        const categoryItems = allItems.filter((i) => i.CategoryId === cat.Value);
        if (trimmed) {
          return searchProducts(categoryItems, trimmed, storeData.DropDownList);
        }
        return categoryItems;
      }
    }

    if (trimmed) {
      return searchProducts(allItems, trimmed, storeData.DropDownList);
    }

    return allItems;
  }, [storeData, activeCategory, searchQuery]);

  const handleLocationClick = () => {
    setLocationModalOpen(true);
  };

  const handleLocationChange = (location: DeliveryLocation) => {
    setDeliveryLocation(location);
  };

  // ✨ NO LOGIN REQUIRED — Direct add to cart with Fly-to-Cart Animation
  const handleAddToCart = (item: StoreItem, e?: React.MouseEvent) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.ItemName === item.ItemName);
      if (existing) {
        return prev.map((c) =>
          c.ItemName === item.ItemName ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });

    // Fly animation to Cart target button
    const cartTarget =
      document.getElementById("desktop-cart-button") ||
      document.getElementById("mobile-cart-button");

    if (cartTarget) {
      const targetRect = cartTarget.getBoundingClientRect();
      const endX = targetRect.left + targetRect.width / 2;
      const endY = targetRect.top + targetRect.height / 2;

      let startX = window.innerWidth / 2;
      let startY = window.innerHeight / 2;

      // Extract coordinates from clicked button or click position
      if (e) {
        const currentBtn = (e.currentTarget || e.target) as HTMLElement | null;
        if (currentBtn && typeof currentBtn.getBoundingClientRect === "function") {
          const btnRect = currentBtn.getBoundingClientRect();
          startX = btnRect.left + btnRect.width / 2;
          startY = btnRect.top + btnRect.height / 2;
        } else if (e.clientX && e.clientY) {
          startX = e.clientX;
          startY = e.clientY;
        }
      }

      const dx = endX - startX;
      const dy = endY - startY;

      const rawImg = item.FileUrl || item.ImageUrl;
      const imgSrc = rawImg
        ? (rawImg.startsWith("data:") || rawImg.startsWith("http")
            ? rawImg
            : `data:image/jpeg;base64,${rawImg}`)
        : null;

      const flyingId = Date.now() + Math.random();
      const newFlyingItem: FlyingCartItem = {
        id: flyingId,
        startX,
        startY,
        dx,
        dy,
        imageUrl: imgSrc,
        name: item.ItemName,
      };

      setFlyingItems((prev) => [...prev, newFlyingItem]);

      // When the flying item lands in the cart (820ms)
      setTimeout(() => {
        setFlyingItems((prev) => prev.filter((fi) => fi.id !== flyingId));
        setIsCartBouncing(true);
        setTimeout(() => setIsCartBouncing(false), 600);
      }, 820);
    } else {
      setIsCartBouncing(true);
      setTimeout(() => setIsCartBouncing(false), 600);
    }

    showToast(`Added ${item.ItemName}`, "✓ In Cart", "🛍️");
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
    setWishlist((prev) => {
      const exists = prev.includes(name);
      if (exists) {
        showToast(name, "Removed from Wishlist", "🤍");
        return prev.filter((n) => n !== name);
      } else {
        showToast(name, "Saved to Wishlist", "❤️");
        return [...prev, name];
      }
    });
  };

  const handleWishlistClick = () => {
    setCurrentView("wishlist");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearWishlist = () => {
    if (window.confirm("Clear all items from wishlist?")) {
      setWishlist([]);
      showToast("Wishlist cleared", "", "🧹");
    }
  };

  const handleCategorySelect = (id: string) => {
    if (activeCategory.toLowerCase() === id.toLowerCase() && currentView === "products") {
      setActiveCategory("all");
    } else {
      setActiveCategory(id);
      setCurrentView("products");
    }
    setSearchQuery("");
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHomeClick = () => {
    if (storeCode !== "") {
      setStoreCode("");
    }
    setActiveCategory("all");
    setSearchQuery("");
    setSelectedProduct(null);
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogoClick = () => {
    if (storeCode !== "") {
      setStoreCode("");
    }
    setActiveCategory("all");
    setSearchQuery("");
    setSelectedProduct(null);
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShopAllClick = () => {
    if (storeCode !== "") {
      setStoreCode("");
    }
    setActiveCategory("all");
    setSelectedProduct(null);
    setCurrentView("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (v: string) => {
    setSearchQuery(v);
  };

  const handleSearchCancel = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setSelectedProduct(null);
    setCurrentView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (v: string) => {
    const q = v.trim();
    setSearchQuery(q);
    if (q) {
      setActiveCategory("all");
      setSelectedProduct(null);
      setCurrentView("products");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSearchCancel();
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
      try {
        navigator.clipboard.writeText(window.location.href);
        showToast("Product link copied!", "Ready to share", "🔗");
      } catch {
        showToast("Product link ready to share", "", "🔗");
      }
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
            storeName={cleanStoreName}
            storeImage={storeData.StoreImage}
            cartCount={cartCount}
            wishlistCount={wishlist.length}
            searchQuery={searchQuery}
            categories={storeData.DropDownList}
            items={storeData.ItemList}
            isCartBouncing={isCartBouncing}
            user={null}
            deliveryLocation={deliveryLocation}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            onSearchCancel={handleSearchCancel}
            onCartClick={handleCartClick}
            onWishlistClick={handleWishlistClick}
            onProductClick={handleProductClick}
            onCategoryClick={handleCategorySelect}
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
            storeName={cleanStoreName}
            onCategorySelect={handleCategorySelect}
            onAllMenuClick={() => setDrawerOpen(true)}
            onHomeClick={handleHomeClick}
          />
        </>
      )}

      {currentView === "home" && (
        <HomePage
          items={storeData.ItemList}
          categories={storeData.DropDownList}
          banners={storeData.CarouselImages || undefined}
          storeName={cleanStoreName}
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
          allItems={storeData.ItemList}
          categories={storeData.DropDownList}
          activeCategory={activeCategory}
          categoryName={currentCategoryName}
          searchQuery={searchQuery}
          wishlist={wishlist}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          onProductClick={handleProductClick}
          onQuickView={(item) => setQuickViewProduct(item)}
          onCategorySelect={handleCategorySelect}
          onSearchChange={handleSearchChange}
          onSearchCancel={handleSearchCancel}
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
          onOpenPolicy={(pol) => handleOpenPolicy(pol, false)}
        />
      )}

      {currentView === "policy" && (
        <PolicyPage
          initialPolicy={activePolicy}
          storeName={cleanStoreName}
          storePhone={storeData.PhoneNumber || "+91 98765 43210"}
          onBackToHome={handleHomeClick}
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

      {/* ═══ Global Footer with Mandatory Compliance Policies ═══ */}
      <Footer
        storeName={cleanStoreName}
        storePhone={storeData.PhoneNumber || "+91 98765 43210"}
        onOpenPolicy={handleOpenPolicy}
        onHomeClick={handleHomeClick}
      />

      <SideDrawer
        isOpen={drawerOpen}
        categories={storeData.DropDownList}
        wishlistCount={wishlist.length}
        cartCount={cartCount}
        user={null}
        onClose={() => setDrawerOpen(false)}
        onCategorySelect={handleCategorySelect}
        onSignInClick={() => showToast("Guest Shopping Active", "No login required", "✨")}
        onWishlistClick={handleWishlistClick}
        onOrdersClick={() => showToast("Track Orders", "Available after checkout", "📦")}
        onAddressesClick={() => {
          setDrawerOpen(false);
          setLocationModalOpen(true);
        }}
        onNotificationsClick={() => showToast("Notifications", "All systems nominal", "🔔")}
        onSettingsClick={() => showToast("Preferences Saved", "Default settings active", "⚙️")}
        onLogout={() => {}}
      />

      <LocationModal
        isOpen={locationModalOpen}
        currentLocation={deliveryLocation}
        onClose={() => setLocationModalOpen(false)}
        onLocationChange={handleLocationChange}
      />

      <QuickViewModal
        item={quickViewProduct}
        isWishlisted={
          quickViewProduct ? wishlist.includes(quickViewProduct.ItemName) : false
        }
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(item, e) => handleAddToCart(item, e)}
        onToggleWishlist={handleToggleWishlist}
        onViewFullDetails={handleProductClick}
      />

      <PolicyModal
        isOpen={policyModalOpen}
        activePolicy={activePolicy}
        onClose={() => setPolicyModalOpen(false)}
        onSelectPolicy={setActivePolicy}
        storeName={cleanStoreName}
        storePhone={storeData.PhoneNumber || "+91 98765 43210"}
      />

      {/* ═══ Fly-to-Cart Animated Product Clones ═══ */}
      {flyingItems.map((fi) => (
        <div
          key={fi.id}
          className="fixed pointer-events-none z-[9999] animate-flying-cart"
          style={{
            left: `${fi.startX - 26}px`,
            top: `${fi.startY - 26}px`,
            "--fly-dx": `${fi.dx}px`,
            "--fly-dy": `${fi.dy}px`,
          } as React.CSSProperties}
        >
          <div className="h-13 w-13 rounded-2xl bg-white border-2 border-[#384a35] shadow-2xl p-1.5 flex items-center justify-center overflow-hidden ring-4 ring-[#c89b3c]/30">
            {fi.imageUrl ? (
              <img src={fi.imageUrl} alt={fi.name} className="h-full w-full object-contain" />
            ) : (
              <span className="text-xl">🛍️</span>
            )}
          </div>
        </div>
      ))}

      {/* ═══ Floating Toast Notification ═══ */}
      {activeToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] bg-[#243122]/95 backdrop-blur-md text-[#faf7f2] px-4 py-2.5 rounded-full shadow-2xl border border-[#d8cfbf]/40 flex items-center gap-2.5 animate-page-entrance text-xs sm:text-sm font-semibold pointer-events-none max-w-[90vw]">
          {activeToast.icon ? (
            <span className="text-sm shrink-0">{activeToast.icon}</span>
          ) : (
            <span className="h-2 w-2 rounded-full bg-[#c89b3c] animate-ping shrink-0" />
          )}
          <span className="truncate max-w-[180px] sm:max-w-[320px]">{activeToast.title}</span>
          {activeToast.badge && (
            <span className="text-xs text-[#d8c29d] font-bold shrink-0">{activeToast.badge}</span>
          )}
        </div>
      )}

      {/* ═══ Smooth Back to Top ═══ */}
      <BackToTop />
    </div>
  );
}