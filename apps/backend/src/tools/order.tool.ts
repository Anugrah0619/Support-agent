import prisma from "../db/prisma";

/**
 * Fetch latest order for a user
 */
export async function getLatestOrderByUser(userId: number) {
  return prisma.order.findFirst({
    where: { userId },
    orderBy: { placedAt: "desc" },
  });
}

/**
 * Fetch delivery status for an order
 * (kept separate for clarity + extensibility)
 */
export async function getDeliveryStatus(orderId: number) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      status: true,
      deliveryDate: true,
    },
  });

  if (!order) return null;

  return {
    status: order.status,
    deliveryDate: order.deliveryDate,
  };
}
