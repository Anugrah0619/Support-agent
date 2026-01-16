function orderAgentReply(order) {
    if (!order) {
      return 'I could not find any order associated with your account.';
    }
  
    return `Your order is currently ${order.status}.`;
  }
  
  module.exports = { orderAgentReply };
  