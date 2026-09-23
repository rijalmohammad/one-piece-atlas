"use client";

import { ICONS } from "@/lib/icons";
import { Location } from "@/lib/locations";

interface Props {
  locationKey: string;
  loc: Location;
  isActive: boolean;
  onClick: () => void;
}

export default function IslandCard({ locationKey, loc, isActive, onClick }: Props) {
  const icon = ICONS[locationKey] ?? ICONS.foosha;
  return (
    <div
      className={`island-card${isActive ? " active" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div
        className="card-icon"
        dangerouslySetInnerHTML={{ __html: icon }}
      />
      <div className="card-body">
        <div className="card-eyebrow">{loc.eyebrow}</div>
        <div className="card-title">{loc.title}</div>
        <div className="card-lore">{loc.lore}</div>
        <div className="card-chars">
          {loc.chars.map(([initial, name, color, bg], i) => (
            <div
              key={i}
              className="card-char-av"
              style={{ background: bg, color }}
              title={name}
            >
              {initial}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
