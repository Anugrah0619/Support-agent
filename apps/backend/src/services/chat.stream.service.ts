import prisma from "../db/prisma";
import { routeMessage } from "../agents/router.agent";
import { getConversationHistory } from "../tools/conversation.tool";

import { handleSupportQueryStream } from "../agents/support.agent";
import { handleOrderQueryStream } from "../agents/order.agent";
import { handleBillingQueryStream } from "../agents/billing.agent";

type Params = {
  userId: number;
  conversationId?: number;
  message: string;
  onToken: (chunk: string) => void;
};

export async function streamChatMessage({
  userId,
  conversationId,
  message,
  onToken,
}: Params) {
  const conversation = conversationId
    ? await prisma.conversation.findUnique({ where: { id: conversationId } })
    : await prisma.conversation.create({ data: { userId } });

  if (!conversation) throw new Error("Conversation not found");

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "user",
      text: message,
    },
  });

  // Typing indicator
  onToken("[agent_typing]\n");

  const history = await getConversationHistory(conversation.id);
  const agentType = await routeMessage(message, history);

  let finalReply = "";

  const stream = (token: string) => {
    finalReply += token;
    onToken(token);
  };

  if (agentType === "order") {
    await handleOrderQueryStream(message, { userId, history }, stream);
  } else if (agentType === "billing") {
    await handleBillingQueryStream(message, { userId, history }, stream);
  } else {
    await handleSupportQueryStream(message, { history }, stream);
  }

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      sender: "agent",
      agentType,
      text: finalReply,
    },
  });
}
