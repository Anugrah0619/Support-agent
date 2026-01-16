const { prisma } = require('../db/prisma');
const { routeMessage } = require('../agents/router.agent');
const { supportAgentReply } = require('../agents/support.agent');

async function createMessage(conversationId, text) {
  // Save user message
  const userMessage = await prisma.message.create({
    data: {
      conversationId,
      sender: 'user',
      text,
    },
  });

  // Route message
  const routedTo = routeMessage(text);

  let agentMessage = null;

  // Call Support Agent
  if (routedTo === 'support') {
    const replyText = supportAgentReply(text);

    agentMessage = await prisma.message.create({
      data: {
        conversationId,
        sender: 'agent',
        text: replyText,
      },
    });
  }

  return {
    routedTo,
    userMessage,
    agentMessage,
  };
}

module.exports = { createMessage };
