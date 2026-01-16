function billingAgentReply(payment) {
    if (!payment) {
      return 'I could not find any payment information for your order.';
    }
  
    return `Your payment status is ${payment.status}.`;
  }
  
  module.exports = { billingAgentReply };
  