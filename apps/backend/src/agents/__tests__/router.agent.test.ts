import { describe, it, expect, vi } from "vitest";
import { routeMessage } from "../router.agent";

// 👇 MOCK the LLM classifier
vi.mock("../main.agent", () => ({
  classifyIntent: vi.fn().mockResolvedValue("support"),
}));

describe("Router Agent", () => {
  it("routes order-related queries to order agent", async () => {
    const history: any[] = [];
    const agent = await routeMessage("Where is my order?", history);
    expect(agent).toBe("order");
  });

  it("routes billing-related queries to billing agent", async () => {
    const history: any[] = [];
    const agent = await routeMessage("What is my payment status?", history);
    expect(agent).toBe("billing");
  });

  it("routes general queries to support agent", async () => {
    const history: any[] = [];
    const agent = await routeMessage("I need help", history);
    expect(agent).toBe("support");
  });
});
