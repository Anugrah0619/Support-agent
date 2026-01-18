import { z } from "zod";
import { createRoute } from "@hono/zod-openapi";
import { processChatMessage } from "../services/chat.service";

/**
 * RPC route definition for chat message
 * This defines BOTH runtime validation and TypeScript types
 */
export const chatMessageRoute = createRoute({
  method: "post",
  path: "/rpc/chat/message",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            userId: z.number(),
            conversationId: z.number().optional(),
            message: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Chat response",
      content: {
        "application/json": {
          schema: z.object({
            conversationId: z.number(),
            reply: z.string(),
            agentType: z.enum(["support", "order", "billing"]),
          }),
        },
      },
    },
  },
});
