const { prisma } = require('../db/prisma');

const { routeMessage } = require('../agents/router.agent');
const { supportAgentReply } = require('../agents/support.agent');
const { orderAgentReply } = require('../agents/order.agent');
const { billingAgentReply } = require('../agents/billing.agent');

const { getLatestOrderByUser } = require('../tools/order.tool');
const { getPaymentByOrder } = require('../tools/billing.tool');
const { getConversationHistory } = require('../tools/conversation.tool');

async function createMessage(conversationId, text) {
  // 1. Save user message
  const userMessage = await prisma.message.create({
    data: {
      conversationId,
      sender: 'user',
      text,
    },
  });

  // 2. Fetch conversation history (memory)
  const history = await getConversationHistory(conversationId);

  // 3. Decide which agent to use
  const routedTo = routeMessage(text);

  let agentMessage = null;

  // 4. Get userId from conversation
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  const userId = conversation.userId;

  // 5. SUPPORT AGENT
  if (routedTo === 'support') {
    const replyText = supportAgentReply(text, history);

    agentMessage = await prisma.message.create({
      data: {
        conversationId,
        sender: 'agent',
        text: replyText,
      },
    });
  }

  // 6. ORDER AGENT
  if (routedTo === 'order') {
    const order = await getLatestOrderByUser(userId);
    const replyText = orderAgentReply(order);

    agentMessage = await prisma.message.create({
      data: {
        conversationId,
        sender: 'agent',
        text: replyText,
      },
    });
  }

  // 7. BILLING AGENT
  if (routedTo === 'billing') {
    const order = await getLatestOrderByUser(userId);
    const payment = order ? await getPaymentByOrder(order.id) : null;
    const replyText = billingAgentReply(payment);

    agentMessage = await prisma.message.create({
      data: {
        conversationId,
        sender: 'agent',
        text: replyText,
      },
    });
  }

  // 8. Final response
  return {
    routedTo,
    userMessage,
    agentMessage,
  };
}

module.exports = { createMessage };
