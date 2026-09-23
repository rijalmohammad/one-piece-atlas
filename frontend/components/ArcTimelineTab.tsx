"use client";

import { useState } from "react";

interface ArcEntry {
  saga: string;
  arc: string;
  chStart: number;
  chEnd: number;
  epStart: string;
  epEnd: string;
  key: string;
  sagaColor: string;
  note?: string;
}

const ARCS: ArcEntry[] = [
  // East Blue Saga
  { saga: "East Blue Saga",    arc: "Romance Dawn Arc",    chStart: 1,   chEnd: 7,   epStart: "1",   epEnd: "4",   key: "romance-dawn",    sagaColor: "#3A78C0" },
  { saga: "East Blue Saga",    arc: "Orange Town Arc",     chStart: 8,   chEnd: 21,  epStart: "4",   epEnd: "8",   key: "orange-town",     sagaColor: "#3A78C0" },
  { saga: "East Blue Saga",    arc: "Syrup Village Arc",   chStart: 22,  chEnd: 41,  epStart: "9",   epEnd: "18",  key: "syrup-village",   sagaColor: "#3A78C0" },
  { saga: "East Blue Saga",    arc: "Baratie Arc",         chStart: 42,  chEnd: 68,  epStart: "19",  epEnd: "30",  key: "baratie",         sagaColor: "#3A78C0" },
  { saga: "East Blue Saga",    arc: "Arlong Park Arc",     chStart: 69,  chEnd: 95,  epStart: "31",  epEnd: "44",  key: "arlong-park",     sagaColor: "#3A78C0" },
  { saga: "East Blue Saga",    arc: "Loguetown Arc",       chStart: 96,  chEnd: 100, epStart: "45",  epEnd: "53",  key: "loguetown",       sagaColor: "#3A78C0" },
  // Arabasta Saga
  { saga: "Arabasta Saga",     arc: "Reverse Mountain Arc",chStart: 101, chEnd: 105, epStart: "62",  epEnd: "63",  key: "reverse-mountain",sagaColor: "#C09030" },
  { saga: "Arabasta Saga",     arc: "Whisky Peak Arc",     chStart: 106, chEnd: 114, epStart: "64",  epEnd: "67",  key: "whisky-peak",     sagaColor: "#C09030" },
  { saga: "Arabasta Saga",     arc: "Little Garden Arc",   chStart: 115, chEnd: 129, epStart: "70",  epEnd: "77",  key: "little-garden",   sagaColor: "#C09030" },
  { saga: "Arabasta Saga",     arc: "Drum Island Arc",     chStart: 130, chEnd: 154, epStart: "78",  epEnd: "91",  key: "drum-island",     sagaColor: "#C09030" },
  { saga: "Arabasta Saga",     arc: "Arabasta Arc",        chStart: 155, chEnd: 217, epStart: "92",  epEnd: "130", key: "arabasta",        sagaColor: "#C09030", note: "Longest arc of Arabasta Saga" },
  // Sky Island Saga
  { saga: "Sky Island Saga",   arc: "Jaya Arc",            chStart: 218, chEnd: 236, epStart: "144", epEnd: "152", key: "jaya",            sagaColor: "#5A9ACC" },
  { saga: "Sky Island Saga",   arc: "Skypiea Arc",         chStart: 237, chEnd: 302, epStart: "153", epEnd: "195", key: "skypiea",         sagaColor: "#5A9ACC" },
  // Water 7 Saga
  { saga: "Water 7 Saga",      arc: "Long Ring Long Land", chStart: 303, chEnd: 321, epStart: "207", epEnd: "219", key: "long-ring",       sagaColor: "#4A8888" },
  { saga: "Water 7 Saga",      arc: "Water 7 Arc",         chStart: 322, chEnd: 374, epStart: "229", epEnd: "263", key: "water-7",         sagaColor: "#4A8888" },
  { saga: "Water 7 Saga",      arc: "Enies Lobby Arc",     chStart: 375, chEnd: 430, epStart: "264", epEnd: "312", key: "enies-lobby",     sagaColor: "#4A8888", note: "Straw Hats declare war on the World Government" },
  { saga: "Water 7 Saga",      arc: "Post-Enies Lobby Arc",chStart: 431, chEnd: 441, epStart: "313", epEnd: "325", key: "post-enies",      sagaColor: "#4A8888" },
  // Thriller Bark Saga
  { saga: "Thriller Bark Saga",arc: "Thriller Bark Arc",   chStart: 442, chEnd: 489, epStart: "337", epEnd: "381", key: "thriller-bark",   sagaColor: "#5A3A78" },
  // Summit War Saga
  { saga: "Summit War Saga",   arc: "Sabaody Archipelago", chStart: 490, chEnd: 513, epStart: "385", epEnd: "405", key: "sabaody",         sagaColor: "#C03A3A" },
  { saga: "Summit War Saga",   arc: "Amazon Lily Arc",     chStart: 514, chEnd: 524, epStart: "408", epEnd: "417", key: "amazon-lily",     sagaColor: "#C03A3A" },
  { saga: "Summit War Saga",   arc: "Impel Down Arc",      chStart: 525, chEnd: 549, epStart: "422", epEnd: "452", key: "impel-down",      sagaColor: "#C03A3A" },
  { saga: "Summit War Saga",   arc: "Marineford Arc",      chStart: 550, chEnd: 580, epStart: "457", epEnd: "489", key: "marineford",      sagaColor: "#C03A3A", note: "The Summit War — death of Ace and Whitebeard" },
  { saga: "Summit War Saga",   arc: "Post-War Arc",        chStart: 581, chEnd: 597, epStart: "490", epEnd: "516", key: "post-war",        sagaColor: "#C03A3A", note: "End of pre-timeskip — Luffy trains for 2 years" },
];

const TOTAL_CHAPTERS = 597;
const MIN_CH = 1;

function arcWidth(arc: ArcEntry): number {
  return Math.max(((arc.chEnd - arc.chStart + 1) / TOTAL_CHAPTERS) * 100, 3);
}

const SAGAS = [...new Set(ARCS.map((a) => a.saga))];
const SAGA_ARCS = SAGAS.map((saga) => ({
  saga,
  arcs: ARCS.filter((a) => a.saga === saga),
  color: ARCS.find((a) => a.saga === saga)!.sagaColor,
}));

export default function ArcTimelineTab() {
  const [hovered, setHovered] = useState<string | null>(null);
  const hov = hovered ? ARCS.find((a) => a.key === hovered) ?? null : null;

  return (
    <div className="tab-content timeline-tab">
      <div className="timeline-legend">
        {SAGA_ARCS.map(({ saga, color }) => (
          <div key={saga} className="timeline-legend-item">
            <span className="timeline-legend-dot" style={{ background: color }} />
            <span>{saga}</span>
          </div>
        ))}
      </div>

      {/* Chapter ruler */}
      <div className="timeline-ruler">
        {[1, 100, 200, 300, 400, 500, 597].map((ch) => (
          <div
            key={ch}
            className="timeline-ruler-mark"
            style={{ left: `${((ch - MIN_CH) / TOTAL_CHAPTERS) * 100}%` }}
          >
            <div className="timeline-ruler-line" />
            <div className="timeline-ruler-label">Ch. {ch}</div>
          </div>
        ))}
      </div>

      {/* Saga rows */}
      <div className="timeline-rows">
        {SAGA_ARCS.map(({ saga, arcs, color }) => (
          <div key={saga} className="timeline-row">
            <div className="timeline-row-label">{saga.replace(" Saga", "")}</div>
            <div className="timeline-row-track">
              {arcs.map((arc) => {
                const left = ((arc.chStart - MIN_CH) / TOTAL_CHAPTERS) * 100;
                const width = arcWidth(arc);
                const isHov = hovered === arc.key;
                return (
                  <div
                    key={arc.key}
                    className={`timeline-arc-bar${isHov ? " hovered" : ""}`}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      background: isHov ? color : `${color}99`,
                      borderColor: color,
                    }}
                    onMouseEnter={() => setHovered(arc.key)}
                    onMouseLeave={() => setHovered(null)}
                    title={arc.arc}
                  >
                    <span className="timeline-arc-label">{arc.arc.replace(" Arc", "")}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Hover tooltip */}
      {hov && (
        <div className="timeline-tooltip">
          <div className="timeline-tooltip-arc">{hov.arc}</div>
          <div className="timeline-tooltip-saga" style={{ color: hov.sagaColor }}>{hov.saga}</div>
          <div className="timeline-tooltip-range">
            Ch. {hov.chStart}–{hov.chEnd} &nbsp;·&nbsp; Ep. {hov.epStart}–{hov.epEnd}
          </div>
          {hov.note && <div className="timeline-tooltip-note">{hov.note}</div>}
        </div>
      )}

      {/* Chapter count summary */}
      <div className="timeline-summary">
        <div className="timeline-summary-item">
          <span className="timeline-summary-num">{ARCS.length}</span>
          <span className="timeline-summary-label">Arcs</span>
        </div>
        <div className="timeline-summary-item">
          <span className="timeline-summary-num">597</span>
          <span className="timeline-summary-label">Chapters</span>
        </div>
        <div className="timeline-summary-item">
          <span className="timeline-summary-num">516</span>
          <span className="timeline-summary-label">Episodes</span>
        </div>
        <div className="timeline-summary-item">
          <span className="timeline-summary-num">5</span>
          <span className="timeline-summary-label">Sagas</span>
        </div>
      </div>
    </div>
  );
}
