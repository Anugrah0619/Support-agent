import { Hono } from "hono";
import { cors } from "hono/cors";

import chatRoutes from "./routes/chat.routes";
import chatRestRoutes from "./routes/chat.rest.routes";
import chatStreamRoutes from "./routes/chat.stream.routes";
import agentRoutes from "./routes/agent.routes";

const app = new Hono();

/**
 * ✅ CORS FIX
 */
app.use(
  "/*",
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// Health check
app.get("/api/health", (c) => c.json({ status: "ok" }));

// Chat APIs
app.route("/api/chat", chatRoutes);       // POST /messages
app.route("/api/chat", chatRestRoutes);   // GET/DELETE conversations
app.route("/api/chat", chatStreamRoutes); // POST /stream

// Agent APIs
app.route("/api/agents", agentRoutes);

export default app;
