"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { renderMarkdown, TypingDots } from "./Markdown";
import { Character } from "@/lib/characters";
import Link from "next/link";

interface Props {
  character: Character | null;
  onClose: () => void;
}

interface Msg { role: "user" | "ai"; text: string }

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const DF_TYPE_COLOR: Record<string, string> = {
  Paramecia: "#F0B020",
  Zoan: "#7FD47F",
  Logia: "#5BAAEE",
};

export default function CharacterPanel({ character, onClose }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMessages([]); setInput(""); }, [character?.name]);
  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages]);

  const send = useCallback(async () => {
    if (!input.trim() || loading || !character) return;
    const q = input.trim();
    setInput("");
    setLoading(true);
    setMessages((m) => [...m, { role: "user", text: q }, { role: "ai", text: "" }]);

    try {
      const url = `/api/char-chat?character=${encodeURIComponent(character.name)}&question=${encodeURIComponent(q)}`;
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
  }, [input, loading, character]);

  const closed = !character;

  return (
    <div className={`side-panel${closed ? " closed" : ""}`} aria-hidden={closed}>
      <div className="panel-handle" />

      {character && (
        <>
          <div className="panel-header">
            <div className="char-panel-av-row">
              {character.imageFile ? (
                <img
                  src={`/chars/${character.imageFile}`}
                  alt={character.name}
                  className="char-panel-img"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div
                  className="char-panel-av-large"
                  style={{ background: character.bg, color: character.color }}
                >
                  {character.initial}
                </div>
              )}
              <div>
                <div className="panel-eyebrow">{character.faction}</div>
                <div className="panel-title">{character.name}</div>
                <div className="char-panel-role">{character.role}</div>
              </div>
            </div>
            <div className="panel-tags" style={{ marginTop: 10 }}>
              <span className="tag">Ch. {character.debutChapter}</span>
              <span className="tag">{character.debutArc}</span>
              {character.bounty && <span className="tag">฿{character.bounty}</span>}
              {character.devilFruit && (
                <span
                  className="tag"
                  style={{ color: DF_TYPE_COLOR[character.devilFruitType!] ?? "#F0B020" }}
                >
                  {character.devilFruitType} · {character.devilFruit}
                </span>
              )}
            </div>
            <button className="panel-close" onClick={onClose} aria-label="Close">✕</button>
          </div>

          <div className="panel-lore">
            <div className="section-label">About</div>
            <div className="lore-text">{character.description}</div>
            <div style={{ marginTop: 10 }}>
              <Link href={`/characters/${toSlug(character.name)}`} className="detail-link">
                View full profile →
              </Link>
            </div>
          </div>

          <div className="panel-chat">
            <div className="chat-label">Ask about {character.name.split(" ")[0]}</div>
            <div className="chat-msgs" ref={msgsRef}>
              {messages.length === 0 && (
                <div className="chat-hint">
                  Ask about {character.name}'s abilities, backstory, bounty, or role in the story.
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role === "user" ? "user" : "ai"}`}>
                  <div className={`msg-av ${m.role === "user" ? "usr" : "ai"}`}>
                    {m.role === "ai" ? "🐌" : "U"}
                  </div>
                  <div className="bubble">
                    {m.text
                      ? (m.role === "ai" ? renderMarkdown(m.text) : m.text)
                      : (m.role === "ai" && loading && i === messages.length - 1 ? <TypingDots /> : null)}
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
