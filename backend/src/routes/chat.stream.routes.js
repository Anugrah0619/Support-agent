const { Hono } = require('hono');
const { streamText } = require('hono/streaming');
const { createMessage } = require('../services/chat.service');

const streamRoutes = new Hono();

streamRoutes.post('/messages/stream', async (c) => {
  const { conversationId, text } = await c.req.json();

  if (!conversationId || !text) {
    return c.text('Invalid request', 400);
  }

  return streamText(c, async (stream) => {
    // Call existing service (reuse logic)
    const result = await createMessage(conversationId, text);

    const replyText =
      result.agentMessage?.text || 'Processing your request...';

    // Simulate typing effect
    for (const char of replyText) {
      await stream.write(char);
      await new Promise((r) => setTimeout(r, 30));
    }

    await stream.close();
  });
});

module.exports = streamRoutes;
