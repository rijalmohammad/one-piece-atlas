"use client";

import IslandCard from "./IslandCard";
import { ArcGroup, LOCS } from "@/lib/locations";

interface Props {
  arcGroup: ArcGroup;
  activeKey: string | null;
  onSelect: (key: string) => void;
  colSpan?: number;
}

export default function ArcSection({ arcGroup, activeKey, onSelect, colSpan = 1 }: Props) {
  return (
    <div
      className={`arc-section${arcGroup.isFiller ? " arc-section-filler" : ""}`}
      style={colSpan > 1 ? { gridColumn: `span ${colSpan}` } : undefined}
    >
      <div className="arc-header">
        <span className="arc-name">{arcGroup.arc}</span>
        {arcGroup.isFiller && <span className="arc-filler-badge">Anime Only</span>}
        <span className="arc-pill">
          {arcGroup.keys.length} island{arcGroup.keys.length > 1 ? "s" : ""}
        </span>
      </div>
      <div className="cards-grid">
        {arcGroup.keys.map((key) => {
          const loc = LOCS[key];
          if (!loc) return null;
          return (
            <IslandCard
              key={key}
              locationKey={key}
              loc={loc}
              isActive={activeKey === key}
              onClick={() => onSelect(key)}
            />
          );
        })}
      </div>
    </div>
  );
}
