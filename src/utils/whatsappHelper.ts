import { StoreItem } from "@/types/store";

interface CartItem extends StoreItem {
  qty: number;
}

interface OrderMessageParams {
  storeName: string;
  storePhone: string;
  cart: CartItem[];
  subtotal: number;
  discount?: number;
  couponDiscount?: number;
  total: number;
  paymentMethod?: string;
  customerName?: string;
  customerMobile?: string;
  address?: string;
  orderId?: string;
}

/**
 * Formats phone number to WhatsApp format (adds India country code)
 * Example: "9500009474" → "919500009474"
 */
function formatPhoneForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return cleaned;
  }
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  return cleaned;
}

/**
 * Get phone number for a product
 * Priority: Product.PhoneNumber → Product.VendorPhone → Store.PhoneNumber
 */
function getProductPhone(item: CartItem, fallbackPhone: string): string {
  return item.PhoneNumber || item.VendorPhone || fallbackPhone;
}

/**
 * Get vendor/store name for a product
 * Priority: Product.StoreName → Product.VendorName → Fallback storeName
 */
function getProductStoreName(item: CartItem, fallbackName: string): string {
  return item.StoreName || item.VendorName || fallbackName;
}

/**
 * Groups cart items by phone number
 * Returns Map: { phone → { items[], vendorName } }
 */
interface GroupData {
  items: CartItem[];
  vendorName: string;
}

function groupCartByPhone(
  cart: CartItem[],
  fallbackPhone: string,
  fallbackName: string
): Map<string, GroupData> {
  const grouped = new Map<string, GroupData>();

  cart.forEach((item) => {
    const phone = getProductPhone(item, fallbackPhone);
    const vendorName = getProductStoreName(item, fallbackName);

    if (!grouped.has(phone)) {
      grouped.set(phone, { items: [], vendorName });
    }
    grouped.get(phone)!.items.push(item);
  });

  return grouped;
}

/**
 * Generates order message for a specific vendor's items
 */
function generateVendorOrderMessage(params: {
  vendorName: string;
  items: CartItem[];
  paymentMethod: string;
  customerName: string;
  customerMobile: string;
  address: string;
  orderId: string;
  totalVendors: number;
  currentVendorIndex: number;
}): string {
  const {
    vendorName,
    items,
    paymentMethod,
    customerName,
    customerMobile,
    address,
    orderId,
    totalVendors,
    currentVendorIndex,
  } = params;

  const subtotal = items.reduce(
    (sum, item) => sum + item.SellingPrice * item.qty,
    0
  );

  const productsList = items
    .map((item, idx) => {
      const itemTotal = item.SellingPrice * item.qty;
      return `${idx + 1}. *${item.ItemName}*\n   ₹${item.SellingPrice} × ${item.qty} = ₹${itemTotal.toLocaleString()}`;
    })
    .join("\n\n");

  const orderInfo = totalVendors > 1
    ? `📦 *Order ${currentVendorIndex} of ${totalVendors}*\n`
    : "";

  return `🛒 *New Order - ${vendorName}*
${orderId ? `🔖 *Order ID:* ${orderId}\n` : ""}${orderInfo}━━━━━━━━━━━━━━━━━━━━
📦 *ORDER DETAILS*
━━━━━━━━━━━━━━━━━━━━

${productsList}

━━━━━━━━━━━━━━━━━━━━
💰 *PRICE*
━━━━━━━━━━━━━━━━━━━━

*Subtotal:* ₹${subtotal.toLocaleString()}
*Delivery:* FREE
*Total:* ₹${subtotal.toLocaleString()}
*Payment:* ${paymentMethod || "Cash on Delivery"}

━━━━━━━━━━━━━━━━━━━━
👤 *CUSTOMER DETAILS*
━━━━━━━━━━━━━━━━━━━━

*Name:* ${customerName || "Not provided"}
*Mobile:* +91 ${customerMobile || "Not provided"}
${address ? `*Address:* ${address}` : ""}

━━━━━━━━━━━━━━━━━━━━

Please confirm my order. Thank you! 🙏`;
}

/**
 * Sends order to WhatsApp - Auto-groups items by vendor phone
 * Opens ONE WhatsApp tab per unique vendor phone number
 */
export function sendOrderViaWhatsApp(params: OrderMessageParams): void {
  const {
    storeName,
    storePhone,
    cart,
    paymentMethod = "Not specified",
    customerName = "",
    customerMobile = "",
    address = "",
    orderId = "",
  } = params;

  // Group items by phone number
  const groupedByPhone = groupCartByPhone(cart, storePhone, storeName);
  const totalVendors = groupedByPhone.size;

  // ✨ DEBUG LOGS
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📱 WHATSAPP ORDER GROUPING");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Total unique vendors: ${totalVendors}`);
  groupedByPhone.forEach((data, phone) => {
    console.log(`\n📞 Vendor: ${data.vendorName}`);
    console.log(`   Phone: ${phone}`);
    console.log(`   Products (${data.items.length}):`);
    data.items.forEach((item) => {
      console.log(`     - ${item.ItemName} × ${item.qty}`);
    });
  });
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Send order to each unique vendor
  let index = 0;
  groupedByPhone.forEach((data, phone) => {
    const formattedPhone = formatPhoneForWhatsApp(phone);
    const message = generateVendorOrderMessage({
      vendorName: data.vendorName,
      items: data.items,
      paymentMethod,
      customerName,
      customerMobile,
      address,
      orderId: totalVendors > 1 ? `${orderId}-${index + 1}` : orderId,
      totalVendors,
      currentVendorIndex: index + 1,
    });

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`;

    console.log(`\n📱 Opening WhatsApp #${index + 1}:`);
    console.log(`   URL Phone: ${formattedPhone}`);
    console.log(`   Vendor: ${data.vendorName}`);
    console.log(`   Items: ${data.items.length}`);

    // Delay between tabs (500ms) to avoid browser blocking
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
    }, index * 500);

    index++;
  });
}

/**
 * Legacy: Single order message generator (backwards compatibility)
 */
export function generateOrderMessage(params: OrderMessageParams): string {
  return generateVendorOrderMessage({
    vendorName: params.storeName,
    items: params.cart,
    paymentMethod: params.paymentMethod || "Not specified",
    customerName: params.customerName || "",
    customerMobile: params.customerMobile || "",
    address: params.address || "",
    orderId: params.orderId || "",
    totalVendors: 1,
    currentVendorIndex: 1,
  });
}