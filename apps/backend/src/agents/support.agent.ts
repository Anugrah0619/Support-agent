import { generateText, streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import type { Message } from "@support-agent/types";

/* ---------------- NON-STREAMING ---------------- */
export async function handleSupportQuery(
  message: string,
  context: { history: Message[] }
): Promise<string> {
  const formattedHistory = context.history
    .map((m) => `${m.sender}: ${m.text}`)
    .join("\n");

  const result = await generateText({
    model: groq("llama-3.1-8b-instant"),
    prompt: `
You are a professional customer support agent.

STRICT RULES:
- Assume the user is continuing the SAME issue unless they clearly change topic.
- DO NOT re-ask questions that were already answered earlier.
- Use the conversation history as the source of truth.
- Be concise, specific, and action-oriented.
- If enough information is available, provide steps instead of asking more questions.
- If information is missing, ask ONLY the single most important follow-up question.

Conversation so far:
${formattedHistory}

User message:
${message}

Your response:
`,
  });

  return result.text;
}

/* ---------------- STREAMING ---------------- */
export async function handleSupportQueryStream(
  message: string,
  context: { history: Message[] },
  onToken: (token: string) => void
) {
  const formattedHistory = context.history
    .map((m) => `${m.sender}: ${m.text}`)
    .join("\n");

  const result = await streamText({
    model: groq("llama-3.1-8b-instant"),
    prompt: `
You are a professional customer support agent.

STRICT RULES:
- Assume the user is continuing the SAME issue unless they clearly change topic.
- DO NOT re-ask questions that were already answered earlier.
- Use the conversation history as the source of truth.
- Be concise, specific, and action-oriented.
- If enough information is available, provide steps instead of asking more questions.
- If information is missing, ask ONLY the single most important follow-up question.

Conversation so far:
${formattedHistory}

User message:
${message}

Your response:
`,
  });

  for await (const delta of result.textStream) {
    onToken(delta);
  }
}
