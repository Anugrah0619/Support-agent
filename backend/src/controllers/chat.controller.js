const { createMessage } = require('../services/chat.service');

async function sendMessage(c) {
  const body = await c.req.json();
  const { conversationId, text } = body;

  if (!conversationId || !text) {
    return c.json(
      { error: 'conversationId and text are required' },
      400
    );
  }

  const result = await createMessage(conversationId, text);

  return c.json({
    success: true,
    routedTo: result.routedTo,
    message: result.userMessage,
  });
}

module.exports = { sendMessage };
