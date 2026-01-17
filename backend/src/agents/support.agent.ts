import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { Message } from "@prisma/client";

type SupportContext = {
  history: Message[];
};

/**
 * Support Agent
 * Uses conversation history passed from service layer
 */
export async function handleSupportQuery(
  message: string,
  context: SupportContext
): Promise<string> {
  const { history } = context;

  const formattedHistory = history
    .map((m) => `${m.sender}: ${m.text}`)
    .join("\n");

  const result = await generateText({
    model: groq("llama-3.1-8b-instant"),
    prompt: `
You are a customer support agent.

Conversation so far:
${formattedHistory}

User message:
"${message}"

Guidelines:
- Use conversation history to resolve references like "it", "that", "as I said"
- If the query is unclear, ask a clarification
- Do NOT hallucinate data
- Be concise and polite
`,
  });

  return result.text;
}
