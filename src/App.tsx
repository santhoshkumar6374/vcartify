import { useState, useEffect, useMemo, useRef, JSX } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Headphones,
  MapPin,
  Phone,
  Mail,
  Minus,
  Plus,
  Trash2,
  Package,
  Gift,
  Zap,
  TrendingUp,
  Award,
  ImageOff,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  LogOut,
  // Category icons
  Smartphone,
  Shirt,
  Home as HomeIcon,
  Dumbbell,
  Sparkles,
  BookOpen,
  PenTool,
  Palette,
  Tag,
  Baby,
  Utensils,
  Car,
  Watch,
  Globe,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import { API_ROUTES } from "./constants/apiRoutes";
import { apiFetch } from "./utils/apiFetch";
import type { ApiEnvelope, StoreResponse, StoreItem } from "./types/store";

import { getStoreCode } from "./config/storeConfig";

import {
  CheckoutFormModal,
  type PlacedOrder,
} from "./components/CheckoutFormModal";
import {
  getCustomerSession,
  clearCustomerSession,
  type CustomerSession,
} from "./api/mockCustomerApi";

const STORE_CODE = getStoreCode();

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Verified Buyer",
    text: "Amazing quality and super fast delivery! This is now my go-to online store.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80&h=80",
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "Loyal Customer",
    text: "The product range is fantastic and the customer service is top-notch.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80",
  },
  {
    id: 3,
    name: "Anita Desai",
    role: "Verified Buyer",
    text: "Great prices, authentic products, and beautiful packaging. Highly recommended!",
    rating: 4,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80&h=80",
  },
];

// ---- Category icon resolution -----------------------------------------
// Instead of a fixed emoji per index, we match the category *name* coming
// back from the API against a keyword table and pick a real Lucide icon +
// gradient for it. Anything that doesn't match falls back to a rotating
// neutral icon so it still looks intentional rather than "dummy".
interface CategoryVisual {
  icon: LucideIcon;
  color: string;
}

interface OrderConfirmation {
  orderId: string;
  total: number;
  itemCount: number;
  name: string;
  mobile: string;
  address: string;
}

const CATEGORY_ICON_RULES: {
  keywords: string[];
  icon: LucideIcon;
  color: string;
}[] = [
  {
    keywords: ["electronic", "mobile", "phone", "gadget", "laptop", "computer"],
    icon: Smartphone,
    color: "from-blue-500 to-blue-600",
  },
  {
    keywords: ["fashion", "cloth", "apparel", "wear", "garment", "textile"],
    icon: Shirt,
    color: "from-pink-500 to-rose-500",
  },
  {
    keywords: ["home", "furniture", "decor", "kitchen", "appliance"],
    icon: HomeIcon,
    color: "from-amber-500 to-orange-500",
  },
  {
    keywords: ["sport", "fitness", "gym", "outdoor"],
    icon: Dumbbell,
    color: "from-green-500 to-emerald-500",
  },
  {
    keywords: ["beauty", "cosmetic", "makeup", "skincare", "personal care"],
    icon: Sparkles,
    color: "from-purple-500 to-fuchsia-500",
  },
  {
    keywords: ["book", "education", "stationery", "note"],
    icon: BookOpen,
    color: "from-indigo-500 to-blue-500",
  },
  {
    keywords: [
      "pen",
      "writing",
      "office",
      "school",
      "camlin",
      "cam ",
      "stationeries",
      "map",
    ],
    icon: PenTool,
    color: "from-cyan-500 to-sky-500",
  },
  {
    keywords: ["art", "craft", "hobby", "paint", "colour", "color"],
    icon: Palette,
    color: "from-fuchsia-500 to-purple-600",
  },
  {
    keywords: ["baby", "kid", "toy", "infant"],
    icon: Baby,
    color: "from-yellow-500 to-amber-500",
  },
  {
    keywords: ["food", "grocery", "kitchenware", "cook"],
    icon: Utensils,
    color: "from-red-500 to-orange-600",
  },
  {
    keywords: ["auto", "car", "vehicle", "bike"],
    icon: Car,
    color: "from-slate-600 to-gray-700",
  },
  {
    keywords: ["watch", "jewel", "accessor"],
    icon: Watch,
    color: "from-teal-500 to-cyan-600",
  },
  {
    keywords: ["yoga", "fitness mat"],
    icon: Dumbbell,
    color: "from-green-500 to-emerald-500",
  },
  { keywords: ["paper"], icon: BookOpen, color: "from-slate-500 to-gray-600" },
];

const FALLBACK_CATEGORY_VISUALS: CategoryVisual[] = [
  { icon: Tag, color: "from-blue-500 to-blue-600" },
  { icon: Tag, color: "from-pink-500 to-rose-500" },
  { icon: Tag, color: "from-amber-500 to-orange-500" },
  { icon: Tag, color: "from-green-500 to-emerald-500" },
  { icon: Tag, color: "from-purple-500 to-fuchsia-500" },
  { icon: Tag, color: "from-indigo-500 to-blue-500" },
];

function getCategoryVisual(name: string, idx: number): CategoryVisual {
  const lower = name.toLowerCase();
  const rule = CATEGORY_ICON_RULES.find((r) =>
    r.keywords.some((k) => lower.includes(k)),
  );
  if (rule) return { icon: rule.icon, color: rule.color };
  return FALLBACK_CATEGORY_VISUALS[idx % FALLBACK_CATEGORY_VISUALS.length];
}

// ---- Social brand icons ---------------------------------------------------
// lucide-react dropped brand/logo icons (Facebook, Instagram, Twitter, etc.)
// a while back for trademark reasons, so these are small inline SVGs
// instead. Same call signature as a lucide icon (size + className) so they
// drop into the rest of the code the same way. Website uses lucide's Globe
// since that's a generic (non-brand) icon.
type IconComponent = (props: {
  size?: number;
  className?: string;
}) => JSX.Element;

const FacebookIcon: IconComponent = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
  </svg>
);

const InstagramIcon: IconComponent = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const WhatsappIcon: IconComponent = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.47 14.38c-.29-.15-1.71-.85-1.98-.94-.27-.1-.46-.15-.66.15-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.44-.86-.76-1.44-1.71-1.6-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.66-1.59-.9-2.18-.24-.57-.48-.5-.66-.51h-.56c-.19 0-.51.07-.78.36-.27.29-1.02 1-1.02 2.43 0 1.43 1.04 2.82 1.19 3.01.15.19 2.05 3.13 4.97 4.39.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.11.55-.08 1.71-.7 1.95-1.37.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34Z" />
    <path d="M12 2a10 10 0 0 0-8.62 15.02L2 22l5.12-1.34A10 10 0 1 0 12 2Zm0 18.18a8.17 8.17 0 0 1-4.17-1.14l-.3-.18-3.04.8.81-2.96-.2-.3A8.18 8.18 0 1 1 12 20.18Z" />
  </svg>
);

// ---- Social links --------------------------------------------------------
// Field names match the real StoreResponse payload: FacebookLink,
// InstagramLink, WhatsappLink, WebsiteLink. An icon only renders when its
// link is a non-empty string, so unset ones are simply skipped.
interface SocialLinkDef {
  icon: IconComponent | LucideIcon;
  href: string;
  label: string;
}

interface CartItem extends StoreItem {
  cartId: string;
  qty: number;
}

// ---- Guest cart -----------------------------------------------------------
// There's no login/account system tied to the cart itself. Every visitor
// shares a single, device-local cart stored under one fixed key — no
// per-user scoping, no auth state. IMPORTANT: signing out (see
// customerSession below) must NEVER clear this key — cart and customer
// session are intentionally independent, same as most e-commerce sites.
const CART_STORAGE_KEY = "store_cart_guest";

// ---- Deal of the Day countdown --------------------------------------------
// The deal "resets" every day: the countdown always counts down to the
// next local midnight, then wraps back to ~24:00:00 automatically. Purely
// a display timer — the underlying products/prices don't change with it.
function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
}

// ---- Toast notifications --------------------------------------------------
// Small in-memory toast system (no external dependency) used for anything
// that isn't important enough to interrupt the user with a modal: add to
// cart, wishlist changes, stock warnings, etc.
interface ToastMsg {
  id: number;
  type: "success" | "error" | "info";
  message: string;
}

function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastMsg[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-[80] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border bg-white animate-in slide-in-from-bottom-4 fade-in duration-300 ${
            t.type === "success"
              ? "border-emerald-100"
              : t.type === "error"
                ? "border-red-100"
                : "border-blue-100"
          }`}
        >
          <div
            className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              t.type === "success"
                ? "bg-emerald-100 text-emerald-600"
                : t.type === "error"
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-600"
            }`}
          >
            {t.type === "success" && <CheckCircle2 size={18} />}
            {t.type === "error" && <XCircle size={18} />}
            {t.type === "info" && <Info size={18} />}
          </div>
          <p className="flex-1 text-sm font-medium text-gray-800 pt-1">
            {t.message}
          </p>
          <button
            onClick={() => onDismiss(t.id)}
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={
            i <= Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );
}

// ---- Order confirmation modal --------------------------------------------
// Shown once the mock checkout flow (customer check -> OTP if needed ->
// place order) finishes successfully.
function OrderConfirmationModal({
  order,
  onClose,
}: {
  order: OrderConfirmation | null;
  onClose: () => void;
}) {
  if (!order) return null;
  const firstName = order.name.trim().split(" ")[0] || "there";

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-xl font-bold">Order Placed!</h2>
          <p className="text-white/85 text-sm mt-1">
            Thanks, {firstName} — we've got it from here
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID</span>
              <span className="font-bold text-gray-900">#{order.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Items</span>
              <span className="font-semibold text-gray-900">
                {order.itemCount}
              </span>
            </div>
            <div className="flex justify-between pb-2.5 border-b border-gray-100">
              <span className="text-gray-500">Total Paid</span>
              <span className="font-bold text-gray-900">
                ₹{order.total.toLocaleString()}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            Updates will be sent to +91 {order.mobile}
          </p>
          <button
            onClick={onClose}
            className="w-full mt-5 py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition-colors shadow-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  item,
  categoryName,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: {
  item: StoreItem;
  categoryName: string;
  onAddToCart: (item: StoreItem) => void;
  onToggleWishlist: (name: string) => void;
  isWishlisted: boolean;
}) {
  const hasDiscount = item.MRP > 0 && item.SellingPrice < item.MRP;
  const discountPct = hasDiscount
    ? Math.round((1 - item.SellingPrice / item.MRP) * 100)
    : 0;
  const outOfStock = item.AvailableStock <= 0;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {item.FileUrl ? (
          <img
            src={item.FileUrl}
            alt={item.ItemName}
            className={`w-full h-full object-cover lg:group-hover:scale-110 transition-transform duration-500 ${
              outOfStock ? "grayscale opacity-60" : ""
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ImageOff size={40} className="text-gray-300" />
          </div>
        )}
        {hasDiscount && !outOfStock && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold text-white rounded-md shadow-sm bg-red-500">
            Sale
          </span>
        )}
        {outOfStock && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold text-white rounded-md shadow-sm bg-gray-500">
            Out of Stock
          </span>
        )}
        <button
          onClick={() => onToggleWishlist(item.ItemName)}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-all"
        >
          <Heart
            size={18}
            className={
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
            }
          />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/55 via-black/10 to-transparent lg:translate-y-full lg:group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => onAddToCart(item)}
            disabled={outOfStock}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-colors ${
              outOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            <ShoppingCart size={16} />
            {outOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">
          {categoryName}
        </p>
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
          {item.ItemName}
        </h3>
        {item.Description && (
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">
            {item.Description}
          </p>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{item.SellingPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-gray-400 line-through">
                ₹{item.MRP.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-600 ml-auto">
                -{discountPct}%
              </span>
            </>
          )}
        </div>
        {!outOfStock && item.AvailableStock <= 5 && (
          <p className="text-xs font-semibold text-orange-600 mt-1.5">
            Only {item.AvailableStock} left in stock
          </p>
        )}
      </div>
    </div>
  );
}

// ---- Loading skeleton ------------------------------------------------
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200/80 rounded-md ${className}`} />
  );
}

function StoreSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-gray-900 h-8" />
      <header className="sticky top-0 z-40 bg-white/95 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-9 h-9 rounded-lg lg:hidden shrink-0" />
            <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
            <Skeleton className="h-5 w-24 sm:w-32 shrink-0" />
            <div className="flex-1 max-w-2xl mx-auto hidden md:block">
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Skeleton className="h-10 w-10 sm:w-24 rounded-xl" />
            </div>
          </div>
          <div className="mt-3 md:hidden">
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
        <div className="border-t border-gray-100 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <Skeleton className="w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-auto md:h-96 rounded-xl sm:rounded-2xl" />
      </section>

      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100"
            >
              <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2 min-w-0">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2.5 w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-5 bg-white rounded-xl border border-gray-100 text-center"
            >
              <Skeleton className="w-16 h-16 mx-auto mb-3 rounded-2xl" />
              <Skeleton className="h-3.5 w-3/4 mx-auto mb-2" />
              <Skeleton className="h-3 w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-4">
        <Skeleton className="w-full h-56 sm:h-48 rounded-2xl" />
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-20 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <Skeleton className="w-full aspect-square rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-5 w-1/2 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | "All">("All");
  const [scrolled, setScrolled] = useState(false);
  const [dealSecondsLeft, setDealSecondsLeft] = useState(() =>
    getSecondsUntilMidnight(),
  );

  const [storeData, setStoreData] = useState<StoreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const [customerSession, setCustomerSession] =
    useState<CustomerSession | null>(null);

  const [orderConfirmation, setOrderConfirmation] =
    useState<OrderConfirmation | null>(null);

  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const showToast = (message: string, type: ToastMsg["type"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 3200);
  };
  const dismissToast = (id: number) =>
    setToasts((t) => t.filter((toast) => toast.id !== id));

  // ---- Navigation helpers ------------------------------------------------
  // Every entry point that changes what products are shown (desktop nav,
  // mobile nav, category grid tiles, the quick-filter pills above the
  // products grid, and search) needs to actually bring the products
  // section into view — otherwise picking a category just silently updates
  // state below the fold and looks like nothing happened. `scroll-mt-28`
  // on the target section accounts for the sticky header height so the
  // heading isn't hidden underneath it after scrolling.
  const productsSectionRef = useRef<HTMLElement | null>(null);

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCategorySelect = (id: number | "All") => {
    setActiveCategory(id);
    setSearchQuery("");
    scrollToProducts();
  };

  const handleHomeClick = () => {
    setActiveCategory("All");
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scrollToProducts();
  };

  // On first load: restore the shared guest cart, and restore the
  // customer session (if this device previously "signed in" via a
  // completed checkout) so the checkout form + header can reflect it.
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
    setCustomerSession(getCustomerSession());
  }, []);

  // Keep the guest cart saved so it survives reloads/visits.
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDealSecondsLeft(getSecondsUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCartOpen(false);
    setShowCheckoutForm(true);
  };

  // Called by CheckoutFormModal once the mock flow (customer check -> OTP
  // if new -> place order) has actually succeeded. Shipping is always
  // free now, so the paid total is simply the cart subtotal.
  const handleOrderPlaced = ({ orderId, shipping }: PlacedOrder) => {
    setOrderConfirmation({
      orderId,
      total: cartTotal,
      itemCount: cartCount,
      name: shipping.name,
      mobile: shipping.mobile,
      address: `${shipping.addressLine1}${
        shipping.addressLine2 ? ", " + shipping.addressLine2 : ""
      } - ${shipping.pincode}`,
    });
    setCustomerSession(getCustomerSession());
    setCart([]);
    setCartOpen(false);
    setShowCheckoutForm(false);
  };

  const handleLogout = () => {
    clearCustomerSession();
    setCustomerSession(null);
    showToast("Signed out — saved address cleared from this device", "info");
  };

  useEffect(() => {
    let cancelled = false;

    async function loadStore() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<ApiEnvelope<StoreResponse>>(
          API_ROUTES.ONLINE_STORE(STORE_CODE),
        );
        if (cancelled) return;

        if (!data.Status) {
          setError(
            data.ErrorMessage || data.Message || "Failed to load store data.",
          );
          setStoreData(null);
        } else {
          setStoreData(data.Response);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load store data.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStore();
    return () => {
      cancelled = true;
    };
  }, []);

  const banners = useMemo(() => {
    return (storeData?.CarouselImages ?? []).filter(
      (url): url is string => !!url,
    );
  }, [storeData]);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(
      () => setCurrentSlide((s) => (s + 1) % banners.length),
      5000,
    );
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.title = storeData?.StoreName || "vCartify";

    const favicon = document.getElementById(
      "favicon",
    ) as HTMLLinkElement | null;
    if (favicon) {
      favicon.href = storeData?.StoreImage
        ? `data:image/jpeg;base64,${storeData.StoreImage}`
        : "/favicon.ico";
    }
  }, [storeData]);

  const categories = useMemo(() => {
    if (!storeData?.DropDownList) return [];
    return storeData.DropDownList.filter(
      (c) => c.Text.toLowerCase() !== "all",
    ).map((c, idx) => ({
      id: c.Value,
      name: c.Text,
      ...getCategoryVisual(c.Text, idx),
    }));
  }, [storeData]);

  const categoryNameById = useMemo(() => {
    const map = new Map<number, string>();
    storeData?.DropDownList?.forEach((c) => map.set(c.Value, c.Text));
    return map;
  }, [storeData]);

  const items = storeData?.ItemList ?? [];

  const storeName = storeData?.StoreName || "Demo Store";

  const socialLinks = useMemo<SocialLinkDef[]>(() => {
    if (!storeData) return [];
    const links: SocialLinkDef[] = [];
    const sd = storeData as unknown as Record<
      string,
      string | null | undefined
    >;

    if (sd.FacebookLink)
      links.push({
        icon: FacebookIcon,
        href: sd.FacebookLink,
        label: "Facebook",
      });
    if (sd.InstagramLink)
      links.push({
        icon: InstagramIcon,
        href: sd.InstagramLink,
        label: "Instagram",
      });
    if (sd.WhatsappLink)
      links.push({
        icon: WhatsappIcon,
        href: sd.WhatsappLink,
        label: "WhatsApp",
      });
    if (sd.WhatsappChanneLink)
      links.push({
        icon: Megaphone,
        href: sd.WhatsappChanneLink,
        label: "WhatsApp Channel",
      });
    if (sd.WebsiteLink)
      links.push({ icon: Globe, href: sd.WebsiteLink, label: "Website" });

    return links;
  }, [storeData]);

  const filteredProducts = items.filter((item) => {
    const matchesSearch = item.ItemName.toLowerCase().includes(
      searchQuery.toLowerCase(),
    );
    const matchesCategory =
      activeCategory === "All" || item.CategoryId === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item: StoreItem) => {
    if (item.AvailableStock <= 0) return;
    const existing = cart.find((i) => i.ItemName === item.ItemName);

    if (existing && existing.qty >= item.AvailableStock) {
      showToast(
        `Only ${item.AvailableStock} in stock for "${item.ItemName}"`,
        "error",
      );
      return;
    }

    if (existing) {
      setCart((c) =>
        c.map((i) =>
          i.ItemName === item.ItemName ? { ...i, qty: i.qty + 1 } : i,
        ),
      );
    } else {
      setCart((c) => [...c, { ...item, cartId: item.ItemName, qty: 1 }]);
    }

    showToast(`${item.ItemName} added to cart`, "success");
    setCartOpen(true);
  };

  const updateQty = (cartId: string, delta: number) => {
    setCart((c) =>
      c.map((i) =>
        i.cartId === cartId
          ? {
              ...i,
              qty: Math.min(i.AvailableStock, Math.max(1, i.qty + delta)),
            }
          : i,
      ),
    );
  };

  const removeFromCart = (cartId: string) => {
    setCart((c) => c.filter((i) => i.cartId !== cartId));
    showToast("Item removed from cart", "info");
  };

  const toggleWishlist = (name: string) => {
    const isWishlisted = wishlist.includes(name);
    setWishlist((w) =>
      isWishlisted ? w.filter((i) => i !== name) : [...w, name],
    );
    showToast(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      "info",
    );
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.SellingPrice * item.qty,
    0,
  );
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const storeLogoSrc = storeData?.StoreImage
    ? `data:image/jpeg;base64,${storeData.StoreImage}`
    : null;

  if (loading) {
    return <StoreSkeleton />;
  }

  if (error || !storeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-gray-50 px-4 text-center">
        <AlertTriangle size={32} className="text-red-500" />
        <p className="text-gray-700 font-semibold">Couldn't load the store</p>
        <p className="text-gray-500 text-sm max-w-sm">{error}</p>
      </div>
    );
  }

  const dealHrs = Math.floor(dealSecondsLeft / 3600);
  const dealMin = Math.floor((dealSecondsLeft % 3600) / 60);
  const dealSec = dealSecondsLeft % 60;
  const pad2 = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4"></div>
          <div className="hidden md:flex items-center gap-4">
            {storeData.PhoneNumber && (
              <span className="flex items-center gap-1.5">
                <Phone size={12} /> {storeData.PhoneNumber}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Mail size={12} /> support@
              {storeName.toLowerCase().replace(/\s+/g, "")}.in
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-40 transition-all ${scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white/95 backdrop-blur-sm border-b border-gray-100"}`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleHomeClick();
              }}
              className="flex items-center gap-2 shrink-0 min-w-0"
            >
              {storeLogoSrc ? (
                <img
                  src={storeLogoSrc}
                  alt={storeName}
                  className="w-9 h-9 rounded-lg object-cover shadow-md shrink-0"
                />
              ) : (
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md shrink-0">
                  <Zap size={20} className="text-white" />
                </div>
              )}
              <span className="text-base sm:text-xl font-bold text-gray-900 truncate max-w-[40vw] sm:max-w-none">
                {storeName}
              </span>
            </a>

            {/* Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 max-w-2xl mx-auto hidden md:block"
            >
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands and categories..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto">
              {customerSession && (
                <div className="hidden md:flex items-center gap-2 pl-1 pr-2 mr-1 text-sm text-gray-600 border-r border-gray-200">
                  <span className="font-medium text-gray-800">
                    Hi, {customerSession.name.split(" ")[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-gray-500 hover:text-red-600 font-semibold transition-colors"
                    title="Sign out and clear saved address from this device"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 hover:bg-gray-100 rounded-xl flex items-center gap-2"
              >
                <div className="relative">
                  <ShoppingCart size={20} className="text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden lg:block text-sm font-semibold text-gray-700">
                  ₹{cartTotal.toLocaleString()}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="mt-3 md:hidden">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>

          {/* Mobile account row */}
          {customerSession && (
            <div className="mt-3 flex md:hidden items-center justify-between text-sm text-gray-600 px-1">
              <span className="font-medium text-gray-800">
                Hi, {customerSession.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-500 hover:text-red-600 font-semibold"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="border-t border-gray-100 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex items-center gap-1 text-sm">
              <li>
                <button
                  onClick={handleHomeClick}
                  className={`px-4 py-3 font-medium transition-colors ${
                    activeCategory === "All" && !searchQuery
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Home
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`px-4 py-3 font-medium transition-colors ${
                      activeCategory === cat.id
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Hero Carousel — pure image banners from the API, shown on a clean
          white background using object-contain so the *entire* image is
          always visible (no cropping), regardless of the source image's
          aspect ratio or the screen size. */}
      {banners.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl aspect-[16/9] sm:aspect-[21/9] md:aspect-auto md:h-96 bg-white border border-gray-100">
            {banners.map((imageUrl, idx) => (
              <img
                key={idx}
                src={imageUrl}
                alt={`Banner ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${
                  idx === currentSlide
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              />
            ))}

            {banners.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentSlide(
                      (s) => (s - 1 + banners.length) % banners.length,
                    )
                  }
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setCurrentSlide((s) => (s + 1) % banners.length)
                  }
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                >
                  <ChevronRight size={18} />
                </button>

                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 sm:h-2 rounded-full transition-all ${
                        idx === currentSlide
                          ? "w-6 sm:w-8 bg-gray-800"
                          : "w-1.5 sm:w-2 bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}
      {/* Feature Bar */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              icon: Truck,
              title: "Free Shipping",
              desc: "On all orders",
            },
            {
              icon: Shield,
              title: "Secure Payment",
              desc: "100% secure checkout",
            },
            {
              icon: RefreshCw,
              title: "Easy Returns",
              desc: "15-day return policy",
            },
            {
              icon: Headphones,
              title: "24/7 Support",
              desc: "Dedicated customer care",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <f.icon size={22} className="text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <p className="text-gray-500 mt-1">
              Browse our most popular categories
            </p>
          </div>
          <button
            onClick={() => handleCategorySelect("All")}
            className="text-blue-600 font-semibold text-sm hover:underline hidden md:block"
          >
            View All →
          </button>
        </div>
        {categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No categories available right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="group p-5 bg-white rounded-xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all text-center"
              >
                <div
                  className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                >
                  <cat.icon size={28} className="text-white" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {items
                    .filter((i) => i.CategoryId === cat.id)
                    .length.toLocaleString()}{" "}
                  items
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Deal of the Day Banner */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl p-6 md:p-10 text-white overflow-hidden relative shadow-xl">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 20%, #fff 1px, transparent 1px), radial-gradient(circle at 85% 70%, #fff 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1 w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                Deal of the Day · Live
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Mega Discounts Inside!
              </h2>
              <p className="text-white/90 mb-4">
                Grab the hottest deals before today's timer runs out
              </p>
              <div className="flex items-center gap-2 sm:gap-3">
                {[
                  { label: "Hrs", value: dealHrs },
                  { label: "Min", value: dealMin },
                  { label: "Sec", value: dealSec },
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-3 sm:px-4 py-2.5 text-center min-w-[64px] sm:min-w-[72px]">
                      <div className="text-2xl sm:text-3xl font-bold tabular-nums leading-none">
                        {pad2(t.value)}
                      </div>
                      <div className="text-[10px] sm:text-xs text-white/75 mt-1 uppercase tracking-wide">
                        {t.label}
                      </div>
                    </div>
                    {i < 2 && (
                      <span className="text-2xl font-bold text-white/50">
                        :
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/70 mt-3">
                Resets daily at midnight — new deals every day
              </p>
            </div>
            <button
              onClick={() => handleCategorySelect("All")}
              className="w-full md:w-auto shrink-0 px-8 py-3.5 bg-white text-red-600 rounded-xl font-bold hover:bg-gray-100 shadow-lg transition-all hover:-translate-y-0.5"
            >
              Shop the Sale →
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section
        ref={productsSectionRef}
        className="max-w-7xl mx-auto px-4 py-8 scroll-mt-28"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={28} className="text-blue-600" /> All Products
            </h2>
            <p className="text-gray-500 mt-1">
              {filteredProducts.length.toLocaleString()} of{" "}
              {items.length.toLocaleString()} products
              {searchQuery && (
                <>
                  {" "}
                  matching{" "}
                  <span className="font-semibold text-gray-700">
                    "{searchQuery}"
                  </span>
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => handleCategorySelect("All")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === "All"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No products found</p>
            {(searchQuery || activeCategory !== "All") && (
              <button
                onClick={() => handleCategorySelect("All")}
                className="mt-4 text-blue-600 font-semibold text-sm hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((item, idx) => (
              <ProductCard
                key={`${item.ItemName}-${idx}`}
                item={item}
                categoryName={categoryNameById.get(item.CategoryId) ?? ""}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlist.includes(item.ItemName)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Promo Section */}
      {/* <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: "Premium Quality",
              desc: "Curated from top brands",
              icon: Award,
              bg: "from-blue-500 to-indigo-600",
              emoji: "✨",
            },
            {
              title: "Fast Delivery",
              desc: "Express shipping nationwide",
              icon: Truck,
              bg: "from-emerald-500 to-teal-600",
              emoji: "🚀",
            },
            {
              title: "Best Prices",
              desc: "Unbeatable deals everyday",
              icon: Gift,
              bg: "from-rose-500 to-pink-600",
              emoji: "💰",
            },
          ].map((p, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-br ${p.bg} shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="text-5xl mb-3">{p.emoji}</div>
              <h3 className="text-xl font-bold mb-1">{p.title}</h3>
              <p className="text-white/90 text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* Testimonials */}
      {/* <section className="bg-white py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              What Our Customers Say
            </h2>
            <p className="text-gray-500">
              Trusted by thousands of happy shoppers
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
                <StarRating rating={t.rating} />
                <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Newsletter */}
      {/* <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 80%, #fff 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Stay in the Loop
            </h2>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              Subscribe to get special offers, free giveaways, and exclusive
              deals straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => showToast("Thanks for subscribing!", "success")}
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-colors shadow-lg"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                {storeLogoSrc ? (
                  <img
                    src={storeLogoSrc}
                    alt={storeName}
                    className="w-9 h-9 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Zap size={20} className="text-white" />
                  </div>
                )}
                <span className="text-xl font-bold text-white">
                  {storeName}
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                Your one-stop destination for premium products at unbeatable
                prices. Shop the latest trends with confidence.
              </p>
              {socialLinks.length > 0 && (
                <div className="flex gap-2">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors text-white"
                    >
                      <s.icon size={16} />
                    </a>
                  ))}
                </div>
              )}
            </div>
            {[
              {
                title: "Shop",
                links: [
                  "All Products",
                  "New Arrivals",
                  "Best Sellers",
                  "Sale Items",
                  "Brands",
                ],
              },
              {
                title: "Support",
                links: [
                  "Help Center",
                  "Shipping Info",
                  "Returns",
                  "Order Tracking",
                  "Contact Us",
                ],
              },
              {
                title: "Company",
                links: [
                  "About Us",
                  "Careers",
                  "Blog",
                  "Privacy Policy",
                  "Terms of Service",
                ],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm hover:text-blue-400 transition-colors"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>© 2026 {storeName}. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>💳 Visa</span>
              <span>💳 Mastercard</span>
              <span>📱 UPI</span>
              <span>🏦 Net Banking</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setCartOpen(false)}>
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
          <div
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-gray-50 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                    <ShoppingCart size={18} />
                  </span>
                  Your Cart
                  <span className="text-sm font-semibold text-white/75">
                    ({cartCount})
                  </span>
                </h3>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 hover:bg-white/15 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                    <ShoppingCart size={32} className="text-gray-300" />
                  </div>
                  <p className="text-gray-600 font-semibold">
                    Your cart is empty
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Add items to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.cartId}
                      className="relative flex gap-3 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {item.FileUrl ? (
                        <img
                          src={item.FileUrl}
                          alt={item.ItemName}
                          className="w-20 h-20 object-cover rounded-xl shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-xl shrink-0">
                          <ImageOff size={22} className="text-gray-300" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 pr-1">
                            {item.ItemName}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            className="shrink-0 p-1 -m-1 text-gray-300 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {categoryNameById.get(item.CategoryId) ?? ""}
                        </p>
                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-full px-1 py-1">
                            <button
                              onClick={() => updateQty(item.cartId, -1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-4 text-center text-sm font-bold text-gray-900">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.cartId, 1)}
                              disabled={item.qty >= item.AvailableStock}
                              className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                                item.qty >= item.AvailableStock
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "bg-white shadow-sm hover:bg-gray-100"
                              }`}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="font-bold text-gray-900">
                            ₹{(item.SellingPrice * item.qty).toLocaleString()}
                          </span>
                        </div>
                        {item.qty >= item.AvailableStock && (
                          <p className="text-[11px] text-orange-600 font-medium mt-1.5">
                            Max available stock reached
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 bg-white border-t border-gray-100 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)]">
                <div className="space-y-1.5 mb-4 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-700">
                      ₹{cartTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900 text-lg">
                      ₹{cartTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
                {customerSession && (
                  <p className="text-xs text-gray-500 mb-3 text-center">
                    Shipping to{" "}
                    <span className="font-semibold text-gray-700">
                      {customerSession.name}
                    </span>{" "}
                    · +91 {customerSession.mobile}{" "}
                    <button
                      onClick={handleLogout}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      (not you?)
                    </button>
                  </p>
                )}
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-xl font-bold">Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => {
                    handleHomeClick();
                    setMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 font-medium ${
                    activeCategory === "All" && !searchQuery
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700"
                  }`}
                >
                  Home
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      handleCategorySelect(cat.id);
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 font-medium ${
                      activeCategory === cat.id
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700"
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
            {customerSession && (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 font-medium text-red-600 flex items-center gap-2 mt-2 border-t border-gray-100 pt-4"
              >
                <LogOut size={16} /> Sign out
              </button>
            )}
          </div>
        </div>
      )}

      <CheckoutFormModal
        isOpen={showCheckoutForm}
        companyName={storeName}
        cartTotal={cartTotal}
        cartCount={cartCount}
        defaults={customerSession}
        onClose={() => setShowCheckoutForm(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderConfirmationModal
        order={orderConfirmation}
        onClose={() => setOrderConfirmation(null)}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;