import { apiFetch } from "../utils/apiFetch";
import { API_ROUTES } from "../constants/apiRoutes";
import { getStoreCode } from "../config/storeConfig";
import type { ApiEnvelope } from "../types/store";

// TEMPORARY mock backend. Swap the bodies of these functions for real
// apiFetch(API_ROUTES...) calls later — keep the same function names
// and return shapes so CheckoutFormModal / App don't need to change.
//
// SESSION MODEL (Amazon-style):
// - `store_customer_session` holds the "logged in" shipping profile for
//   this device/browser. It persists across reloads and visits.
// - It is set once an order is successfully placed / OTP-verified.
// - It is cleared ONLY by an explicit sign-out action (clearCustomerSession).
// - It is completely separate from the cart (`store_cart_guest` in App.tsx)
//   — signing out must NOT clear the cart, and clearing the cart must NOT
//   sign the person out.
// - `sessionToken` is included so that once the backend issues a real
//   token (see verifyOtp), the frontend has a place to store it and can
//   attach it as `Authorization: Bearer <token>` on future calls, and
//   invalidate it server-side on logout.

export interface SavedCustomer {
  name: string;
  mobile: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
}

export interface CustomerSession extends SavedCustomer {
  sessionToken: string | null;
}

const CUSTOMERS_DB_KEY = "mock_customers_db"; // pretend server-side table
const SESSION_KEY = "store_customer_session"; // this device's "logged in" profile
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

/**
 * Current "logged in" shipping profile for this device.
 * Survives reloads/visits. Returns null if never set or after logout.
 */
export function getCustomerSession(): CustomerSession | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function setCustomerSession(
  customer: SavedCustomer,
  sessionToken: string | null = null,
) {
  const session: CustomerSession = { ...customer, sessionToken };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Amazon-style "sign out". Clears ONLY the saved profile/session —
 * never touches the cart. In the real backend version this should also
 * call POST /customer/logout to invalidate the sessionToken server-side.
 */
export function clearCustomerSession() {
  localStorage.removeItem(SESSION_KEY);
}

interface CheckNumberResponse {
  StoreName: string;
  PhoneNumber: string;
  IsRegistered: boolean;
}

/** Real: GET /api/OnlineStore/{store}/checknumber/{phonenumber} */
export async function checkCustomerByMobile(
  mobile: string,
): Promise<{ exists: boolean }> {
  const data = await apiFetch<ApiEnvelope<CheckNumberResponse>>(
    API_ROUTES.CHECK_PHONE_NUMBER(getStoreCode(), mobile),
  );

  if (!data.Status || !data.Response) {
    throw new Error(
      data.ErrorMessage || data.Message || "Couldn't verify this number.",
    );
  }

  return { exists: data.Response.IsRegistered };
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
): Promise<{ verified: boolean; sessionToken: string | null }> {
  const verified = otp.trim() === MOCK_OTP;
  return delay(
    { verified, sessionToken: verified ? `mock-token-${Date.now()}` : null },
    500,
  );
}

/** Mock: POST /order/place */
export async function placeOrder(details: {
  storeName: string;
  customer: SavedCustomer;
  itemCount: number;
  total: number;
  sessionToken?: string | null;
}): Promise<{ orderId: string }> {
  // "Register" the customer server-side so their next checkout skips OTP
  const db = readDb();
  db[details.customer.mobile] = details.customer;
  writeDb(db);

  // Establish/refresh the device session (Amazon-style "stay logged in")
  setCustomerSession(details.customer, details.sessionToken ?? null);

  const orderId = `TP${Date.now().toString().slice(-6)}`;
  return delay({ orderId }, 700);
}

/** Mock: POST /customer/logout */
export async function logoutCustomer(): Promise<{ success: boolean }> {
  clearCustomerSession();
  return delay({ success: true }, 300);
}
