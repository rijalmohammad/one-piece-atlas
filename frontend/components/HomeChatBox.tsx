"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";

interface Message {
  role: "ai" | "user";
  content: string;
}

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  function flushList() {
    if (!listItems.length) return;
    elements.push(
      <ul key={elements.length}>
        {listItems.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: boldify(item) }} />
        ))}
      </ul>
    );
    listItems = [];
  }

  function boldify(s: string) {
    return s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[\*\-]\s+/.test(trimmed)) {
      listItems.push(trimmed.replace(/^[\*\-]\s+/, ""));
    } else {
      flushList();
      if (trimmed) {
        elements.push(
          <p key={elements.length} dangerouslySetInnerHTML={{ __html: boldify(trimmed) }} />
        );
      }
    }
  }
  flushList();
  return elements;
}

const SUGGESTIONS = [
  "Who is Gol D. Roger?",
  "What is the One Piece?",
  "How does Haki work?",
  "What happened at Marineford?",
  "Who are the Four Emperors?",
];

export default function HomeChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(question?: string) {
    const q = (question ?? input).trim();
    if (!q || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setLoading(true);
    setMessages((prev) => [...prev, { role: "ai", content: "" }]);

    try {
      const params = new URLSearchParams({ question: q });
      const res = await fetch(`/api/global-chat?${params}`);
      if (!res.ok || !res.body) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "ai", content: accumulated };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "ai",
          content: "Couldn't reach the lore server. Make sure the backend is running.",
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
    <div className="home-chat">
      {messages.length === 0 ? (
        <div className="home-chat-suggestions">
          {SUGGESTIONS.map((s) => (
            <button key={s} className="home-suggestion" onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>
      ) : (
        <div className="home-chat-msgs" ref={msgsRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.role}`}>
              <div className={`msg-av ${msg.role === "ai" ? "ai" : "usr"}`}>
                {msg.role === "ai" ? "G" : "U"}
              </div>
              <div className="bubble">
                {msg.role === "ai" ? renderMarkdown(msg.content) : msg.content}
                {loading && i === messages.length - 1 && msg.role === "ai" && msg.content === "" && (
                  <span className="typing-dots">···</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="home-chat-input-row">
        <input
          className="chat-input"
          type="text"
          placeholder="Ask anything about One Piece…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          disabled={loading}
        />
        <button
          className="send-btn"
          onClick={() => sendMessage()}
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
