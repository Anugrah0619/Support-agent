import prisma from "../db/prisma";

/**
 * Fetch recent conversation messages
 * Used by router + agents to resolve context like:
 * "it", "that order", "as I said before"
 */
export async function getConversationHistory(
  conversationId: number,
  limit = 10
) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: limit,
    select: {
      sender: true,
      text: true,
      agentType: true,
    },
  });
}
