import "dotenv/config";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { rateLimitMiddleware } from "./middlewares/rateLimit.middleware";

/* Existing routes */
import chatRoutes from "./routes/chat.routes";
import chatStreamRoutes from "./routes/chat.stream.routes";
import agentRoutes from "./routes/agent.routes";

/* RPC */
import { chatMessageRoute } from "./rpc/chat.rpc";
import { processChatMessage } from "./services/chat.service";

const app = new OpenAPIHono();

/* ---------------- CORS (FIXED FOR VERCEL + STREAMING) ---------------- */
app.use(
  "*",
  cors({
    origin: (origin) => {
      // Allow server-to-server or curl
      if (!origin) return "*";

      // Allow localhost (dev)
      if (origin.includes("localhost")) return origin;

      // Allow all Vercel deployments (preview + prod)
      if (origin.includes("vercel.app")) return origin;

      return null; // block everything else
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

/* ---------------- RATE LIMIT ---------------- */
app.use("/api/chat/*", rateLimitMiddleware);

/* ---------------- HEALTH ---------------- */
app.get("/api/health", (c) => c.json({ status: "ok" }));

/* ---------------- EXISTING REST ROUTES ---------------- */
app.route("/api/chat", chatRoutes);
app.route("/api/chat", chatStreamRoutes);
app.route("/api/agents", agentRoutes);

/* ---------------- RPC ROUTE (PHASE 3) ---------------- */
app.openapi(chatMessageRoute, async (c) => {
  const body = c.req.valid("json");
  const result = await processChatMessage(body);
  return c.json(result);
});

/* ---------------- SERVER ---------------- */
const port = Number(process.env.PORT) || 3000;

serve({
  fetch: app.fetch,
  port,
});

console.log(`✅ Backend running on port ${port}`);

export default app;
