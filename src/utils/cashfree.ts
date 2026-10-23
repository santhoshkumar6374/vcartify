declare global {
  interface Window {
    Cashfree?: (config: { mode: "sandbox" | "production" }) => any;
  }
}

let cashfreeInstance: any = null;

/**
 * Initializes and returns the Cashfree SDK instance
 */
export async function getCashfreeInstance() {
  if (cashfreeInstance) return cashfreeInstance;

  // Wait for script to be available if needed
  if (!window.Cashfree) {
    await new Promise<void>((resolve, reject) => {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (window.Cashfree) {
          clearInterval(interval);
          resolve();
        } else if (attempts > 30) {
          clearInterval(interval);
          reject(new Error("Cashfree SDK failed to load. Please check your internet connection."));
        }
      }, 100);
    });
  }

  const mode = (import.meta.env.VITE_CASHFREE_MODE || "sandbox") as "sandbox" | "production";
  cashfreeInstance = window.Cashfree!({ mode });
  return cashfreeInstance;
}

export interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  onSuccess?: (paymentDetails: any) => void;
  onFailure?: (error: any) => void;
}

/**
 * Opens Cashfree Payment Modal
 */
export async function openCashfreeModal({
  paymentSessionId,
  onSuccess,
  onFailure,
}: CashfreeCheckoutOptions) {
  try {
    const cashfree = await getCashfreeInstance();

    const checkoutOptions = {
      paymentSessionId,
      redirectTarget: "_modal", // Opens inside an interactive modal popup
    };

    return cashfree.checkout(checkoutOptions).then((result: any) => {
      if (result.error) {
        console.warn("Cashfree checkout error / cancelled:", result.error);
        onFailure?.(result.error);
      } else if (result.paymentDetails) {
        console.log("Cashfree payment successful:", result.paymentDetails);
        onSuccess?.(result.paymentDetails);
      } else if (result.redirect) {
        console.log("Cashfree redirect triggered");
      }
    });
  } catch (error: any) {
    console.error("Failed to launch Cashfree modal:", error);
    onFailure?.(error);
  }
}
