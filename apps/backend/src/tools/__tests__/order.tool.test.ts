import { describe, it, expect, beforeEach } from "vitest";
import prisma from "../../db/prisma";
import { getLatestOrderByUser } from "../order.tool";

const TEST_USER_ID = 101;

describe("Order Tool", () => {
  let latestOrderId: number;

  beforeEach(async () => {
    // 🧹 CLEAN STATE
    await prisma.payment.deleteMany({ where: { userId: TEST_USER_ID } });
    await prisma.order.deleteMany({ where: { userId: TEST_USER_ID } });
    await prisma.user.deleteMany({ where: { id: TEST_USER_ID } });

    // 👤 CREATE TEST USER
    await prisma.user.create({
      data: {
        id: TEST_USER_ID,
        name: "Order Test User",
        email: `order-test-${TEST_USER_ID}@example.com`,
      },
    });

    // 📦 CREATE ORDER
    const order = await prisma.order.create({
      data: {
        userId: TEST_USER_ID,
        status: "shipped",
        placedAt: new Date(),
      },
    });

    latestOrderId = order.id;
  });

  it("returns latest order for user", async () => {
    const order = await getLatestOrderByUser(TEST_USER_ID);

    expect(order).toBeTruthy();
    expect(order?.id).toBe(latestOrderId);
    expect(order?.status).toBe("shipped");
  });
});
