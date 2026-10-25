"use client";

import { useState } from "react";
import {
  CHARACTERS,
  FACTIONS,
  Faction,
  Character,
} from "@/lib/characters";

const FACTION_INK: Record<Faction, string> = {
  "Straw Hats":      "#B8321E",
  "Marines":         "#1F4E9C",
  "Warlords":        "#6B3A8C",
  "Yonko":           "#9C2A1A",
  "Antagonists":     "#5A1A1A",
  "Allies":          "#1E7A66",
  "Revolutionaries": "#2F7A3A",
};

const NO_BOUNTY_HEADER: Record<Faction, string> = {
  "Straw Hats":      "CREW",
  "Marines":         "MARINE",
  "Warlords":        "WARLORD",
  "Yonko":           "YONKO",
  "Antagonists":     "UNLISTED",
  "Allies":          "ALLY",
  "Revolutionaries": "REVOLUTIONARY",
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
        {filtered.map((char, i) => {
          const isActive = activeChar?.name === char.name;
          const ink = FACTION_INK[char.faction];
          return (
            <div
              key={char.name}
              className={`wanted-card${isActive ? " active" : ""}`}
              style={{
                ["--ink" as string]: ink,
                ["--tilt" as string]: `${((i % 5) - 2) * 0.45}deg`,
              }}
              onClick={() => onSelect(char)}
            >
              <div className="wanted-head">{char.bounty ? "WANTED" : NO_BOUNTY_HEADER[char.faction]}</div>

              <div className="wanted-photo">
                {char.imageFile ? (
                  <img
                    src={`/chars/${char.imageFile}`}
                    alt={char.name}
                    className="wanted-img"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = "none";
                      const fallback = el.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="wanted-initial"
                  style={{ display: char.imageFile ? "none" : "flex" }}
                >
                  {char.initial}
                </div>
                <span className="wanted-stamp">{char.faction}</span>
              </div>

              <div className="wanted-sub">{char.bounty ? "DEAD OR ALIVE" : char.role.toUpperCase()}</div>
              <div className="wanted-name">{char.name}</div>
              <div className="wanted-bounty">
                {char.bounty ? <>฿ {char.bounty}</> : <span className="wanted-nobounty">No bounty</span>}
              </div>

              <div className="wanted-tags">
                {char.bounty && <span className="wanted-tag">{char.role}</span>}
                {char.devilFruit && (
                  <span className="wanted-tag wanted-tag-fruit">
                    {char.devilFruitType} · {char.devilFruit}
                  </span>
                )}
                <span className="wanted-tag">Ch. {char.debutChapter}</span>
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
