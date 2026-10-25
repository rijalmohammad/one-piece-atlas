"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ARCS, SAGA_COLORS } from "@/lib/arcs";

const SAGAS = [...new Set(ARCS.map((a) => a.saga))];

type ArcItem = (typeof ARCS)[number];

const GROUPS = ARCS.reduce<{ saga: string; color: string; arcs: ArcItem[] }[]>((acc, arc) => {
  const last = acc[acc.length - 1];
  if (last && last.saga === arc.saga) last.arcs.push(arc);
  else acc.push({ saga: arc.saga, color: arc.sagaColor, arcs: [arc] });
  return acc;
}, []);

function ArcCard({ arc }: { arc: ArcItem }) {
  return (
    <div className="vtl-card" style={{ borderColor: `${arc.sagaColor}44` }}>
      <div className="vtl-card-head">
        <span
          className="vtl-saga-badge"
          style={{ background: `${arc.sagaColor}22`, color: arc.sagaColor, borderColor: `${arc.sagaColor}55` }}
        >
          {arc.saga}
        </span>
        {arc.timeskip && <span className="vtl-timeskip-badge">Post-Timeskip</span>}
      </div>

      <h3 className="vtl-arc-name">{arc.arc}</h3>

      <div className="vtl-meta">
        <span className="vtl-meta-item">
          <span className="vtl-meta-label">Manga</span>
          Ch. {arc.chStart}–{arc.chEnd}
        </span>
        <div className="vtl-meta-divider" />
        <span className="vtl-meta-item">
          <span className="vtl-meta-label">Anime</span>
          Ep. {arc.epStart}–{arc.epEnd}
        </span>
      </div>

      <p className="vtl-summary">{arc.summary}</p>

      <Link
        href={`/arcs/${arc.key}`}
        className="vtl-detail-btn"
        style={{ borderColor: arc.sagaColor, color: arc.sagaColor }}
      >
        View Full Arc →
      </Link>
    </div>
  );
}

export default function ArcTimelineTab() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const rows = Array.from(track.querySelectorAll<HTMLElement>(".vtl-row"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) track.classList.add("vtl-animate");

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const mid = vh * 0.55;
      const rect = track.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (mid - rect.top) / rect.height));
      track.style.setProperty("--vtl-progress", `${(p * 100).toFixed(2)}%`);
      for (const row of rows) {
        const top = row.getBoundingClientRect().top;
        row.classList.toggle("reached", top < mid);
        if (top < vh * 0.92) row.classList.add("in");
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    update();
    const scroller = document.getElementById("contentArea");
    scroller?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      scroller?.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      track.classList.remove("vtl-animate");
    };
  }, []);

  return (
    <div className="vtl-root">
      <div className="vtl-legend">
        {SAGAS.map((saga) => (
          <div key={saga} className="vtl-legend-item">
            <span className="vtl-legend-dot" style={{ background: SAGA_COLORS[saga] }} />
            <span>{saga}</span>
          </div>
        ))}
      </div>

      <div className="vtl-track" ref={trackRef}>
        <div className="vtl-line" />

        {GROUPS.map((group) => (
          <section key={group.saga} className="vtl-group">
            <div className="vtl-saga-sticky">
              <span style={{ color: group.color, borderColor: `${group.color}77` }}>{group.saga}</span>
            </div>

            {group.arcs.map((arc) => {
              const isLeft = ARCS.indexOf(arc) % 2 === 0;
              return (
                <div key={arc.key} className="vtl-row">
                  <div className="vtl-slot-left">{isLeft && <ArcCard arc={arc} />}</div>
                  <div className="vtl-dot-col">
                    <div
                      className="vtl-dot"
                      style={{ background: arc.sagaColor, boxShadow: `0 0 0 3px ${arc.sagaColor}33` }}
                    />
                  </div>
                  <div className="vtl-slot-right">{!isLeft && <ArcCard arc={arc} />}</div>
                </div>
              );
            })}
          </section>
        ))}

        <div className="vtl-end-cap">
          <div className="vtl-end-dot">☠</div>
          <div className="vtl-end-label">The Adventure Continues…</div>
        </div>
      </div>
    </div>
  );
}
