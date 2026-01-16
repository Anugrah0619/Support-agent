const { Hono } = require('hono');
const { serve } = require('@hono/node-server');

const app = new Hono();

// Health check route
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    message: 'Backend is running',
  });
});

const port = 3000;

serve({
  fetch: app.fetch,
  port,
});

console.log(`Server running on http://localhost:${port}`);
