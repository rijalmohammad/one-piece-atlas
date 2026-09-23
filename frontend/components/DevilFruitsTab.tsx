"use client";

import { useState } from "react";
import {
  DEVIL_FRUITS,
  DFType,
  TYPE_COLORS,
  TYPE_BORDER,
  TYPE_LABEL_COLOR,
  DevilFruit,
} from "@/lib/devilfruits";

const TYPES: DFType[] = ["Paramecia", "Zoan", "Logia"];

interface Props {
  onSelect: (f: DevilFruit) => void;
  activeFruit: DevilFruit | null;
}

export default function DevilFruitsTab({ onSelect, activeFruit }: Props) {
  const [activeType, setActiveType] = useState<DFType | "All">("All");
  const [search, setSearch] = useState("");

  const filtered = DEVIL_FRUITS.filter((df) => {
    const matchType = activeType === "All" || df.type === activeType;
    const matchSearch =
      !search ||
      df.name.toLowerCase().includes(search.toLowerCase()) ||
      df.englishName.toLowerCase().includes(search.toLowerCase()) ||
      df.user.toLowerCase().includes(search.toLowerCase()) ||
      df.ability.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const counts = {
    All: DEVIL_FRUITS.length,
    Paramecia: DEVIL_FRUITS.filter((d) => d.type === "Paramecia").length,
    Zoan: DEVIL_FRUITS.filter((d) => d.type === "Zoan").length,
    Logia: DEVIL_FRUITS.filter((d) => d.type === "Logia").length,
  };

  return (
    <div className="tab-content">
      <div className="tab-filter-bar">
        <input
          className="tab-search"
          type="text"
          placeholder="Search fruits, users, abilities…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="faction-pills">
          <button
            className={`faction-pill${activeType === "All" ? " active" : ""}`}
            onClick={() => setActiveType("All")}
          >
            All ({counts.All})
          </button>
          {TYPES.map((t) => (
            <button
              key={t}
              className={`faction-pill${activeType === t ? " active" : ""}`}
              style={activeType === t ? { color: TYPE_LABEL_COLOR[t], borderColor: TYPE_BORDER[t] } : {}}
              onClick={() => setActiveType(t)}
            >
              {t} ({counts[t]})
            </button>
          ))}
        </div>
      </div>

      <div className="df-grid">
        {filtered.map((df) => {
          const isActive = activeFruit?.name === df.name;
          return (
            <div
              key={df.name}
              className={`df-card${isActive ? " active" : ""}`}
              style={{
                background: TYPE_COLORS[df.type],
                borderColor: isActive ? "rgba(240,176,32,0.6)" : TYPE_BORDER[df.type],
                cursor: "pointer",
              }}
              onClick={() => onSelect(df)}
            >
              <div className="df-card-header">
                <div
                  className="df-user-av"
                  style={{ background: `${df.userColor}30`, color: df.userColor, borderColor: `${df.userColor}60` }}
                >
                  {df.userInitial}
                </div>
                <div className="df-card-names">
                  <div className="df-name">{df.name}</div>
                  <div className="df-english-name">{df.englishName}</div>
                </div>
                <span
                  className="df-type-badge"
                  style={{ color: TYPE_LABEL_COLOR[df.type], borderColor: TYPE_BORDER[df.type] }}
                >
                  {df.type}
                </span>
              </div>

              <div className="df-user-line">
                <span className="df-user-label">User:</span>
                <span className="df-user-name">{df.user}</span>
              </div>

              <div className="df-debut">
                Ch. {df.debutChapter} · {df.debutArc}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="tab-empty">No Devil Fruits match that filter.</div>
        )}
      </div>
    </div>
  );
}
