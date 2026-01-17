import { generateText, streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { getConversationHistory } from "../tools/support.tool";

/* NON-STREAMING (unchanged) */
export async function handleSupportQuery(
  message: string,
  context: { history: any[] }
): Promise<string> {
  const formattedHistory = context.history
    .map((m) => `${m.sender}: ${m.text}`)
    .join("\n");

  const result = await generateText({
    model: groq("llama-3.1-8b-instant"),
    prompt: `
You are a support agent.

Conversation:
${formattedHistory}

User:
${message}
`,
  });

  return result.text;
}

/* STREAMING VERSION (NEW) */
export async function handleSupportQueryStream(
  message: string,
  context: { history: any[] },
  onToken: (token: string) => void
) {
  const formattedHistory = context.history
    .map((m) => `${m.sender}: ${m.text}`)
    .join("\n");

  const result = await streamText({
    model: groq("llama-3.1-8b-instant"),
    prompt: `
You are a support agent.

Conversation:
${formattedHistory}

User:
${message}
`,
  });

  for await (const delta of result.textStream) {
    onToken(delta);
  }
}
