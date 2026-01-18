import { generateText, streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { getPaymentByLatestOrder } from "../tools/billing.tool";

/* NON-STREAMING */
export async function handleBillingQuery(
  message: string,
  context: { userId: number; history: any[] }
): Promise<string> {
  const payment = await getPaymentByLatestOrder(context.userId);

  if (!payment) return "No payment information found.";

  return `Your payment of ₹${payment.amount} is ${payment.paymentStatus}. Refund status: ${payment.refundStatus}.`;
}

/* STREAMING */
export async function handleBillingQueryStream(
  message: string,
  context: { userId: number; history: any[] },
  onToken: (token: string) => void
) {
  const payment = await getPaymentByLatestOrder(context.userId);

  const text = payment
    ? `Your payment of ₹${payment.amount} is ${payment.paymentStatus}. Refund status: ${payment.refundStatus}.`
    : "No payment information found.";

  const result = await streamText({
    model: groq("llama-3.1-8b-instant"),
    prompt: text,
  });

  for await (const delta of result.textStream) {
    onToken(delta);
  }
}
