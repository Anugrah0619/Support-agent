const { Hono } = require('hono');
const { serve } = require('@hono/node-server');

const chatRoutes = require('./routes/chat.routes');

const app = new Hono();

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', message: 'Backend is running' });
});

// Chat routes
app.route('/api/chat', chatRoutes);

const port = 3000;

serve({
  fetch: app.fetch,
  port,
});

console.log(`Server running on http://localhost:${port}`);
