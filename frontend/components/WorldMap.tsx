"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ARC_GROUPS, LOCS } from "@/lib/locations";
import { ICONS } from "@/lib/icons";

const REGION_COLOR: Record<string, string> = {
  eastblue: "#3E8FD6",
  grandline: "#8A63D2",
  newworld: "#D2503E",
};

interface Node {
  key: string;
  arc: string;
  firstInGroup: boolean;
  filler: boolean;
  n: number;
}

interface Props {
  regionKey: string;
  activeKey: string | null;
  onSelect: (key: string) => void;
}

const GENERIC_ICON = `<svg viewBox="0 0 32 32"><ellipse cx="16" cy="25" rx="12" ry="4.5" fill="#C9A24A"/><rect x="15" y="10" width="2" height="15" fill="#7A4A1E"/><path d="M16 10 Q8 5 3 12 Q10 9 16 12 Q22 9 29 12 Q24 5 16 10Z" fill="#3E9A4A"/></svg>`;

// Re-size the nested <svg> so it sits centred on the pin origin.
function pinIcon(key: string): string {
  return (ICONS[key] ?? GENERIC_ICON).replace("<svg ", '<svg x="-15" y="-15" width="30" height="30" ');
}

const PAD = 40;
const ROW_H = 136;
const TOP = 62;

function wrapLabel(text: string, max = 15): string[] {
  if (text.length <= max) return [text];
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (cur && (cur + " " + w).length > max) { lines.push(cur); cur = w; }
    else cur = cur ? cur + " " + w : w;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 2).map((l, i, a) => (i === a.length - 1 && lines.length > 2 ? l + "…" : l));
}

function shortArc(arc: string): string {
  const s = arc.replace(/\s*\(Filler\)/, "");
  return s.length > 22 ? s.slice(0, 21) + "…" : s;
}

export default function WorldMap({ regionKey, activeKey, onSelect }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const color = REGION_COLOR[regionKey] ?? "#3E8FD6";

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const nodes = useMemo<Node[]>(() => {
    const out: Node[] = [];
    for (const g of ARC_GROUPS[regionKey] ?? []) {
      g.keys.forEach((key, i) => {
        if (!LOCS[key]) return;
        out.push({ key, arc: g.arc, firstInGroup: i === 0, filler: !!(g.isFiller || LOCS[key].isFiller), n: out.length + 1 });
      });
    }
    return out;
  }, [regionKey]);

  const layout = useMemo(() => {
    if (!width) return null;
    const cols = Math.max(2, Math.min(8, Math.floor((width - PAD * 2) / 138)));
    const colW = (width - PAD * 2) / cols;
    const pts = nodes.map((_, i) => {
      const row = Math.floor(i / cols);
      const c = i % cols;
      const col = row % 2 === 0 ? c : cols - 1 - c;
      return { x: PAD + colW * (col + 0.5), y: TOP + row * ROW_H, row };
    });
    const rows = Math.ceil(nodes.length / cols);
    const height = TOP + (rows - 1) * ROW_H + 104;

    let d = "";
    pts.forEach((p, i) => {
      if (i === 0) { d = `M${p.x} ${p.y}`; return; }
      const q = pts[i - 1];
      if (q.row === p.row) {
        const mx = (q.x + p.x) / 2;
        const bend = i % 2 === 0 ? -18 : 18;
        d += ` Q${mx} ${p.y + bend} ${p.x} ${p.y}`;
      } else {
        const dir = q.row % 2 === 0 ? 1 : -1;
        d += ` C${q.x + dir * 70} ${q.y + 10} ${p.x + dir * 70} ${p.y - 10} ${p.x} ${p.y}`;
      }
    });
    return { pts, height, d };
  }, [width, nodes]);

  return (
    <div className={`sea-chart sea-${regionKey}`} ref={wrapRef} style={{ ["--rc" as string]: color }}>
      {layout && (
        <svg width={width} height={layout.height} role="group" aria-label="Island route map">
          <path d={layout.d} className="sea-route-glow" />
          <path d={layout.d} className="sea-route" />
          {nodes.length > 1 && (
            <text className="sea-ship" fontSize="22" textAnchor="middle" dominantBaseline="central">
              ⛵
              <animateMotion dur={`${Math.max(30, nodes.length * 4)}s`} repeatCount="indefinite" path={layout.d} />
            </text>
          )}

          {nodes.map((node, i) => {
            const loc = LOCS[node.key];
            const { x, y } = layout.pts[i];
            const lines = wrapLabel(loc.title);
            const isActive = activeKey === node.key;
            return (
              <g
                key={node.key}
                className={`sea-node${isActive ? " active" : ""}${node.filler ? " filler" : ""}`}
                transform={`translate(${x} ${y})`}
                role="button"
                tabIndex={0}
                aria-label={`${loc.title}, ${loc.eyebrow}`}
                onClick={() => onSelect(node.key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(node.key); }
                }}
              >
                <title>{`${loc.title} — ${loc.eyebrow}`}</title>
                {node.firstInGroup && (
                  <text className="sea-saga" y={-42} textAnchor="middle">{shortArc(node.arc)}</text>
                )}
                <g className="sea-pin">
                  <circle className="sea-pin-ring" r={27} />
                  <circle className="sea-pin-body" r={22} />
                  <g className="sea-pin-icon" dangerouslySetInnerHTML={{ __html: pinIcon(node.key) }} />
                  <g transform="translate(-19 -19)">
                    <circle className="sea-pin-badge" r={9.5} />
                    <text className="sea-pin-num" textAnchor="middle" dominantBaseline="central">{node.n}</text>
                  </g>
                </g>
                <text className="sea-label" textAnchor="middle" y={44}>
                  {lines.map((l, li) => (
                    <tspan key={li} x={0} dy={li === 0 ? 0 : 13}>{l}</tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}
