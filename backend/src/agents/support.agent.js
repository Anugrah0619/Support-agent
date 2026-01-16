function supportAgentReply(text, history) {
    const msg = text.toLowerCase();
  
    if (msg.includes('it') && history.length > 0) {
      return 'Could you please clarify what you are referring to?';
    }
  
    if (msg.includes('app')) {
      return 'Please try restarting the app or reinstalling it.';
    }
  
    return 'Our support team will assist you shortly.';
  }
  
  module.exports = { supportAgentReply };
  