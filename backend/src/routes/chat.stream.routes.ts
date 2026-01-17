import { Hono } from "hono";
import { streamChat } from "../controllers/chat.stream.controller";

const chatStreamRoutes = new Hono();

chatStreamRoutes.post("/stream", streamChat);

export default chatStreamRoutes;
