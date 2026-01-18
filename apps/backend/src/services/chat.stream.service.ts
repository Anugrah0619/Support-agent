import prisma from "../db/prisma";
import type { Message } from "@support-agent/types";
import { generateConversationSummary } from "../memory/summary.generator";

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

  /* ---------------- CONVERSATION ---------------- */
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

  /* ---------------- SAVE USER MESSAGE ---------------- */
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "user",
      text: message,
    },
  });

  /* ---------------- LOAD HISTORY ---------------- */
  const history: Message[] = await getConversationHistory(conversation.id);

  /* ---------------- CONTEXT COMPACTION ---------------- */
  const MAX_MESSAGES = 10;
  let effectiveHistory = history;

  if (history.length > MAX_MESSAGES) {
    const oldMessages = history.slice(0, history.length - MAX_MESSAGES);
    const recentMessages = history.slice(-MAX_MESSAGES);

    const summary = await generateConversationSummary(
      conversation.summary ?? "",
      oldMessages
    );

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { summary },
    });

    effectiveHistory = recentMessages;
  }

  /* ---------------- ROUTING ---------------- */
  const route = await routeMessage(message, effectiveHistory);
  onToken("[thinking]");

  let finalReply = "";

  /* ---------------- AGENT EXECUTION ---------------- */
  if (route === "support") {
    onToken("[answering]");

    await handleSupportQueryStream(
      message,
      {
        history: [
          ...(conversation.summary
            ? [{ sender: "system", text: conversation.summary }]
            : []),
          ...effectiveHistory,
        ],
      },
      (token) => {
        finalReply += token;
        onToken(token);
      }
    );
  } else if (route === "order") {
    onToken("[checking order]");
    finalReply = await handleOrderQuery(message, {
      userId,
      history: effectiveHistory,
    });
    onToken(finalReply);
  } else if (route === "billing") {
    onToken("[checking payment]");
    finalReply = await handleBillingQuery(message, {
      userId,
      history: effectiveHistory,
    });
    onToken(finalReply);
  } else {
    onToken("[answering]");
    finalReply =
      "This request is not supported. I can help with order status or payment details.";
    onToken(finalReply);
  }

  /* ---------------- SAVE AGENT MESSAGE ---------------- */
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
 * Keeps existing controller imports working
 */
export async function streamChatMessage(params: {
  userId: number;
  conversationId?: number;
  message: string;
  onToken: (token: string) => void;
}) {
  return processChatMessageStream(params);
}
