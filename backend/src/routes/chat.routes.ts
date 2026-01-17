import { Hono } from "hono";
import {
  sendMessage,
  listConversations,
  getConversationById,
  deleteConversation,
} from "../controllers/chat.controller";

const router = new Hono();

// POST /api/chat/messages
router.post("/messages", (c) => sendMessage(c));

// GET /api/chat/conversations?userId=1
router.get("/conversations", (c) => listConversations(c));

// GET /api/chat/conversations/:id?userId=1
router.get("/conversations/:id", (c) => getConversationById(c));

// DELETE /api/chat/conversations/:id?userId=1
router.delete("/conversations/:id", (c) => deleteConversation(c));

export default router;
