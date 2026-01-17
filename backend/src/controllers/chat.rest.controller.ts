import prisma from "../db/prisma";

export async function listConversations(c) {
  const userId = Number(c.req.query("userId"));
  const conversations = await prisma.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  return c.json(conversations);
}

export async function getConversation(c) {
  const id = Number(c.req.param("id"));
  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
  });
  return c.json(messages);
}

export async function deleteConversation(c) {
  const id = Number(c.req.param("id"));
  await prisma.message.deleteMany({ where: { conversationId: id } });
  await prisma.conversation.delete({ where: { id } });
  return c.json({ success: true });
}
