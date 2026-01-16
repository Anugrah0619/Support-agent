const { prisma } = require('../db/prisma');

async function createMessage(conversationId, text) {
  const message = await prisma.message.create({
    data: {
      conversationId,
      sender: 'user',
      text,
    },
  });

  return message;
}

module.exports = { createMessage };
