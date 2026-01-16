const { Hono } = require('hono');
const { serve } = require('@hono/node-server');

// Existing routes
const chatRoutes = require('./routes/chat.routes');

// New streaming routes (optional feature)
const chatStreamRoutes = require('./routes/chat.stream.routes');

const app = new Hono();

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    message: 'Backend is running',
  });
});

// Normal chat API (non-streaming)
app.route('/api/chat', chatRoutes);

// Streaming chat API
app.route('/api/chat', chatStreamRoutes);

const port = 3000;

// Start server
serve({
  fetch: app.fetch,
  port,
});

console.log(`Server running on http://localhost:${port}`);
