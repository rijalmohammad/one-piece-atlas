"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { DevilFruit, TYPE_COLORS, TYPE_BORDER, TYPE_LABEL_COLOR } from "@/lib/devilfruits";
import Link from "next/link";

interface Props {
  fruit: DevilFruit | null;
  onClose: () => void;
}

interface Msg { role: "user" | "ai"; text: string }

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function DevilFruitPanel({ fruit, onClose }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMessages([]); setInput(""); }, [fruit?.name]);
  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages]);

  const send = useCallback(async () => {
    if (!input.trim() || loading || !fruit) return;
    const q = input.trim();
    setInput("");
    setLoading(true);
    setMessages((m) => [...m, { role: "user", text: q }, { role: "ai", text: "" }]);

    try {
      const url = `/api/fruit-chat?fruit=${encodeURIComponent(fruit.name)}&question=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      if (!res.body) throw new Error("no body");
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "ai", text: buf };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "ai", text: "⚠ Backend not running — start the FastAPI server first." };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }, [input, loading, fruit]);

  const closed = !fruit;
  const typeColor = fruit ? TYPE_LABEL_COLOR[fruit.type] : "#F0B020";
  const typeBorder = fruit ? TYPE_BORDER[fruit.type] : "rgba(240,176,32,0.3)";

  return (
    <div className={`side-panel${closed ? " closed" : ""}`} aria-hidden={closed}>
      <div className="panel-handle" />

      {fruit && (
        <>
          <div className="panel-header">
            <div className="df-panel-header-row">
              <div
                className="df-panel-av"
                style={{ background: `${fruit.userColor}22`, color: fruit.userColor, borderColor: `${fruit.userColor}55` }}
              >
                {fruit.userInitial}
              </div>
              <div>
                <div className="panel-eyebrow" style={{ color: typeColor }}>{fruit.type}</div>
                <div className="panel-title">{fruit.name}</div>
                <div className="df-panel-english">{fruit.englishName}</div>
              </div>
            </div>
            <div className="panel-tags" style={{ marginTop: 10 }}>
              <span className="tag" style={{ color: typeColor, borderColor: typeBorder }}>{fruit.type}</span>
              <span className="tag">User: {fruit.user}</span>
              <span className="tag">Ch. {fruit.debutChapter}</span>
              <span className="tag">{fruit.debutArc}</span>
            </div>
            <button className="panel-close" onClick={onClose} aria-label="Close">✕</button>
          </div>

          <div className="panel-lore">
            <div className="section-label">Ability</div>
            <div className="lore-text">{fruit.ability}</div>
            {fruit.weakness && (
              <>
                <div className="section-label" style={{ marginTop: 10 }}>Note</div>
                <div className="lore-text" style={{ opacity: 0.65 }}>{fruit.weakness}</div>
              </>
            )}
            <div style={{ marginTop: 10 }}>
              <Link href={`/fruits/${toSlug(fruit.name)}`} className="detail-link">
                View full detail →
              </Link>
            </div>
          </div>

          <div className="panel-chat">
            <div className="chat-label">Ask about {fruit.name}</div>
            <div className="chat-msgs" ref={msgsRef}>
              {messages.length === 0 && (
                <div className="chat-hint">
                  Ask about {fruit.name}'s powers, awakening, weaknesses, or its user's fighting style.
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role === "user" ? "user" : "ai"}`}>
                  <div className={`msg-av ${m.role === "user" ? "usr" : "ai"}`}>
                    {m.role === "ai" ? "☠" : "U"}
                  </div>
                  <div className="bubble">
                    {m.text || (m.role === "ai" && loading && i === messages.length - 1
                      ? <span className="typing-dots">···</span>
                      : m.text)}
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-input-row">
              <input
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              />
              <button className="send-btn" onClick={send} disabled={loading || !input.trim()}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
