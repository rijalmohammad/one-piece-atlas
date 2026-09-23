import { notFound } from "next/navigation";
import Link from "next/link";
import { LOCS } from "@/lib/locations";

export function generateStaticParams() {
  return Object.keys(LOCS).map((key) => ({ key }));
}

export default async function LocationDetailPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const loc = LOCS[key];
  if (!loc) notFound();

  return (
    <main className="detail-page">
      <nav className="detail-nav">
        <Link href="/" className="detail-back">← Back to Atlas</Link>
      </nav>

      {/* Hero */}
      <div className="detail-hero" style={{ background: "rgba(240,176,32,0.06)" }}>
        <div className="detail-hero-info" style={{ paddingLeft: 0 }}>
          <div className="detail-eyebrow">{loc.eyebrow}</div>
          <h1 className="detail-title">{loc.title}</h1>
          {loc.isFiller && (
            <span className="arc-filler-badge" style={{ marginTop: 6, display: "inline-block" }}>
              Anime Only
            </span>
          )}
          <div className="detail-tags" style={{ marginTop: 10 }}>
            {loc.tags.map((t) => <span key={t} className="detail-tag">{t}</span>)}
            {loc.affiliation && (
              <span className="detail-tag" style={{ color: "rgba(170,210,255,0.8)" }}>{loc.affiliation}</span>
            )}
          </div>
        </div>
      </div>

      <div className="detail-body">

        {/* Overview */}
        <section className="detail-section">
          <h2 className="detail-section-title">Overview</h2>
          <p className="detail-text">{loc.lore}</p>
        </section>

        {/* Geography */}
        {loc.geography && (
          <section className="detail-section">
            <h2 className="detail-section-title">Geography & Setting</h2>
            <p className="detail-text">{loc.geography}</p>
          </section>
        )}

        {/* Notable Events */}
        {loc.notableEvents && loc.notableEvents.length > 0 && (
          <section className="detail-section">
            <h2 className="detail-section-title">Notable Events</h2>
            <ul className="detail-list">
              {loc.notableEvents.map((e, i) => (
                <li key={i} className="detail-list-item">{e}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Key Characters */}
        <section className="detail-section">
          <h2 className="detail-section-title">Key Characters</h2>
          <div className="detail-chars">
            {loc.chars.map(([initial, name, color, bg]) => (
              <div key={name} className="detail-char-chip">
                <div className="char-av" style={{ background: bg, color }}>{initial}</div>
                <span>{name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Facts */}
        <section className="detail-section">
          <h2 className="detail-section-title">Quick Facts</h2>
          <table className="detail-table">
            <tbody>
              <tr><td>Location</td><td>{loc.title}</td></tr>
              <tr><td>Region</td><td>{loc.eyebrow}</td></tr>
              {loc.affiliation && <tr><td>Affiliation</td><td>{loc.affiliation}</td></tr>}
              {loc.chapterStart && <tr><td>First Chapter</td><td>{loc.chapterStart}</td></tr>}
              {loc.chapterEnd   && <tr><td>Last Chapter</td><td>{loc.chapterEnd}</td></tr>}
              {loc.isFiller && <tr><td>Canon Status</td><td style={{ color: "#F0B020" }}>Anime Filler Only</td></tr>}
            </tbody>
          </table>
        </section>

      </div>
    </main>
  );
}
