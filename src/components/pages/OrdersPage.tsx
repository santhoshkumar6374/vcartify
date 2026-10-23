import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  RotateCw,
  Star,
  MapPin,
} from "lucide-react";

const ORDERS_STORAGE_KEY = "store_orders";

export interface Order {
  orderId: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  items: Array<{
    ItemName: string;
    SellingPrice: number;
    MRP: number;
    qty: number;
    FileUrl?: string | null;
  }>;
  total: number;
  address: string;
  paymentMethod: string;
  deliveryDate?: string;
}

interface Props {
  onContinueShopping: () => void;
  onBack: () => void;
}

// ─── Status Config ────────────────────────────────────
const STATUS_CONFIG = {
  processing: {
    label: "Processing",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    bgDot: "bg-yellow-500",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "bg-blue-100 text-blue-800 border-blue-300",
    bgDot: "bg-blue-500",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 border-green-300",
    bgDot: "bg-green-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: RotateCw,
    color: "bg-red-100 text-red-800 border-red-300",
    bgDot: "bg-red-500",
  },
};

// ─── Sample orders for demo ───────────────────────────
const SAMPLE_ORDERS: Order[] = [
  {
    orderId: "VC12345678",
    date: "Nov 20, 2025",
    status: "delivered",
    items: [
      { ItemName: "Sathu Maavu (250 G)", SellingPrice: 175, MRP: 250, qty: 2 },
      { ItemName: "Sambar Powder (100 G)", SellingPrice: 100, MRP: 150, qty: 1 },
    ],
    total: 450,
    address: "42, Rose Garden, 3rd Cross, Tirupur - 641604",
    paymentMethod: "UPI",
    deliveryDate: "Nov 23, 2025",
  },
  {
    orderId: "VC12345679",
    date: "Nov 18, 2025",
    status: "shipped",
    items: [
      { ItemName: "Paruppu Podi (100 G)", SellingPrice: 90, MRP: 120, qty: 1 },
    ],
    total: 90,
    address: "42, Rose Garden, 3rd Cross, Tirupur - 641604",
    paymentMethod: "Cash on Delivery",
  },
  {
    orderId: "VC12345680",
    date: "Nov 15, 2025",
    status: "processing",
    items: [
      { ItemName: "A4 Paper 70GSM", SellingPrice: 2600, MRP: 3600, qty: 1 },
    ],
    total: 2600,
    address: "Office block, Tech Park, Coimbatore - 641014",
    paymentMethod: "Credit Card",
  },
];

// ═══════════════════════════════════════════════════
export function OrdersPage({ onContinueShopping, onBack }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");

  // Load orders from localStorage OR use sample data
  useEffect(() => {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch {
        setOrders(SAMPLE_ORDERS);
      }
    } else {
      // First time - show sample orders
      setOrders(SAMPLE_ORDERS);
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(SAMPLE_ORDERS));
    }
  }, []);

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  // ─── Empty State ────────────────────────────────────
  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="h-24 w-24 sm:h-28 sm:w-28 mx-auto rounded-full bg-black flex items-center justify-center mb-6">
            <Package size={40} className="text-white sm:w-12 sm:h-12" strokeWidth={2} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-black mb-2 tracking-tight">
            No orders yet
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 font-semibold px-4">
            Start shopping to place your first order!
          </p>
          <button
            onClick={onContinueShopping}
            className="inline-flex items-center gap-2 bg-black text-white px-6 sm:px-8 py-3 rounded-lg font-black hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            Start Shopping
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-4 sm:py-8">
      <div className="mx-auto max-w-[1500px] px-3 sm:px-4">

        {/* ═══ Back button ═══ */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-black font-black text-sm hover:underline mb-4"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back
        </button>

        {/* ═══ Header ═══ */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-black flex items-center justify-center">
            <Package size={20} className="text-white sm:w-6 sm:h-6" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-black tracking-tight">
              My Orders
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-semibold">
              {orders.length} total orders
            </p>
          </div>
        </div>

        {/* ═══ Status Filter Tabs ═══ */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide">
          <FilterTab
            label="All"
            count={orders.length}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          {(Object.keys(STATUS_CONFIG) as Array<Order["status"]>).map((status) => {
            const count = orders.filter((o) => o.status === status).length;
            if (count === 0) return null;
            return (
              <FilterTab
                key={status}
                label={STATUS_CONFIG[status].label}
                count={count}
                active={filter === status}
                onClick={() => setFilter(status)}
              />
            );
          })}
        </div>

        {/* ═══ Orders List ═══ */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white border-2 border-gray-200 rounded-xl py-12 text-center">
            <p className="text-gray-600 font-semibold">
              No {filter} orders found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Filter Tab ───────────────────────────────────────
function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 h-9 rounded-lg border-2 whitespace-nowrap font-black text-sm transition-all shrink-0 ${
        active
          ? "border-black bg-black text-white"
          : "border-gray-300 text-black hover:border-black"
      }`}
    >
      <span>{label}</span>
      <span
        className={`text-xs px-1.5 py-0.5 rounded-full ${
          active ? "bg-white text-black" : "bg-gray-100 text-black"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

// ─── Order Card ───────────────────────────────────────
function OrderCard({ order }: { order: Order }) {
  const config = STATUS_CONFIG[order.status];
  const StatusIcon = config.icon;

  return (
    <article className="bg-white rounded-xl border-2 border-gray-200 hover:border-black transition-colors overflow-hidden">

      {/* Order Header */}
      <div className="bg-gray-50 border-b-2 border-gray-200 p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-black tracking-widest text-gray-600 uppercase">
              Order ID
            </p>
            <p className="text-sm font-black text-black">{order.orderId}</p>
          </div>
          <div className="hidden sm:block h-8 w-px bg-gray-300" />
          <div>
            <p className="text-[10px] font-black tracking-widest text-gray-600 uppercase">
              Date
            </p>
            <p className="text-sm font-black text-black">{order.date}</p>
          </div>
          <div className="hidden sm:block h-8 w-px bg-gray-300" />
          <div>
            <p className="text-[10px] font-black tracking-widest text-gray-600 uppercase">
              Total
            </p>
            <p className="text-sm font-black text-black">
              ₹{order.total.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 ${config.color} font-black text-xs`}>
          <span className={`h-2 w-2 rounded-full ${config.bgDot} animate-pulse`} />
          <StatusIcon size={14} strokeWidth={2.5} />
          <span>{config.label}</span>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-4 space-y-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex gap-3 items-center">
            {/* Product image */}
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 p-1">
              {item.FileUrl ? (
                <img
                  src={item.FileUrl}
                  alt={item.ItemName}
                  className="h-full w-full object-contain"
                />
              ) : (
                <ShoppingBag size={20} className="text-black" strokeWidth={2} />
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-black truncate">
                {item.ItemName}
              </p>
              <p className="text-xs text-gray-600 font-semibold">
                Qty: {item.qty} × ₹{item.SellingPrice.toLocaleString()}
              </p>
            </div>

            {/* Price */}
            <p className="text-sm font-black text-black">
              ₹{(item.SellingPrice * item.qty).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Address & Payment */}
      <div className="border-t-2 border-gray-100 p-4 bg-gray-50/50 space-y-2">
        <div className="flex items-start gap-2 text-xs">
          <MapPin size={14} className="text-black mt-0.5 shrink-0" strokeWidth={2.5} />
          <p className="text-black font-semibold">
            <span className="font-black">Delivered to: </span>
            {order.address}
          </p>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs text-black font-semibold">
            <span className="font-black">Payment: </span>
            {order.paymentMethod}
          </p>
          {order.deliveryDate && (
            <p className="text-xs text-green-700 font-black">
              ✓ Delivered on {order.deliveryDate}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t-2 border-gray-100 p-3 flex flex-wrap gap-2 justify-end">
        {order.status === "delivered" && (
          <button className="flex items-center gap-1.5 px-4 h-9 rounded-lg border-2 border-black text-black font-black text-xs hover:bg-black hover:text-white transition-colors">
            <Star size={12} strokeWidth={2.5} />
            Rate Product
          </button>
        )}
        {order.status === "shipped" && (
          <button className="flex items-center gap-1.5 px-4 h-9 rounded-lg border-2 border-black text-black font-black text-xs hover:bg-black hover:text-white transition-colors">
            <Truck size={12} strokeWidth={2.5} />
            Track Order
          </button>
        )}
        <button className="flex items-center gap-1.5 px-4 h-9 rounded-lg bg-black text-white font-black text-xs hover:bg-gray-800 transition-colors">
          View Details
          <ArrowRight size={12} strokeWidth={2.5} />
        </button>
      </div>
    </article>
  );
}