import { Hono } from "hono";
import {
  listAgents,
  agentCapabilities,
} from "../controllers/agent.controller";

const app = new Hono();

app.get("/", listAgents);
app.get("/:type/capabilities", agentCapabilities);

export default app;
