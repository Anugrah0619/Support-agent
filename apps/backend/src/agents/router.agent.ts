import { Message } from "@prisma/client";
import { AgentType } from "./agent.constants";
import { classifyIntent } from "./main.agent";

/**
 * Router Agent
 * - Uses LLM-based intent classification
 * - Applies continuation ONLY when safe
 * - Allows forced fresh intent after ROUTE_BACK
 */
export async function routeMessage(
  message: string,
  history: Message[],
  forceFreshIntent = false
): Promise<AgentType> {
  const text = message.toLowerCase();

  const lastAgentMessage = [...history]
    .reverse()
    .find((m) => m.sender === "agent" && m.agentType);

  // 1️⃣ CONTINUATION (ONLY IF NOT FORCED AND DOMAIN DOES NOT CHANGE)
  if (!forceFreshIntent && lastAgentMessage) {
    const lastAgent = lastAgentMessage.agentType as AgentType;

    if (
      isFollowUp(text) &&
      !mentionsBilling(text) &&
      !mentionsOrder(text)
    ) {
      return lastAgent;
    }
  }

  // 2️⃣ LLM-BASED INTENT CLASSIFICATION (AUTHORITATIVE)
  const intent = await classifyIntent({
    message,
    history: history.map((m) => ({
      sender: m.sender,
      text: m.text,
    })),
  });

  return intent;
}

/* ---------------- HELPERS ---------------- */

function isFollowUp(text: string): boolean {
  const followUps = [
    "is it",
    "has it",
    "when",
    "what about",
    "status",
    "and",
    "then",
    "now",
    "that",
    "it",
  ];
  return followUps.some((f) => text.startsWith(f));
}

function mentionsBilling(text: string): boolean {
  return (
    text.includes("payment") ||
    text.includes("refund") ||
    text.includes("invoice") ||
    text.includes("bill")
  );
}

function mentionsOrder(text: string): boolean {
  return (
    text.includes("order") ||
    text.includes("ship") ||
    text.includes("delivery") ||
    text.includes("tracking")
  );
}
