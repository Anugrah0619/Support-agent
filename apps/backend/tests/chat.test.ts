import { describe, it, expect } from "vitest";
import app from "../src/app";

describe("Chat API Integration", () => {
  it("should create a conversation and store messages", async () => {
    const res = await app.request("/api/chat/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: 1,
        message: "Where is my order?",
      }),
    });

    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data).toHaveProperty("conversationId");
    expect(data).toHaveProperty("reply");
    expect(typeof data.reply).toBe("string");
  });
});
