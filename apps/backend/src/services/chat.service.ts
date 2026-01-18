import prisma from "../db/prisma";
import type { Message } from "@support-agent/types";

import { routeMessage } from "../agents/router.agent";
import { handleSupportQuery } from "../agents/support.agent";
import { handleOrderQuery } from "../agents/order.agent";
import { handleBillingQuery } from "../agents/billing.agent";
import { getConversationHistory } from "../tools/conversation.tool";

export async function processChatMessage(params: {
  userId: number;
  conversationId?: number;
  message: string;
}) {
  const { userId, conversationId, message } = params;

  const conversation = conversationId
    ? await prisma.conversation.findFirst({ where: { id: conversationId, userId } })
    : await prisma.conversation.create({ data: { userId } });

  if (!conversation) throw new Error("Conversation access denied");

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "user",
      text: message,
    },
  });

  const history: Message[] = await getConversationHistory(conversation.id);

  const route = await routeMessage(message, history);

  let reply = "";

  if (route === "unsupported") {
    reply =
      "Order cancellation or return is not supported at the moment. I can help you with order status or payment details.";
  } else {
    switch (route) {
      case "order":
        reply = await handleOrderQuery(message, { userId, history });
        break;
      case "billing":
        reply = await handleBillingQuery(message, { userId, history });
        break;
      default:
        reply = await handleSupportQuery(message, { history });
    }
  }

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "agent",
      text: reply,
      agentType: route === "unsupported" ? null : route,
    },
  });

  return {
    conversationId: conversation.id,
    reply,
    agentType: route,
  };
}
