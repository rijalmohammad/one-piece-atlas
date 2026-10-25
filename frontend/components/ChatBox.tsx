"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { renderMarkdown, TypingDots } from "./Markdown";


interface Message {
  role: "ai" | "user";
  content: string;
}

interface Props {
  locationKey: string;
  greeting: string;
}

export default function ChatBox({ locationKey, greeting }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: greeting },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  // Reset chat when location changes
  useEffect(() => {
    setMessages([{ role: "ai", content: greeting }]);
    setInput("");
  }, [locationKey, greeting]);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage() {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setLoading(true);

    const aiMsgIndex = messages.length + 1;
    setMessages((prev) => [...prev, { role: "ai", content: "" }]);

    try {
      const params = new URLSearchParams({
        location_key: locationKey,
        question: q,
      });
      const res = await fetch(
        `/api/chat?${params}`,
        { method: "GET" }
      );
      if (!res.ok || !res.body) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const current = accumulated;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "ai", content: current };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "ai",
          content: "Sorry, couldn't reach the lore server. Make sure the backend is running.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div className="panel-chat">
      <div className="chat-label">Ask about this location</div>
      <div className="chat-msgs" ref={msgsRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.role}`}>
            <div className={`msg-av ${msg.role === "ai" ? "ai" : "usr"}`}>
              {msg.role === "ai" ? "🐌" : "U"}
            </div>
            <div className="bubble">
              {msg.role === "ai" ? renderMarkdown(msg.content) : msg.content}
              {loading && i === messages.length - 1 && msg.role === "ai" && msg.content === "" && (
                <TypingDots />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input-row">
        <input
          className="chat-input"
          type="text"
          placeholder="Ask a question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          disabled={loading}
        />
        <button
          className="send-btn"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          aria-label="Send"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
