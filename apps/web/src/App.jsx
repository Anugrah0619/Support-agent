import { useState } from "react";
import "./App.css";

// ✅ USE VITE ENV VARIABLE
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/chat/stream`;

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [reasoning, setReasoning] = useState(null);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage },
    ]);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 1,
          conversationId,
          message: userMessage,
        }),
      });

      if (!response.body) {
        throw new Error("Streaming not supported");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let agentText = "";

      setMessages((prev) => [...prev, { sender: "agent", text: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        if (chunk.includes("[thinking]")) {
          setReasoning("Thinking…");
          continue;
        }

        if (chunk.includes("[checking order]")) {
          setReasoning("Checking your order…");
          continue;
        }

        if (chunk.includes("[checking payment]")) {
          setReasoning("Checking payment details…");
          continue;
        }

        if (chunk.includes("[answering]")) {
          setReasoning("Preparing response…");
          continue;
        }

        setReasoning(null);
        agentText += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            sender: "agent",
            text: agentText,
          };
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      setIsTyping(false);
      setReasoning(null);
    }
  }

  return (
    <div className="chat-container">
      <h2>Support Agent Chat</h2>

      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.sender}`}>
            <strong>{m.sender === "user" ? "You" : "Agent"}:</strong>{" "}
            {m.text}
          </div>
        ))}

        {reasoning && (
          <div className="message agent">
            <em>{reasoning}</em>
          </div>
        )}
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
