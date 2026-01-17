import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { AgentType } from "./agent.constants";

/**
 * Main Agent (LLM-based Intent Classifier)
 *
 * IMPORTANT RULES:
 * - Must return EXACTLY one label: "support" | "order" | "billing"
 * - No free text, no explanations
 * - Uses conversation context to resolve vague phrasing
 */
export async function classifyIntent(params: {
  message: string;
  history: { sender: string; text: string }[];
}): Promise<AgentType> {
  const { message, history } = params;

  const context = history
    .slice(-6)
    .map((m) => `${m.sender}: ${m.text}`)
    .join("\n");

  const result = await generateText({
    model: groq("llama-3.1-8b-instant"),
    temperature: 0,
    prompt: `
You are an intent classifier for a customer support system.

Your task:
- Classify the user's intent into EXACTLY ONE of:
  - support
  - order
  - billing

Guidelines:
- "order": order status, shipping, delivery, tracking, cancellations
- "billing": payment, refund, invoice, charges, transactions
- "support": general help, FAQs, unclear or mixed questions

Conversation context:
${context || "(no prior context)"}

User message:
"${message}"

Respond with ONLY one word:
support OR order OR billing
`,
  });

  const label = result.text.trim().toLowerCase();

  if (label === "order" || label === "billing") {
    return label;
  }

  return "support";
}
