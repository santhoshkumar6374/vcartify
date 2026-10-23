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
    (c) =>
      c &&
      c.Text &&
      c.Text.toLowerCase() !== "all" &&
      !c.Text.toLowerCase().includes("trader")
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
        className={`fixed top-0 left-0 h-full w-[85%] max-w-[380px] bg-[#faf7f2] shadow-2xl z-[70] transition-transform duration-300 ease-out flex flex-col border-r border-[#e5ddd0] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-label="Navigation menu"
      >
        {/* Header (Deep Olive) */}
        <div className="bg-[#243122] text-[#faf7f2] flex items-center justify-between px-5 py-5 shrink-0 shadow-md border-b border-[#384a35]">
          <button
            onClick={() => {
              onSignInClick();
              onClose();
            }}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity flex-1 min-w-0"
          >
            <div className="h-11 w-11 rounded-full bg-[#384a35] flex items-center justify-center border border-[#d8c29d]/40 text-[#faf7f2] shrink-0">
              <User size={22} strokeWidth={2} />
            </div>
            <div className="text-left min-w-0">
              {user ? (
                <>
                  <p className="text-xs text-[#faf7f2]/70 font-medium">
                    Welcome back,
                  </p>
                  <p className="text-lg font-serif font-bold tracking-tight truncate text-[#faf7f2]">
                    {user.name}
                  </p>
                </>
              ) : (
                <span className="text-lg font-serif font-bold tracking-tight text-[#faf7f2]">
                  Welcome Guest
                </span>
              )}
            </div>
          </button>

          <button
            onClick={onClose}
            aria-label="Close menu"
            className="h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors shrink-0 text-[#faf7f2]"
          >
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable Menu Body */}
        <div className="flex-1 overflow-y-auto text-[#243122] bg-[#faf7f2]">
          {sections.map((section, sectionIdx) => (
            <div
              key={section.title}
              className={sectionIdx > 0 ? "border-t border-[#ede5d7]" : ""}
            >
              {/* Section title */}
              <h3 className="px-5 pt-6 pb-2.5 text-xs font-bold tracking-[0.18em] uppercase text-[#738271]">
                {section.title}
              </h3>

              {/* Section items */}
              <ul className="space-y-0.5 px-2">
                {section.items.map((item, itemIdx) => (
                  <li key={`${item.label}-${itemIdx}`}>
                    <button
                      onClick={item.onClick}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-left text-sm transition-all ${
                        item.isActive
                          ? "bg-[#384a35] text-[#faf7f2] font-semibold shadow-sm"
                          : "text-[#243122] font-medium hover:bg-[#ede5d7] hover:text-[#243122]"
                      }`}
                    >
                      {/* Icon */}
                      {item.icon && (
                        <span
                          className={
                            item.isActive ? "text-[#faf7f2]" : "text-[#546850]"
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
                          className={`min-w-[22px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center ${
                            item.isActive
                              ? "bg-[#faf7f2] text-[#243122]"
                              : "bg-[#243122] text-[#faf7f2]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Chevron */}
                      {item.hasChevron && (
                        <ChevronRight
                          size={16}
                          strokeWidth={2}
                          className={`shrink-0 ${
                            item.isActive ? "text-[#faf7f2]/80" : "text-[#8a9987]"
                          }`}
                        />
                      )}
                    </button>
                  </li>
                ))}

                {/* "See all" link */}
                {section.showSeeAll && (
                  <li>
                    <button className="w-full flex items-center gap-2 px-3.5 py-3 rounded-lg text-left text-sm text-[#384a35] font-semibold hover:bg-[#ede5d7] transition-colors">
                      <span>See all categories</span>
                      <ChevronDown
                        size={16}
                        strokeWidth={2}
                        className="text-[#384a35]"
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
        <div className="border-t border-[#e5ddd0] bg-[#ede5d7] px-5 py-4 shrink-0">
          <button className="flex items-center justify-between w-full hover:opacity-85 transition-opacity">
            <div className="flex items-center gap-3">
              <span className="text-xl">🇮🇳</span>
              <span className="text-sm font-semibold text-[#243122] tracking-tight">
                India | English
              </span>
            </div>
            <ChevronRight size={18} strokeWidth={2} className="text-[#384a35]" />
          </button>
        </div>
      </aside>
    </>
  );
}