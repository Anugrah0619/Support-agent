import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { ROUTE_BACK } from "./agent.constants";
import {
  getLatestOrderByUser,
  getDeliveryStatus,
} from "../tools/order.tool";

type OrderContext = {
  userId: number;
  history: { sender: string; text: string }[];
};

/**
 * Order Agent
 * Handles order status, shipping, delivery
 */
export async function handleOrderQuery(
  message: string,
  context: OrderContext
): Promise<string> {
  const text = message.toLowerCase();

  // 1️⃣ SCOPE GUARD (VERY IMPORTANT)
  if (
    text.includes("payment") ||
    text.includes("refund") ||
    text.includes("invoice") ||
    text.includes("bill")
  ) {
    return ROUTE_BACK;
  }

  // 2️⃣ FETCH ORDER DATA
  const order = await getLatestOrderByUser(context.userId);

  if (!order) {
    return "I couldn’t find any orders for you.";
  }

  const deliveryStatus = await getDeliveryStatus(order.id);

  // 3️⃣ FORMAT CONTEXT
  const historyText = context.history
    .map((m) => `${m.sender}: ${m.text}`)
    .join("\n");

  // 4️⃣ LLM RESPONSE (GROUNDING ONLY)
  const result = await generateText({
    model: groq("llama-3.1-8b-instant"),
    prompt: `
You are an order support agent.

Conversation so far:
${historyText}

Order details:
- Status: ${order.status}
- Delivery date: ${deliveryStatus ?? "Not scheduled"}

User question:
"${message}"

Rules:
- Answer ONLY using order data above
- If delivery date is missing, say it is not scheduled yet
- Be concise and factual
`,
  });

  return result.text;
}
