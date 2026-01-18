import type {
    ChatMessageRequest,
    ChatMessageResponse,
  } from "@support-agent/api";
  
  export async function sendChatMessage(
    data: ChatMessageRequest
  ): Promise<ChatMessageResponse> {
    const res = await fetch("http://localhost:3000/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      throw new Error("Request failed");
    }
  
    return res.json();
  }
  