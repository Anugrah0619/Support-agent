import { Hono } from "hono";
import { streamChat } from "../controllers/chat.stream.controller";

const chatStreamRoutes = new Hono();

/**
 * ✅ IMPORTANT
 * Explicitly handle CORS preflight for streaming endpoint
 * Without this, browser OPTIONS request fails before POST /stream
 */
chatStreamRoutes.options("/stream", (c) => {
  return c.body(null, 204);
});

/**
 * Streaming chat endpoint
 */
chatStreamRoutes.post("/stream", streamChat);

export default chatStreamRoutes;
