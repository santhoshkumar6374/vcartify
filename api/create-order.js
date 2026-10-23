export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { amount, customerName, customerPhone, orderId } = req.body || {};

    if (!amount || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: "Amount and customer phone are required.",
      });
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const mode = process.env.VITE_CASHFREE_MODE || "sandbox";

    if (!appId || !secretKey) {
      return res.status(500).json({
        success: false,
        message: "Cashfree credentials are not configured in environment variables.",
      });
    }

    const apiUrl =
      mode === "production"
        ? "https://api.cashfree.com/pg/orders"
        : "https://sandbox.cashfree.com/pg/orders";

    const payload = {
      order_id: orderId || `VC_${Date.now()}`,
      order_amount: Number(amount),
      order_currency: "INR",
      customer_details: {
        customer_id: customerPhone.replace(/\D/g, "") || `cust_${Date.now()}`,
        customer_name: customerName || "Customer",
        customer_phone: customerPhone.replace(/\D/g, ""),
        customer_email: "support@vcartify.com",
      },
      order_meta: {
        return_url: `${req.headers.origin || "http://localhost:5173"}/?order_id={order_id}`,
      },
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[Cashfree API Error]:", data);
      return res.status(response.status).json({ success: false, error: data });
    }

    return res.status(200).json({
      success: true,
      payment_session_id: data.payment_session_id,
      order_id: data.order_id,
    });
  } catch (error) {
    console.error("[Serverless create-order Exception]:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process payment request",
    });
  }
}
