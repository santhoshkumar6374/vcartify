import { useEffect, useRef } from "react";
import {
  User,
  Package,
  Heart,
  MapPin,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  user: { name: string; mobile: string };
  onClose: () => void;
  onOrdersClick: () => void;
  onWishlistClick: () => void;
  onAddressesClick: () => void;
  onNotificationsClick: () => void;
  onSettingsClick: () => void;
  onLogout: () => void;
}

export function ProfileDropdown({
  isOpen,
  user,
  onClose,
  onOrdersClick,
  onWishlistClick,
  onAddressesClick,
  onNotificationsClick,
  onSettingsClick,
  onLogout,
}: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      // Delay to prevent immediate close from opening click
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
      }, 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    {
      icon: <Package size={16} strokeWidth={2} />,
      label: "My Orders",
      onClick: () => {
        onOrdersClick();
        onClose();
      },
    },
    {
      icon: <Heart size={16} strokeWidth={2} />,
      label: "My Wishlist",
      onClick: () => {
        onWishlistClick();
        onClose();
      },
    },
    {
      icon: <MapPin size={16} strokeWidth={2} />,
      label: "Saved Addresses",
      onClick: () => {
        onAddressesClick();
        onClose();
      },
    },
    {
      icon: <Bell size={16} strokeWidth={2} />,
      label: "Notifications",
      onClick: () => {
        onNotificationsClick();
        onClose();
      },
    },
    {
      icon: <Settings size={16} strokeWidth={2} />,
      label: "Account Settings",
      onClick: () => {
        onSettingsClick();
        onClose();
      },
    },
  ];

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* ═══ User Info Header ═══ */}
      <div className="bg-gradient-to-br from-gray-900 to-black text-white p-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="h-12 w-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Name & Mobile */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/70 font-semibold uppercase tracking-wider">
              Welcome back
            </p>
            <p className="text-base font-bold truncate">{user.name}</p>
            <p className="text-xs text-white/80 font-medium">
              +91 {user.mobile}
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Menu Items ═══ */}
      <div className="py-2">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.onClick}
            className="w-full flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                {item.icon}
              </span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {item.label}
              </span>
            </div>
            <ChevronRight
              size={14}
              strokeWidth={2}
              className="text-gray-400 group-hover:text-gray-900 transition-colors"
            />
          </button>
        ))}
      </div>

      {/* ═══ Divider ═══ */}
      <div className="h-px bg-gray-200 mx-4" />

      {/* ═══ Logout Button ═══ */}
      <div className="p-2">
        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors group"
        >
          <LogOut
            size={16}
            strokeWidth={2}
            className="text-red-500 group-hover:text-red-600"
          />
          <span className="text-sm font-semibold text-red-500 group-hover:text-red-600">
            Sign out
          </span>
        </button>
      </div>
    </div>
  );
}