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

/* ---------------- CORS ---------------- */
app.use(
  "/*",
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
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
serve({
  fetch: app.fetch,
  port: 3000,
});

console.log("✅ Backend running on http://localhost:3000");

export default app;
