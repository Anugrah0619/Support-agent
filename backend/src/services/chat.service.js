const { prisma } = require('../db/prisma');
const { routeMessage } = require('../agents/router.agent');
const { supportAgentReply } = require('../agents/support.agent');
const { orderAgentReply } = require('../agents/order.agent');
const { billingAgentReply } = require('../agents/billing.agent');

const { getLatestOrderByUser } = require('../tools/order.tool');
const { getPaymentByOrder } = require('../tools/billing.tool');

async function createMessage(conversationId, text) {
  // Save user message
  const userMessage = await prisma.message.create({
    data: {
      conversationId,
      sender: 'user',
      text,
    },
  });

  // Route
  const routedTo = routeMessage(text);

  let agentMessage = null;

  // Get user from conversation
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  const userId = conversation.userId;

  // SUPPORT AGENT
  if (routedTo === 'support') {
    const reply = supportAgentReply(text);

    agentMessage = await prisma.message.create({
      data: {
        conversationId,
        sender: 'agent',
        text: reply,
      },
    });
  }

  // ORDER AGENT
  if (routedTo === 'order') {
    const order = await getLatestOrderByUser(userId);
    const reply = orderAgentReply(order);

    agentMessage = await prisma.message.create({
      data: {
        conversationId,
        sender: 'agent',
        text: reply,
      },
    });
  }

  // BILLING AGENT
  if (routedTo === 'billing') {
    const order = await getLatestOrderByUser(userId);
    const payment = order ? await getPaymentByOrder(order.id) : null;
    const reply = billingAgentReply(payment);

    agentMessage = await prisma.message.create({
      data: {
        conversationId,
        sender: 'agent',
        text: reply,
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
