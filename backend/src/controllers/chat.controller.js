const { createMessage } = require('../services/chat.service');

async function sendMessage(c) {
  const { conversationId, text } = await c.req.json();

  if (!conversationId || !text) {
    return c.json({ error: 'conversationId and text required' }, 400);
  }

  const result = await createMessage(conversationId, text);

  return c.json({
    success: true,
    routedTo: result.routedTo,
    userMessage: result.userMessage,
    agentMessage: result.agentMessage,
  });
}

module.exports = { sendMessage };
