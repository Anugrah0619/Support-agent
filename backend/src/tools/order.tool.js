const { prisma } = require('../db/prisma');

async function getLatestOrderByUser(userId) {
  return prisma.order.findFirst({
    where: { userId },
    orderBy: { id: 'desc' },
  });
}

module.exports = { getLatestOrderByUser };

