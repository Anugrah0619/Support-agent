import { Hono } from "hono";
import { processChatMessage } from "../services/chat.service";

const app = new Hono();

app.post("/stream", async (c) => {
  const body = await c.req.json();

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(new TextEncoder().encode("[typing]\n"));

      const result = await processChatMessage(body);

      controller.enqueue(
        new TextEncoder().encode(result.reply)
      );

      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain" },
  });
});

export default app;
