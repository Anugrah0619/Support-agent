import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import {
  getPaymentByLatestOrder,
  getPaymentsByUser,
} from "../tools/billing.tool";
import { ROUTE_BACK } from "./agent.constants";

type BillingContext = {
  userId: number;
  history: { sender: string; text: string }[];
};

export async function handleBillingQuery(
  message: string,
  context: BillingContext
): Promise<string> {
  // 1️⃣ Try latest order payment first
  const latestPayment = await getPaymentByLatestOrder(context.userId);

  // 2️⃣ If no payment for latest order, check if user has ANY payments
  if (!latestPayment) {
    const allPayments = await getPaymentsByUser(context.userId);

    if (allPayments.length > 0) {
      return "I see multiple payments on your account. Could you tell me which order or invoice you are asking about?";
    }

    // Only ROUTE_BACK if user truly has no billing data
    return "I couldn’t find any payment records for your account yet.";
  }

  // 3️⃣ Answer using real data
  return `Your payment of ₹${latestPayment.amount} is currently marked as "${latestPayment.paymentStatus}". Refund status: ${latestPayment.refundStatus}.`;
}
