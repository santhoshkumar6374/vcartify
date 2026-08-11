import { useEffect } from "react";
import {
  X,
  ChevronRight,
  User,
  ChevronDown,
  Heart,
  Package,
  Settings,
  MapPin,
  Bell,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { StoreCategory } from "@/types/store";

interface DrawerSection {
  title: string;
  items: DrawerItem[];
  showSeeAll?: boolean;
}

interface DrawerItem {
  label: string;
  icon?: React.ReactNode;
  hasChevron?: boolean;
  isActive?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

interface Props {
  isOpen: boolean;
  categories: StoreCategory[];
  wishlistCount?: number;
  cartCount?: number;
  user?: { name: string; mobile: string } | null;
  onClose: () => void;
  onCategorySelect: (categoryName: string) => void;
  onSignInClick: () => void;
  onWishlistClick?: () => void;
  onOrdersClick?: () => void;
  onAddressesClick?: () => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
}

export function SideDrawer({
  isOpen,
  categories,
  wishlistCount = 0,
  user,
  onClose,
  onCategorySelect,
  onSignInClick,
  onWishlistClick,
  onOrdersClick,
  onAddressesClick,
  onNotificationsClick,
  onSettingsClick,
  onLogout,
}: Props) {
  // Close on Escape + lock body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const realCategories = categories.filter(
    (c) => c.Text.toLowerCase() !== "all"
  );

  // Help & Support items depend on login state
  const helpItems: DrawerItem[] = [
    {
      label: "Customer Service",
      icon: <HelpCircle size={18} strokeWidth={2.5} />,
      hasChevron: true,
    },
  ];

  if (user) {
    helpItems.push({
      label: "Sign out",
      icon: <LogOut size={18} strokeWidth={2.5} />,
      onClick: () => {
        onLogout?.();
      },
    });
  } else {
    helpItems.push({
      label: "Sign in",
      icon: <User size={18} strokeWidth={2.5} />,
      onClick: () => {
        onSignInClick();
        onClose();
      },
    });
  }

  const sections: DrawerSection[] = [
    // ─── Trending ───────────────────────────────
    {
      title: "Trending",
      items: [
        {
          label: "Bestsellers",
          isActive: true,
          onClick: () => {
            onCategorySelect("all");
            onClose();
          },
        },
        {
          label: "New Releases",
          onClick: () => {
            onCategorySelect("all");
            onClose();
          },
        },
        {
          label: "Today's Deals",
          onClick: () => {
            onCategorySelect("all");
            onClose();
          },
        },
      ],
    },

    // ─── My Account ─────────────────────────────
    {
      title: "My Account",
      items: [
        {
          label: "My Wishlist",
          icon: <Heart size={18} strokeWidth={2.5} />,
          hasChevron: true,
          badge: wishlistCount > 0 ? wishlistCount : undefined,
          onClick: () => {
            onWishlistClick?.();
            onClose();
          },
        },
        {
          label: "My Orders",
          icon: <Package size={18} strokeWidth={2.5} />,
          hasChevron: true,
          onClick: () => {
            onOrdersClick?.();
            onClose();
          },
        },
        {
          label: "Saved Addresses",
          icon: <MapPin size={18} strokeWidth={2.5} />,
          hasChevron: true,
          onClick: () => {
            onAddressesClick?.();
            onClose();
          },
        },
        {
          label: "Notifications",
          icon: <Bell size={18} strokeWidth={2.5} />,
          hasChevron: true,
          onClick: () => {
            onNotificationsClick?.();
            onClose();
          },
        },
        {
          label: "Account Settings",
          icon: <Settings size={18} strokeWidth={2.5} />,
          hasChevron: true,
          onClick: () => {
            onSettingsClick?.();
            onClose();
          },
        },
      ],
    },

    // ─── Shop by Category ───────────────────────
    {
      title: "Shop by Category",
      showSeeAll: true,
      items: realCategories.slice(0, 5).map((cat) => ({
        label: cat.Text,
        hasChevron: true,
        onClick: () => {
          onCategorySelect(cat.Text.toLowerCase());
          onClose();
        },
      })),
    },

    // ─── Help & Support ─────────────────────────
    {
      title: "Help & Support",
      items: helpItems,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[380px] bg-white shadow-2xl z-[70] transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-label="Navigation menu"
      >
        {/* Header (BLACK) */}
        <div className="bg-black text-white flex items-center justify-between px-5 py-5 shrink-0 shadow-lg">
          <button
            onClick={() => {
              onSignInClick();
              onClose();
            }}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity flex-1 min-w-0"
          >
            <div className="h-11 w-11 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/40 shrink-0">
              <User size={22} strokeWidth={2.5} />
            </div>
            <div className="text-left min-w-0">
              {user ? (
                <>
                  <p className="text-xs text-white/70 font-semibold">
                    Welcome back,
                  </p>
                  <p className="text-lg font-black tracking-tight truncate">
                    {user.name}
                  </p>
                </>
              ) : (
                <span className="text-xl font-black tracking-tight">
                  Hello, sign in
                </span>
              )}
            </div>
          </button>

          <button
            onClick={onClose}
            aria-label="Close menu"
            className="h-10 w-10 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors shrink-0"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Menu Body */}
        <div className="flex-1 overflow-y-auto text-black bg-white">
          {sections.map((section, sectionIdx) => (
            <div
              key={section.title}
              className={sectionIdx > 0 ? "border-t-2 border-gray-200" : ""}
            >
              {/* Section title */}
              <h3 className="px-5 pt-6 pb-3 text-xl font-black text-black tracking-tight">
                {section.title}
              </h3>

              {/* Section items */}
              <ul>
                {section.items.map((item, itemIdx) => (
                  <li key={`${item.label}-${itemIdx}`}>
                    <button
                      onClick={item.onClick}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 text-left text-base transition-colors ${
                        item.isActive
                          ? "bg-black text-white font-black"
                          : "text-black font-semibold hover:bg-gray-100"
                      }`}
                    >
                      {/* Icon */}
                      {item.icon && (
                        <span
                          className={
                            item.isActive ? "text-white" : "text-black"
                          }
                        >
                          {item.icon}
                        </span>
                      )}

                      {/* Label */}
                      <span className="flex-1">{item.label}</span>

                      {/* Badge */}
                      {item.badge !== undefined && (
                        <span
                          className={`min-w-[24px] h-6 px-2 rounded-full text-xs font-black flex items-center justify-center ${
                            item.isActive
                              ? "bg-white text-black"
                              : "bg-black text-white"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Chevron */}
                      {item.hasChevron && (
                        <ChevronRight
                          size={18}
                          strokeWidth={2.5}
                          className={`shrink-0 ${
                            item.isActive ? "text-white" : "text-black"
                          }`}
                        />
                      )}
                    </button>
                  </li>
                ))}

                {/* "See all" link */}
                {section.showSeeAll && (
                  <li>
                    <button className="w-full flex items-center gap-2 px-5 py-3.5 text-left text-base text-black font-bold hover:bg-gray-100 transition-colors">
                      <span>See all categories</span>
                      <ChevronDown
                        size={18}
                        strokeWidth={2.5}
                        className="text-black"
                      />
                    </button>
                  </li>
                )}
              </ul>
            </div>
          ))}

          {/* Footer padding */}
          <div className="h-8" />
        </div>

        {/* Bottom Sticky Language/Country Bar */}
        <div className="border-t-2 border-black bg-gray-100 px-5 py-4 shrink-0">
          <button className="flex items-center justify-between w-full hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇮🇳</span>
              <span className="text-base font-black text-black tracking-tight">
                India | English
              </span>
            </div>
            <ChevronRight size={20} strokeWidth={2.5} className="text-black" />
          </button>
        </div>
      </aside>
    </>
  );
}