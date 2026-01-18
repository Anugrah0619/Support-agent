export type ChatMessageRequest = {
    userId: number;
    conversationId?: number;
    message: string;
  };
  
  export type ChatMessageResponse = {
    conversationId: number;
    reply: string;
    agentType: "support" | "order" | "billing";
  };
  