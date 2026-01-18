import prisma from "../db/prisma";
import type { Message } from "@support-agent/types";

import { routeMessage } from "../agents/router.agent";
import { handleSupportQueryStream } from "../agents/support.agent";
import { handleOrderQuery } from "../agents/order.agent";
import { handleBillingQuery } from "../agents/billing.agent";
import { getConversationHistory } from "../tools/conversation.tool";

/**
 * Internal streaming pipeline
 * (used by adapter below)
 */
export async function processChatMessageStream(params: {
  userId: number;
  conversationId?: number;
  message: string;
  onToken: (token: string) => void;
}) {
  const { userId, conversationId, message, onToken } = params;

  const conversation = conversationId
    ? await prisma.conversation.findFirst({
        where: { id: conversationId, userId },
      })
    : await prisma.conversation.create({
        data: { userId },
      });

  if (!conversation) {
    throw new Error("Conversation not found or access denied");
  }

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "user",
      text: message,
    },
  });

  const history: Message[] = await getConversationHistory(conversation.id);
  const route = await routeMessage(message, history);

  let finalReply = "";

  if (route === "support") {
    await handleSupportQueryStream(
      message,
      { history },
      (token) => {
        finalReply += token;
        onToken(token);
      }
    );
  } else if (route === "order") {
    finalReply = await handleOrderQuery(message, { userId, history });
    onToken(finalReply);
  } else if (route === "billing") {
    finalReply = await handleBillingQuery(message, { userId, history });
    onToken(finalReply);
  } else {
    finalReply =
      "This request is not supported. I can help with order status or payment details.";
    onToken(finalReply);
  }

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "agent",
      text: finalReply,
      agentType: route === "unsupported" ? null : route,
    },
  });

  return {
    conversationId: conversation.id,
    reply: finalReply,
    agentType: route,
  };
}

/**
 * PUBLIC ADAPTER
 * This keeps existing controller imports working
 */
export async function streamChatMessage(params: {
  userId: number;
  conversationId?: number;
  message: string;
  onToken: (token: string) => void;
}) {
  return processChatMessageStream(params);
}
