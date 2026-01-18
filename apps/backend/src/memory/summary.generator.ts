import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import type { Message } from "@prisma/client";

export async function generateConversationSummary(
  previousSummary: string | null,
  messages: Message[]
): Promise<string> {
  const transcript = messages
    .map((m) => `${m.sender}: ${m.text}`)
    .join("\n");

  const prompt = `
You are summarizing a customer support conversation.

Previous summary:
${previousSummary ?? "None"}

New messages:
${transcript}

Write a concise summary that preserves important facts,
decisions, order/payment state, and unresolved issues.
`;

  const result = await generateText({
    model: groq("llama-3.1-8b-instant"),
    prompt,
  });

  return result.text;
}
