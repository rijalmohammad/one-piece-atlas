import { notFound } from "next/navigation";
import Link from "next/link";
import { ARCS, getArcByKey } from "@/lib/arcs";

export function generateStaticParams() {
  return ARCS.map((a) => ({ arc: a.key }));
}

export default async function ArcDetailPage({ params }: { params: Promise<{ arc: string }> }) {
  const { arc: key } = await params;
  const arc = getArcByKey(key);
  if (!arc) notFound();

  return (
    <main className="detail-page">
      <nav className="detail-nav">
        <Link href="/" className="detail-back">← Back to Atlas</Link>
      </nav>

      {/* Hero */}
      <div
        className="arc-detail-hero"
        style={{ borderBottomColor: `${arc.sagaColor}44`, background: `linear-gradient(135deg, ${arc.sagaColor}18 0%, transparent 60%)` }}
      >
        <div className="arc-detail-hero-inner">
          <div className="arc-detail-saga-badge" style={{ color: arc.sagaColor, borderColor: `${arc.sagaColor}55`, background: `${arc.sagaColor}18` }}>
            {arc.saga}
          </div>
          <h1 className="arc-detail-title">{arc.arc}</h1>
          {arc.timeskip && <span className="arc-detail-timeskip">Post-Timeskip</span>}

          <div className="arc-detail-meta-row">
            <div className="arc-detail-meta-block">
              <div className="arc-detail-meta-label">Manga</div>
              <div className="arc-detail-meta-value">Ch. {arc.chStart}–{arc.chEnd}</div>
              <div className="arc-detail-meta-sub">{arc.chEnd - arc.chStart + 1} chapters</div>
            </div>
            <div className="arc-detail-meta-sep" />
            <div className="arc-detail-meta-block">
              <div className="arc-detail-meta-label">Anime</div>
              <div className="arc-detail-meta-value">Ep. {arc.epStart}–{arc.epEnd}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="arc-detail-body">
        {/* Summary */}
        <section className="arc-detail-section">
          <h2 className="arc-detail-section-title" style={{ color: arc.sagaColor }}>Overview</h2>
          <p className="arc-detail-overview">{arc.summary}</p>
        </section>

        {/* Key Events */}
        <section className="arc-detail-section">
          <h2 className="arc-detail-section-title" style={{ color: arc.sagaColor }}>Key Events</h2>
          <ul className="arc-detail-events">
            {arc.keyEvents.map((ev, i) => (
              <li key={i} className="arc-detail-event-item" style={{ borderLeftColor: arc.sagaColor }}>
                {ev}
              </li>
            ))}
          </ul>
        </section>

        {/* Full Story */}
        <section className="arc-detail-section">
          <h2 className="arc-detail-section-title" style={{ color: arc.sagaColor }}>Full Story</h2>
          <div className="arc-detail-story">
            {arc.story.map((para, i) => (
              <p key={i} className="arc-detail-para">{para}</p>
            ))}
          </div>
        </section>

        {/* Nav to adjacent arcs */}
        <div className="arc-detail-nav-row">
          {(() => {
            const idx = ARCS.findIndex((a) => a.key === key);
            const prev = ARCS[idx - 1];
            const next = ARCS[idx + 1];
            return (
              <>
                {prev ? (
                  <Link href={`/arcs/${prev.key}`} className="arc-detail-nav-link arc-detail-nav-prev">
                    <span className="arc-detail-nav-dir">← Previous Arc</span>
                    <span className="arc-detail-nav-name">{prev.arc}</span>
                  </Link>
                ) : <div />}
                {next ? (
                  <Link href={`/arcs/${next.key}`} className="arc-detail-nav-link arc-detail-nav-next">
                    <span className="arc-detail-nav-dir">Next Arc →</span>
                    <span className="arc-detail-nav-name">{next.arc}</span>
                  </Link>
                ) : <div />}
              </>
            );
          })()}
        </div>
      </div>
    </main>
  );
}
