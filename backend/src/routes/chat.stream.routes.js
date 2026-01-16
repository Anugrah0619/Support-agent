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
    // 1. Notify typing start
    await stream.write('[typing:start]\n');

    // Small delay to simulate thinking
    await new Promise((r) => setTimeout(r, 500));

    // 2. Process message normally
    const result = await createMessage(conversationId, text);
    const replyText =
      result.agentMessage?.text || 'Processing your request...';

    // 3. Stream reply character by character
    for (const char of replyText) {
      await stream.write(char);
      await new Promise((r) => setTimeout(r, 30));
    }

    // 4. Notify typing end
    await stream.write('\n[typing:end]');
    await stream.close();
  });
});

module.exports = streamRoutes;
