import prisma from "../db/prisma";

/**
 * Get payment for user's latest order
 */
export async function getPaymentByLatestOrder(userId: number) {
  const latestOrder = await prisma.order.findFirst({
    where: { userId },
    orderBy: { placedAt: "desc" },
  });

  if (!latestOrder) return null;

  return prisma.payment.findFirst({
    where: { orderId: latestOrder.id },
  });
}

/**
 * Get ALL payments for a user
 * Used to decide whether to clarify or route back
 */
export async function getPaymentsByUser(userId: number) {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
