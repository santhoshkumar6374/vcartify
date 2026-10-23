import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dev plugin to proxy Cashfree Sandbox Order creation during development
function cashfreeDevPlugin(env: Record<string, string>) {
  return {
    name: "cashfree-dev-plugin",
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (
          (req.url === "/api/create-order" || req.url === "/api/payment/create-order") &&
          req.method === "POST"
        ) {
          let body = "";
          req.on("data", (chunk: any) => {
            body += chunk;
          });
          req.on("end", async () => {
            try {
              const { amount, customerName, customerPhone, orderId } = JSON.parse(body || "{}");
              const appId = env.CASHFREE_APP_ID;
              const secretKey = env.CASHFREE_SECRET_KEY;
              if (!appId || !secretKey) {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, message: "Cashfree credentials are not configured" }));
                return;
              }

              const payload = {
                order_id: orderId || `VC_${Date.now()}`,
                order_amount: Number(amount) || 1,
                order_currency: "INR",
                customer_details: {
                  customer_id: (customerPhone || "").replace(/\D/g, "") || `cust_${Date.now()}`,
                  customer_name: customerName || "Customer",
                  customer_phone: (customerPhone || "9999999999").replace(/\D/g, ""),
                  customer_email: "customer@vcartify.com",
                },
                order_meta: {
                  return_url: "http://localhost:5173/?order_id={order_id}",
                },
              };

              const mode = process.env.VITE_CASHFREE_MODE || "sandbox";
              const apiUrl =
                mode === "production"
                  ? "https://api.cashfree.com/pg/orders"
                  : "https://sandbox.cashfree.com/pg/orders";

              const cfRes = await fetch(apiUrl, {
                method: "POST",
                headers: {
                  "x-client-id": appId,
                  "x-client-secret": secretKey,
                  "x-api-version": "2023-08-01",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              });

              const data = await cfRes.json();
              res.setHeader("Content-Type", "application/json");
              res.statusCode = cfRes.status;
              res.end(
                JSON.stringify({
                  success: cfRes.ok,
                  payment_session_id: data.payment_session_id,
                  order_id: data.order_id,
                  error: !cfRes.ok ? data : undefined,
                })
              );
            } catch (err: any) {
              res.setHeader("Content-Type", "application/json");
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: err.message }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss(), viteSingleFile(), cashfreeDevPlugin(env)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
