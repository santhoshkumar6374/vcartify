import { Search, MapPin, ChevronDown, ShoppingCart, Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { ProfileDropdown } from "@/components/layout/ProfileDropdown";

interface HeaderProps {
  storeName?: string;
  storeImage?: string;
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  categories?: Array<{ Value: number; Text: string }>;
  user?: { name: string; mobile: string } | null;
  deliveryLocation?: { city: string; pincode: string };
  onSearchChange: (v: string) => void;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onProfileClick: () => void;
  onOrdersClick?: () => void;
  onAddressesClick?: () => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  onLogoClick: () => void;
  onMobileMenuClick?: () => void;
  onLocationClick?: () => void;
}

export function Header({
  storeName = "vCartify",
  storeImage,
  cartCount,
  wishlistCount,
  searchQuery,
  categories = [],
  user,
  deliveryLocation = { city: "Tirupur", pincode: "641604" },
  onSearchChange,
  onCartClick,
  onWishlistClick,
  onProfileClick,
  onOrdersClick,
  onAddressesClick,
  onNotificationsClick,
  onSettingsClick,
  onLogout,
  onLogoClick,
  onMobileMenuClick,
  onLocationClick,
}: HeaderProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const logoUrl = storeImage
    ? `data:image/png;base64,${storeImage}`
    : undefined;

  const hasBackendLogo = Boolean(logoUrl);

  const handleProfileButtonClick = () => {
    if (user) {
      setShowProfileDropdown(!showProfileDropdown);
    } else {
      onProfileClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 shadow-sm border-b border-gray-200">
      <div className="bg-white text-black">
        <div className="mx-auto max-w-[1500px] px-2 sm:px-3 lg:px-4">

          {/* Desktop Row */}
          <div className="hidden sm:flex items-center h-[60px] gap-2 lg:gap-3">
            {/* Logo */}
            <button
              onClick={onLogoClick}
              className="shrink-0 p-1.5 rounded-lg border border-transparent hover:border-black transition-colors"
              aria-label="Home"
            >
              {hasBackendLogo ? (
                <img
                  src={logoUrl}
                  alt={storeName}
                  className="h-9 lg:h-10 w-auto object-contain"
                />
              ) : (
                <div className="flex items-center gap-1.5">
                  <Logo size="sm" variant="image-only" />
                  <span className="text-xl lg:text-2xl font-bold text-black">
                    {storeName}
                  </span>
                </div>
              )}
            </button>

            {/* ✨ Deliver to — NOW CLICKABLE! */}
            <button
              onClick={onLocationClick}
              className="hidden xl:flex items-center gap-1.5 h-11 px-2 rounded-lg border border-transparent hover:border-black hover:bg-gray-50 transition-all group"
            >
              <MapPin size={18} className="text-black shrink-0 mt-3 group-hover:text-blue-600 transition-colors" strokeWidth={2.5} />
              <div className="flex flex-col items-start leading-tight text-left">
                <span className="text-[11px] text-gray-600 font-semibold">
                  Delivering to {deliveryLocation.city}
                </span>
                <span className="text-sm font-black text-black flex items-center gap-0.5">
                  {deliveryLocation.pincode}
                  <ChevronDown size={12} className="text-gray-600" strokeWidth={2.5} />
                </span>
              </div>
            </button>

            {/* Search Bar */}
            <div className="flex-1 flex items-stretch h-11 rounded-lg overflow-hidden shadow-sm min-w-0 border-2 border-gray-300 focus-within:border-black transition-colors bg-white">
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="h-full flex items-center gap-1 px-2 lg:px-3 bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold border-r border-gray-300 transition-colors"
                >
                  <span className="max-w-[50px] lg:max-w-[100px] truncate">
                    {selectedCategory}
                  </span>
                  <ChevronDown size={14} className="shrink-0" />
                </button>

                {showCategoryDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowCategoryDropdown(false)}
                    />
                    <div className="absolute top-full left-0 mt-1 w-56 max-h-80 overflow-y-auto bg-white text-black rounded-lg shadow-2xl border-2 border-black z-40">
                      <button
                        onClick={() => {
                          setSelectedCategory("All");
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 font-semibold ${
                          selectedCategory === "All"
                            ? "bg-black text-white font-black"
                            : ""
                        }`}
                      >
                        All Departments
                      </button>
                      {categories
                        .filter((c) => c.Text.toLowerCase() !== "all")
                        .map((cat) => (
                          <button
                            key={cat.Value}
                            onClick={() => {
                              setSelectedCategory(cat.Text);
                              setShowCategoryDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 font-semibold ${
                              selectedCategory === cat.Text
                                ? "bg-black text-white font-black"
                                : ""
                            }`}
                          >
                            {cat.Text}
                          </button>
                        ))}
                    </div>
                  </>
                )}
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={`Search ${storeName}.in`}
                className="flex-1 min-w-0 px-3 text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none bg-white"
              />

              <button
                aria-label="Search"
                className="shrink-0 w-12 lg:w-14 bg-black hover:bg-gray-800 flex items-center justify-center transition-colors"
              >
                <Search size={20} className="text-white" strokeWidth={2.5} />
              </button>
            </div>

            {/* Wishlist button (Desktop) */}
            <button
              onClick={onWishlistClick}
              aria-label={`Wishlist, ${wishlistCount} items`}
              className="hidden md:flex items-center h-11 px-2 rounded-lg border border-transparent hover:border-black transition-colors text-black relative"
            >
              <div className="relative">
                <Heart
                  size={24}
                  strokeWidth={2}
                  className="text-black"
                  fill={wishlistCount > 0 ? "black" : "none"}
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center leading-none border border-white">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </button>

            {/* Sign in / User with Dropdown */}
            <div className="hidden md:block relative">
              <button
                onClick={handleProfileButtonClick}
                className="flex flex-col items-start justify-center h-11 px-2 rounded-lg border border-transparent hover:border-black transition-colors leading-tight text-black"
              >
                <span className="text-[11px] text-gray-600 whitespace-nowrap font-semibold">
                  {user ? "Hello," : "Hello, sign in"}
                </span>
                <span className="text-sm font-black text-black flex items-center gap-0.5 whitespace-nowrap">
                  {user ? user.name.split(" ")[0] : "Account & Lists"}
                  <ChevronDown
                    size={11}
                    className={`transition-transform ${
                      showProfileDropdown ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              {user && (
                <ProfileDropdown
                  isOpen={showProfileDropdown}
                  user={user}
                  onClose={() => setShowProfileDropdown(false)}
                  onOrdersClick={onOrdersClick || (() => {})}
                  onWishlistClick={onWishlistClick}
                  onAddressesClick={onAddressesClick || (() => {})}
                  onNotificationsClick={onNotificationsClick || (() => {})}
                  onSettingsClick={onSettingsClick || (() => {})}
                  onLogout={onLogout || (() => {})}
                />
              )}
            </div>

            {/* Cart */}
            <button
              onClick={onCartClick}
              aria-label={`Cart, ${cartCount} items`}
              className="flex items-end h-11 px-2 rounded-lg border border-transparent hover:border-black transition-colors text-black"
            >
              <div className="relative flex items-end">
                <ShoppingCart size={28} className="text-black" strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 min-w-[20px] h-5 px-1 rounded-full bg-black text-white text-xs font-black flex items-center justify-center leading-none border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline text-sm font-black ml-1 mb-0.5 text-black">
                Cart
              </span>
            </button>
          </div>

          {/* Mobile Row */}
          <div className="flex sm:hidden items-center justify-between h-14 gap-2">
            <button
              onClick={onMobileMenuClick}
              aria-label="Menu"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={24} strokeWidth={2.5} className="text-black" />
            </button>

            <button
              onClick={onLogoClick}
              className="flex-1 flex justify-center"
              aria-label="Home"
            >
              {hasBackendLogo ? (
                <img
                  src={logoUrl}
                  alt={storeName}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <div className="flex items-center gap-1">
                  <Logo size="sm" variant="image-only" />
                  <span className="text-lg font-bold text-black">
                    {storeName}
                  </span>
                </div>
              )}
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                aria-label="Search"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {showMobileSearch ? (
                  <X size={22} strokeWidth={2.5} className="text-black" />
                ) : (
                  <Search size={22} strokeWidth={2.5} className="text-black" />
                )}
              </button>

              <button
                onClick={onWishlistClick}
                aria-label={`Wishlist, ${wishlistCount} items`}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Heart
                  size={22}
                  strokeWidth={2}
                  className="text-black"
                  fill={wishlistCount > 0 ? "black" : "none"}
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-4 px-1 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center leading-none border border-white">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={onCartClick}
                aria-label={`Cart, ${cartCount} items`}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart size={22} strokeWidth={2} className="text-black" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-4 px-1 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center leading-none border border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ✨ Mobile Location Bar (below search) */}
          <button
            onClick={onLocationClick}
            className="sm:hidden w-full flex items-center gap-2 py-2 border-t border-gray-100 hover:bg-gray-50 transition-colors px-1"
          >
            <MapPin size={16} className="text-blue-600 shrink-0" strokeWidth={2.5} />
            <span className="text-xs text-gray-700 font-semibold">
              Deliver to {deliveryLocation.city} <span className="font-bold">{deliveryLocation.pincode}</span>
            </span>
            <ChevronDown size={14} className="text-gray-600 ml-auto" strokeWidth={2.5} />
          </button>

          {/* Mobile Search Bar */}
          {showMobileSearch && (
            <div className="sm:hidden pb-3 pt-1">
              <div className="flex items-stretch h-10 rounded-lg overflow-hidden border-2 border-black bg-white">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search products..."
                  autoFocus
                  className="flex-1 min-w-0 px-3 text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none bg-white"
                />
                <button
                  aria-label="Search"
                  className="shrink-0 w-12 bg-black flex items-center justify-center"
                >
                  <Search size={18} className="text-white" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}