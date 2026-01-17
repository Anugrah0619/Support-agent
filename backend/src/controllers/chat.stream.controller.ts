import { Context } from "hono";
import { streamChatMessage } from "../services/chat.stream.service";

export async function streamChat(c: Context) {
  const body = await c.req.json();
  const { userId, conversationId, message } = body;

  if (!userId || !message) {
    return c.json({ error: "Invalid payload" }, 400);
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const send = (chunk: string) => {
        controller.enqueue(encoder.encode(chunk));
      };

      try {
        await streamChatMessage({
          userId,
          conversationId,
          message,
          onToken: send,
        });
      } catch (err) {
        send("\n[error] Something went wrong");
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
