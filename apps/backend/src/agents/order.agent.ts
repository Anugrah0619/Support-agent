import { generateText, streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { getLatestOrderByUser } from "../tools/order.tool";

/* NON-STREAMING */
export async function handleOrderQuery(
  message: string,
  context: { userId: number; history: any[] }
): Promise<string> {
  const order = await getLatestOrderByUser(context.userId);

  if (!order) return "I couldn't find any order.";

  return `Your order is ${order.status}. Delivery date is ${
    order.deliveryDate ?? "not scheduled"
  }.`;
}

/* STREAMING */
export async function handleOrderQueryStream(
  message: string,
  context: { userId: number; history: any[] },
  onToken: (token: string) => void
) {
  const order = await getLatestOrderByUser(context.userId);

  const text = order
    ? `Your order is ${order.status}. Delivery date is ${
        order.deliveryDate ?? "not scheduled"
      }.`
    : "I couldn't find any order.";

  const result = await streamText({
    model: groq("llama-3.1-8b-instant"),
    prompt: text,
  });

  for await (const delta of result.textStream) {
    onToken(delta);
  }
}
