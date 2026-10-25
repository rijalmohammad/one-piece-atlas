"use client";

import Link from "next/link";
import { Location } from "@/lib/locations";
import ChatBox from "./ChatBox";

interface Props {
  locationKey: string | null;
  loc: Location | null;
  onClose: () => void;
}

export default function SidePanel({ locationKey, loc, onClose }: Props) {
  const isOpen = !!loc && !!locationKey;

  return (
    <div className={`side-panel${isOpen ? "" : " closed"}`} id="panel">
      <div className="panel-handle" />
      {loc && locationKey ? (
        <>
          <div className="panel-header">
            <div className="panel-eyebrow">{loc.eyebrow}</div>
            <div className="panel-title">{loc.title}</div>
            <div className="panel-tags">
              {loc.tags.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
            <button className="panel-close" onClick={onClose} aria-label="Close panel">✕</button>
          </div>
          <div className="panel-lore">
            <div className="section-label">Lore Summary</div>
            <div className="lore-text">{loc.lore}</div>
            <div className="char-chips">
              {loc.chars.map(([initial, name, color, bg], i) => (
                <div key={i} className="char-chip">
                  <div className="char-av" style={{ background: bg, color }}>{initial}</div>
                  {name}
                </div>
              ))}
            </div>
            <Link href={`/locations/${locationKey}`} className="detail-link" style={{ marginTop: 12, display: "inline-block" }}>
              View full detail →
            </Link>
          </div>
          <ChatBox
            locationKey={locationKey}
            greeting={loc.greeting}
          />
        </>
      ) : null}
    </div>
  );
}
