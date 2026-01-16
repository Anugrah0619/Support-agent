const { prisma } = require('../db/prisma');

async function getPaymentByOrder(orderId) {
  return prisma.payment.findFirst({
    where: { orderId },
  });
}

module.exports = { getPaymentByOrder };
