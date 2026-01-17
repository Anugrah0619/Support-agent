import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3000/api/chat/stream";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setLoading(true);

    // Add user message
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
          userId: 1, // demo user (as per assessment)
          conversationId,
          message: userMessage,
        }),
      });

      if (!response.body) {
        throw new Error("Streaming not supported by browser");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let agentText = "";

      // Add empty agent message placeholder
      setMessages((prev) => [
        ...prev,
        { sender: "agent", text: "" },
      ]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        // Typing indicator
        if (chunk.includes("[agent_typing]")) {
          setIsTyping(true);
          continue;
        }

        setIsTyping(false);
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

        {isTyping && (
          <div className="message agent">
            <em>Agent is typing...</em>
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
