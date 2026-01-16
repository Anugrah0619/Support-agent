const { prisma } = require('../db/prisma');
const { routeMessage } = require('../agents/router.agent');

async function createMessage(conversationId, text) {
  // Save user message
  const userMessage = await prisma.message.create({
    data: {
      conversationId,
      sender: 'user',
      text,
    },
  });

  // Decide which agent should handle it
  const agentType = routeMessage(text);

  return {
    userMessage,
    routedTo: agentType,
  };
}

module.exports = { createMessage };
