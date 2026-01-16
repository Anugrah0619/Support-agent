function supportAgentReply(text) {
    const msg = text.toLowerCase();
  
    if (msg.includes('app')) {
      return 'Please try restarting the app or reinstalling it.';
    }
  
    if (msg.includes('help')) {
      return 'Sure, I can help you. Please describe your issue.';
    }
  
    return 'Our support team will assist you shortly.';
  }
  
  module.exports = { supportAgentReply };
  