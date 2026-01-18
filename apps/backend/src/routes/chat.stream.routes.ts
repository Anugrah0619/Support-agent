import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamChat } from "../controllers/chat.stream.controller";

const chatStreamRoutes = new Hono();

/**
 * ✅ CORS MUST be applied here
 * Nested routers do NOT inherit global middleware
 */
chatStreamRoutes.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return "*";
      if (origin.includes("vercel.app")) return origin;
      if (origin.includes("localhost")) return origin;
      return null;
    },
    allowMethods: ["POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * ✅ Explicit preflight handler
 */
chatStreamRoutes.options("/stream", (c) => c.body(null, 204));

/**
 * Streaming endpoint
 */
chatStreamRoutes.post("/stream", streamChat);

export default chatStreamRoutes;
