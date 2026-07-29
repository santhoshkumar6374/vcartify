// TEMPORARY mock backend. Swap the bodies of these functions for real
// apiFetch(API_ROUTES...) calls later — keep the same function names
// and return shapes so CheckoutFormModal doesn't need to change.

export interface SavedCustomer {
  name: string;
  mobile: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
}

const CUSTOMERS_DB_KEY = "mock_customers_db"; // pretend server-side table
const LAST_CUSTOMER_KEY = "mock_last_customer"; // this device's last used details
const MOCK_OTP = "1234"; // any real OTP endpoint will replace this

function delay<T>(value: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function readDb(): Record<string, SavedCustomer> {
  try {
    return JSON.parse(localStorage.getItem(CUSTOMERS_DB_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeDb(db: Record<string, SavedCustomer>) {
  localStorage.setItem(CUSTOMERS_DB_KEY, JSON.stringify(db));
}

/** Prefill helper: last shipping details used on this device/browser. */
export function getLastCustomer(): SavedCustomer | null {
  try {
    return JSON.parse(localStorage.getItem(LAST_CUSTOMER_KEY) || "null");
  } catch {
    return null;
  }
}

function saveLastCustomer(c: SavedCustomer) {
  localStorage.setItem(LAST_CUSTOMER_KEY, JSON.stringify(c));
}

/** Mock: GET /customer/check?mobile=... */
export async function checkCustomerByMobile(
  mobile: string,
): Promise<{ exists: boolean; customer: SavedCustomer | null }> {
  const db = readDb();
  const customer = db[mobile] ?? null;
  return delay({ exists: !!customer, customer });
}

/** Mock: POST /otp/send */
export async function sendOtp(mobile: string): Promise<{ sent: boolean }> {
  // eslint-disable-next-line no-console
  console.log(`[mock OTP] code for ${mobile} is ${MOCK_OTP}`);
  return delay({ sent: true }, 500);
}

/** Mock: POST /otp/verify */
export async function verifyOtp(
  _mobile: string,
  otp: string,
): Promise<{ verified: boolean }> {
  return delay({ verified: otp.trim() === MOCK_OTP }, 500);
}

/** Mock: POST /order/place */
export async function placeOrder(details: {
  storeName: string;
  customer: SavedCustomer;
  itemCount: number;
  total: number;
}): Promise<{ orderId: string }> {
  // "Register" the customer server-side so their next checkout skips OTP
  const db = readDb();
  db[details.customer.mobile] = details.customer;
  writeDb(db);
  saveLastCustomer(details.customer);

  const orderId = `TP${Date.now().toString().slice(-6)}`;
  return delay({ orderId }, 700);
}
