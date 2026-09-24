"use client";

import Link from "next/link";
import { ARCS, SAGA_COLORS } from "@/lib/arcs";

const SAGAS = [...new Set(ARCS.map((a) => a.saga))];

function ArcCard({ arc }: { arc: (typeof ARCS)[number] }) {
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
  return (
    <div className="vtl-root">
      {/* Legend */}
      <div className="vtl-legend">
        {SAGAS.map((saga) => (
          <div key={saga} className="vtl-legend-item">
            <span className="vtl-legend-dot" style={{ background: SAGA_COLORS[saga] }} />
            <span>{saga}</span>
          </div>
        ))}
      </div>

      {/* Vertical timeline — 3-col grid: left-slot | dot-col | right-slot */}
      <div className="vtl-track">
        <div className="vtl-line" />

        {ARCS.map((arc, i) => {
          const isRight = i % 2 === 0; // true = card on left side
          return (
            <div key={arc.key} className="vtl-row">
              {/* Left slot */}
              <div className="vtl-slot-left">
                {isRight && <ArcCard arc={arc} />}
              </div>

              {/* Center dot */}
              <div className="vtl-dot-col">
                <div
                  className="vtl-dot"
                  style={{ background: arc.sagaColor, boxShadow: `0 0 0 3px ${arc.sagaColor}33` }}
                />
              </div>

              {/* Right slot */}
              <div className="vtl-slot-right">
                {!isRight && <ArcCard arc={arc} />}
              </div>
            </div>
          );
        })}

        {/* End cap */}
        <div className="vtl-end-cap">
          <div className="vtl-end-dot">☠</div>
          <div className="vtl-end-label">The Adventure Continues…</div>
        </div>
      </div>
    </div>
  );
}
