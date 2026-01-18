import prisma from "../db/prisma";
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

  // 1️⃣ Ensure conversation exists (RBAC enforced)
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

  // 2️⃣ Save user message
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "user",
      text: message,
    },
  });

  // 3️⃣ Load conversation history ONCE (source of truth)
  const history = await getConversationHistory(conversation.id);

  // 🛡️ Safety guard (prevents your exact crash)
  if (!history || !Array.isArray(history)) {
    throw new Error("Conversation history missing");
  }

  // 4️⃣ Decide agent
  const agentType = await routeMessage(message, history);

  let reply = "";

  // 5️⃣ Delegate with CORRECT context
  switch (agentType) {
    case "order":
      reply = await handleOrderQuery(message, {
        userId,
        history,
      });
      break;

    case "billing":
      reply = await handleBillingQuery(message, {
        userId,
        history,
      });
      break;

    case "support":
    default:
      reply = await handleSupportQuery(message, {
        history,
      });
      break;
  }

  // 6️⃣ Save agent reply
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "agent",
      text: reply,
      agentType,
    },
  });

  return {
    conversationId: conversation.id,
    reply,
    agentType,
  };
}
