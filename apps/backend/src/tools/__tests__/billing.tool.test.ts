import { describe, it, expect, beforeEach } from "vitest";
import prisma from "../../db/prisma";
import { getPaymentByLatestOrder } from "../billing.tool";

const TEST_USER_ID = 202;

describe("Billing Tool", () => {
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
        name: "Billing Test User",
        email: `billing-test-${TEST_USER_ID}@example.com`,
      },
    });

    // 📦 CREATE ORDER
    const order = await prisma.order.create({
      data: {
        userId: TEST_USER_ID,
        status: "delivered",
        placedAt: new Date(),
      },
    });

    latestOrderId = order.id;

    // 💳 CREATE PAYMENT
    await prisma.payment.create({
      data: {
        userId: TEST_USER_ID,
        orderId: latestOrderId,
        amount: 999,
        paymentStatus: "paid",
        refundStatus: "none",
      },
    });
  });

  it("returns payment info for latest order", async () => {
    const payment = await getPaymentByLatestOrder(TEST_USER_ID);

    expect(payment).toBeTruthy();
    expect(payment?.orderId).toBe(latestOrderId);
    expect(payment?.amount).toBe(999);
    expect(payment?.paymentStatus).toBe("paid");
    expect(payment?.refundStatus).toBe("none");
  });
});
