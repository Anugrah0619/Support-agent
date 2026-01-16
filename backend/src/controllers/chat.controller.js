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

  const message = await createMessage(conversationId, text);

  return c.json({
    success: true,
    message,
  });
}

module.exports = { sendMessage };
