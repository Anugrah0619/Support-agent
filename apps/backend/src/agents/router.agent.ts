import type { Message, AgentType } from "@support-agent/types";
import { classifyIntent } from "./main.agent";

type RouteResult = AgentType | "unsupported";

export async function routeMessage(
  message: string,
  history: Message[],
  forceFreshIntent = false
): Promise<RouteResult> {
  const text = message.toLowerCase();

  /* -------------------------------
     1️⃣ HARD BLOCK UNSUPPORTED INTENTS
  -------------------------------- */
  if (mentionsReturn(text) || mentionsCancel(text)) {
    return "unsupported";
  }

  /* -------------------------------
     2️⃣ STRONG KEYWORD ROUTING
  -------------------------------- */
  if (mentionsBilling(text)) return "billing";
  if (mentionsOrder(text)) return "order";

  /* -------------------------------
     3️⃣ CONTINUATION LOGIC
  -------------------------------- */
  const lastAgentMessage = [...history]
    .reverse()
    .find((m) => m.sender === "agent" && m.agentType);

  if (!forceFreshIntent && lastAgentMessage && isFollowUp(text)) {
    return lastAgentMessage.agentType as AgentType;
  }

  /* -------------------------------
     4️⃣ LLM FALLBACK
  -------------------------------- */
  return classifyIntent({
    message,
    history: history.map((m) => ({
      sender: m.sender,
      text: m.text,
    })),
  });
}

/* ---------------- HELPERS ---------------- */

function mentionsOrder(text: string) {
  return (
    text.includes("order") ||
    text.includes("shipment") ||
    text.includes("delivery") ||
    text.includes("tracking")
  );
}

function mentionsBilling(text: string) {
  return (
    text.includes("payment") ||
    text.includes("refund") ||
    text.includes("invoice")
  );
}

function mentionsReturn(text: string) {
  return text.includes("return");
}

function mentionsCancel(text: string) {
  return text.includes("cancel");
}

function isFollowUp(text: string) {
  return (
    text.startsWith("is it") ||
    text.startsWith("when") ||
    text.startsWith("what about") ||
    text === "it"
  );
}
