import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/payment/create-order", async (req, res) => {
  try {
    const { amount, customerName, customerPhone, orderId } = req.body;

    if (!amount || !customerPhone) {
      return res.status(400).json({ success: false, message: "Amount and phone are required" });
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    if (!appId || !secretKey) {
      return res.status(500).json({ success: false, message: "Cashfree credentials are not configured" });
    }

    const payload = {
      order_id: orderId || `VC_${Date.now()}`,
      order_amount: Number(amount),
      order_currency: "INR",
      customer_details: {
        customer_id: customerPhone.replace(/\D/g, "") || `cust_${Date.now()}`,
        customer_name: customerName || "Customer",
        customer_phone: customerPhone.replace(/\D/g, ""),
        customer_email: "customer@vcartify.com",
      },
      order_meta: {
        return_url: "http://localhost:5173/?order_id={order_id}",
      },
    };

    console.log(`[Cashfree Dev] Creating order ${payload.order_id} for ₹${amount}...`);

    const response = await fetch("https://sandbox.cashfree.com/pg/orders", {
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
      console.error("[Cashfree Dev] Error response:", data);
      return res.status(response.status).json({ success: false, error: data });
    }

    console.log(`[Cashfree Dev] Session created successfully! Order: ${data.order_id}`);

    res.json({
      success: true,
      payment_session_id: data.payment_session_id,
      order_id: data.order_id,
    });
  } catch (error) {
    console.error("[Cashfree Dev] Server Exception:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Cashfree Dev Server running on http://localhost:${PORT}`);
});
