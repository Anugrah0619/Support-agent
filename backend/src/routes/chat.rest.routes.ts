import { Hono } from "hono";
import {
  listConversations,
  getConversation,
  deleteConversation,
} from "../controllers/chat.rest.controller";

const app = new Hono();

app.get("/conversations", listConversations);
app.get("/conversations/:id", getConversation);
app.delete("/conversations/:id", deleteConversation);

export default app;
