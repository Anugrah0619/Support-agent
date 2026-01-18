export async function listAgents(c) {
  return c.json([
    { type: "support", description: "General support and FAQs" },
    { type: "order", description: "Order tracking and delivery" },
    { type: "billing", description: "Payments, refunds, invoices" },
  ]);
}

export async function agentCapabilities(c) {
  const type = c.req.param("type");

  const capabilities = {
    support: {
      tools: ["getConversationHistory"],
    },
    order: {
      tools: ["getLatestOrderByUser"],
    },
    billing: {
      tools: ["getPaymentByOrderId"],
    },
  };

  return c.json(capabilities[type] || {});
}
