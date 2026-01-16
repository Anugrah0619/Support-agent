const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Fallback logic (VERY IMPORTANT)
function fallbackReply(text) {
  const msg = text.toLowerCase();

  if (msg.includes('app')) {
    return 'Please try restarting the app or reinstalling it.';
  }

  if (msg.includes('help')) {
    return 'Sure, I can help you. Please describe your issue.';
  }

  return 'Our support team will assist you shortly.';
}

// Gemini-powered Support Agent
async function supportAgentReply(text, history = []) {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemma-3-1b-it',
    });

    const context = history
      .map((m) => `${m.sender}: ${m.text}`)
      .join('\n');

    const prompt = `
        You are a helpful customer support agent.

        Conversation so far:
        ${context}

        User message:
        ${text}

        Reply concisely and politely.
        `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return response;
  } catch (error) {
    console.error('Gemini failed, using fallback:', error.message);
    return fallbackReply(text);
  }
}

module.exports = { supportAgentReply };
