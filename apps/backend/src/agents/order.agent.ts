import type { Message, Order } from "@support-agent/types";
import { getLatestOrderByUser } from "../tools/order.tool";

export async function handleOrderQuery(
  _message: string,
  context: { userId: number; history: Message[] }
): Promise<string> {
  const order: Order | null = await getLatestOrderByUser(context.userId);

  if (!order) {
    return "I could not find any order associated with your account.";
  }

  return `Your order is currently ${order.status}. ${
    order.deliveryDate
      ? `Expected delivery date is ${order.deliveryDate}.`
      : "Delivery date has not been scheduled yet."
  }`;
}
