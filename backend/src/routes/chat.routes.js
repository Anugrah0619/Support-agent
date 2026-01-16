const { Hono } = require('hono');
const { sendMessage } = require('../controllers/chat.controller');

const chatRoutes = new Hono();

chatRoutes.post('/messages', sendMessage);

module.exports = chatRoutes;
