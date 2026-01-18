import { Context } from "hono";
import prisma from "../db/prisma";
import { processChatMessage } from "../services/chat.service";

/**
 * POST /api/chat/messages
 */
export async function sendMessage(c: Context) {
  const body = await c.req.json();
  const { userId, conversationId, message } = body;

  if (!userId || !message) {
    return c.json({ error: "Invalid request body" }, 400);
  }

  const result = await processChatMessage({
    userId,
    conversationId,
    message,
  });

  return c.json(result);
}

/**
 * GET /api/chat/conversations?userId=1
 */
export async function listConversations(c: Context) {
  const userId = Number(c.req.query("userId"));

  if (!userId) {
    return c.json({ error: "userId is required" }, 400);
  }

  const conversations = await prisma.conversation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return c.json(conversations);
}

/**
 * GET /api/chat/conversations/:id?userId=1
 */
export async function getConversationById(c: Context) {
  const conversationId = Number(c.req.param("id"));
  const userId = Number(c.req.query("userId"));

  if (!conversationId || !userId) {
    return c.json({ error: "Invalid request" }, 400);
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conversation) {
    return c.json({ error: "Conversation not found" }, 404);
  }

  return c.json(conversation.messages);
}

/**
 * DELETE /api/chat/conversations/:id?userId=1
 */
export async function deleteConversation(c: Context) {
  const conversationId = Number(c.req.param("id"));
  const userId = Number(c.req.query("userId"));

  if (!conversationId || !userId) {
    return c.json({ error: "Invalid request" }, 400);
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, userId },
  });

  if (!conversation) {
    return c.json({ error: "Conversation not found" }, 404);
  }

  await prisma.conversation.delete({
    where: { id: conversationId },
  });

  return c.json({ success: true });
}
