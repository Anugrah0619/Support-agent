const { prisma } = require('../db/prisma');

async function getConversationHistory(conversationId, limit = 5) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    take: limit,
  });
}

module.exports = { getConversationHistory };
