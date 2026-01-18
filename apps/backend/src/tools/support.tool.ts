import prisma from "../db/prisma";

export async function getConversationHistory(conversationId: number) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}
