import 'dotenv/config';
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";

import chatRoutes from "./routes/chat.routes";
import chatStreamRoutes from "./routes/chat.stream.routes";
import agentRoutes from "./routes/agent.routes";

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "http://localhost:5173",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

app.get("/api/health", (c) => c.json({ status: "ok" }));

app.route("/api/chat", chatRoutes);
app.route("/api/chat", chatStreamRoutes);
app.route("/api/agents", agentRoutes);

/* 🔴 THIS WAS MISSING */
serve({
  fetch: app.fetch,
  port: 3000,
});

console.log("✅ Backend running on http://localhost:3000");

export default app;
