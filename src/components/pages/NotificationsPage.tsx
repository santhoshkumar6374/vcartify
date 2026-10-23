import { useState, useEffect } from "react";
import {
  Bell,
  ArrowLeft,
  Package,
  Tag,
  Truck,
  Gift,
 // CheckCircle,
  Trash2,
  Check,
  //Star,
} from "lucide-react";

const NOTIFICATIONS_STORAGE_KEY = "store_notifications";

export interface Notification {
  id: string;
  type: "order" | "offer" | "delivery" | "reward" | "general";
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionLabel?: string;
}

interface Props {
  onBack: () => void;
}

// Sample notifications
const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: "n-1",
    type: "delivery",
    title: "Your order is out for delivery! 🚚",
    message: "Order VC12345679 will be delivered today between 2-6 PM",
    time: "2 hours ago",
    read: false,
    actionLabel: "Track Order",
  },
  {
    id: "n-2",
    type: "offer",
    title: "50% OFF on Masala Products! 🎉",
    message: "Limited time offer. Use code VCLUXE at checkout. Ends in 3 days.",
    time: "5 hours ago",
    read: false,
    actionLabel: "Shop Now",
  },
  {
    id: "n-3",
    type: "order",
    title: "Order Confirmed ✓",
    message: "Your order VC12345680 has been confirmed and is being processed",
    time: "1 day ago",
    read: true,
  },
  {
    id: "n-4",
    type: "reward",
    title: "You earned 100 vCoins! 💰",
    message: "Congratulations! Your recent purchase earned you rewards",
    time: "2 days ago",
    read: true,
    actionLabel: "View Rewards",
  },
  {
    id: "n-5",
    type: "delivery",
    title: "Order Delivered ✓",
    message: "Order VC12345678 has been delivered successfully. Enjoy your purchase!",
    time: "3 days ago",
    read: true,
    actionLabel: "Rate Product",
  },
  {
    id: "n-6",
    type: "general",
    title: "Welcome to vCartify! 👋",
    message: "Thanks for joining us. Explore our latest collections and offers.",
    time: "1 week ago",
    read: true,
  },
];

// Type config
const TYPE_CONFIG = {
  order: { icon: Package, bg: "bg-blue-100", color: "text-blue-700" },
  offer: { icon: Tag, bg: "bg-orange-100", color: "text-orange-700" },
  delivery: { icon: Truck, bg: "bg-green-100", color: "text-green-700" },
  reward: { icon: Gift, bg: "bg-purple-100", color: "text-purple-700" },
  general: { icon: Bell, bg: "bg-gray-100", color: "text-gray-700" },
};

// ═══════════════════════════════════════════════════
export function NotificationsPage({ onBack }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch {
        setNotifications(SAMPLE_NOTIFICATIONS);
      }
    } else {
      setNotifications(SAMPLE_NOTIFICATIONS);
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(SAMPLE_NOTIFICATIONS));
    }
  }, []);

  const saveNotifications = (list: Notification[]) => {
    setNotifications(list);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const handleDelete = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
  };

  const handleClearAll = () => {
    if (window.confirm("Clear all notifications?")) {
      saveNotifications([]);
    }
  };

  return (
    <div className="bg-white min-h-screen py-4 sm:py-8">
      <div className="mx-auto max-w-3xl px-3 sm:px-4">

        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-black font-black text-sm hover:underline mb-4"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black flex items-center justify-center">
                <Bell size={20} className="text-white sm:w-6 sm:h-6" strokeWidth={2} />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-black tracking-tight">
                Notifications
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-semibold">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
              </p>
            </div>
          </div>

          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-xs font-black text-black hover:underline"
                >
                  <Check size={12} strokeWidth={2.5} />
                  Mark all read
                </button>
              )}
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1 text-xs font-black text-black hover:underline"
              >
                <Trash2 size={12} strokeWidth={2.5} />
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 h-9 rounded-lg border-2 font-black text-sm transition-all ${
                filter === "all"
                  ? "border-black bg-black text-white"
                  : "border-gray-300 text-black hover:border-black"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 h-9 rounded-lg border-2 font-black text-sm transition-all ${
                filter === "unread"
                  ? "border-black bg-black text-white"
                  : "border-gray-300 text-black hover:border-black"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        )}

        {/* Empty state */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border-2 border-gray-200 rounded-xl py-16 text-center">
            <Bell size={48} className="mx-auto text-black mb-4" />
            <h3 className="text-xl font-black text-black mb-2">
              {filter === "unread" ? "No unread notifications" : "No notifications"}
            </h3>
            <p className="text-gray-600 font-semibold">
              {filter === "unread"
                ? "You're all caught up! 🎉"
                : "We'll notify you about orders, offers & more"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={() => handleMarkAsRead(notification.id)}
                onDelete={() => handleDelete(notification.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Notification Card ────────────────────────────────
function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: () => void;
  onDelete: () => void;
}) {
  const config = TYPE_CONFIG[notification.type];
  const Icon = config.icon;

  return (
    <article
      onClick={onMarkAsRead}
      className={`group bg-white rounded-xl border-2 p-4 cursor-pointer transition-all ${
        notification.read
          ? "border-gray-200 hover:border-gray-400"
          : "border-black shadow-md relative"
      }`}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
      )}

      <div className="flex gap-3">
        {/* Icon */}
        <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full ${config.bg} flex items-center justify-center shrink-0`}>
          <Icon size={20} className={config.color} strokeWidth={2.5} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`text-sm sm:text-base ${notification.read ? "font-bold" : "font-black"} text-black`}>
              {notification.title}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 flex items-center justify-center transition-all shrink-0"
              aria-label="Delete"
            >
              <Trash2 size={14} className="text-red-500" strokeWidth={2.5} />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-gray-700 font-semibold leading-relaxed mb-2">
            {notification.message}
          </p>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-semibold">
              {notification.time}
            </span>
            {notification.actionLabel && (
              <button
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-black font-black hover:underline"
              >
                {notification.actionLabel} →
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}