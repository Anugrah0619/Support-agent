import type { Message, Payment } from "@support-agent/types";
import { getPaymentByLatestOrder } from "../tools/billing.tool";

export async function handleBillingQuery(
  _message: string,
  context: { userId: number; history: Message[] }
): Promise<string> {
  const payment: Payment | null = await getPaymentByLatestOrder(context.userId);

  if (!payment) {
    return "No payment information was found for your recent order.";
  }

  return `Payment amount: ₹${payment.amount}. Status: ${payment.paymentStatus}. Refund status: ${payment.refundStatus}.`;
}
