"use client";

import { useState } from "react";
import {
  CHARACTERS,
  FACTIONS,
  FACTION_COLORS,
  FACTION_BORDER,
  Faction,
  Character,
} from "@/lib/characters";

const DF_TYPE_PILL: Record<string, string> = {
  Paramecia: "#F0B020",
  Zoan:      "#7FD47F",
  Logia:     "#5BAAEE",
};

interface Props {
  onSelect: (c: Character) => void;
  activeChar: Character | null;
}

export default function CharactersTab({ onSelect, activeChar }: Props) {
  const [activeFaction, setActiveFaction] = useState<Faction | "All">("All");
  const [search, setSearch] = useState("");

  const filtered = CHARACTERS.filter((c) => {
    const matchFaction = activeFaction === "All" || c.faction === activeFaction;
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      (c.devilFruit?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchFaction && matchSearch;
  });

  return (
    <div className="tab-content">
      <div className="tab-filter-bar">
        <input
          className="tab-search"
          type="text"
          placeholder="Search characters…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="faction-pills">
          <button
            className={`faction-pill${activeFaction === "All" ? " active" : ""}`}
            onClick={() => setActiveFaction("All")}
          >
            All
          </button>
          {FACTIONS.map((f) => (
            <button
              key={f}
              className={`faction-pill${activeFaction === f ? " active" : ""}`}
              onClick={() => setActiveFaction(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="char-grid">
        {filtered.map((char) => {
          const isActive = activeChar?.name === char.name;
          return (
            <div
              key={char.name}
              className={`char-card${isActive ? " active" : ""}`}
              style={{
                background: FACTION_COLORS[char.faction],
                borderColor: isActive ? "rgba(240,176,32,0.6)" : FACTION_BORDER[char.faction],
              }}
              onClick={() => onSelect(char)}
            >
              <div className="char-card-header">
                {char.imageFile ? (
                  <img
                    src={`/chars/${char.imageFile}`}
                    alt={char.name}
                    className="char-card-img"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = "none";
                      const fallback = el.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="char-card-av"
                  style={{
                    background: char.bg,
                    color: char.color,
                    display: char.imageFile ? "none" : "flex",
                  }}
                >
                  {char.initial}
                </div>
                <div className="char-card-info">
                  <div className="char-card-name">{char.name}</div>
                  <div className="char-card-role">{char.role}</div>
                </div>
              </div>

              <div className="char-card-footer">
                {char.devilFruit && (
                  <span
                    className="char-df-pill"
                    style={{ color: DF_TYPE_PILL[char.devilFruitType!] ?? "#F0B020" }}
                  >
                    {char.devilFruitType} · {char.devilFruit}
                  </span>
                )}
                <span className="char-debut-pill">
                  Ch. {char.debutChapter} — {char.debutArc}
                </span>
                {char.bounty && (
                  <span className="char-bounty-pill">฿{char.bounty}</span>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="tab-empty">No characters match that filter.</div>
        )}
      </div>
    </div>
  );
}
