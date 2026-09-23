import { notFound } from "next/navigation";
import Link from "next/link";
import { CHARACTERS, toSlug } from "@/lib/characters";

export function generateStaticParams() {
  return CHARACTERS.map((c) => ({ slug: toSlug(c.name) }));
}

const DF_TYPE_COLOR: Record<string, string> = {
  Paramecia: "#F0B020",
  Zoan:      "#7FD47F",
  Logia:     "#5BAAEE",
};

const FACTION_BG: Record<string, string> = {
  "Straw Hats":      "rgba(255,100,0,0.08)",
  Marines:           "rgba(40,80,200,0.08)",
  Warlords:          "rgba(160,60,200,0.08)",
  Yonko:             "rgba(200,30,30,0.08)",
  Antagonists:       "rgba(80,80,80,0.08)",
  Allies:            "rgba(60,180,60,0.08)",
  Revolutionaries:   "rgba(200,160,0,0.08)",
};

export default async function CharacterDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const char = CHARACTERS.find((c) => toSlug(c.name) === slug);
  if (!char) notFound();

  return (
    <main className="detail-page">
      <nav className="detail-nav">
        <Link href="/?tab=characters" className="detail-back">← Back to Atlas</Link>
      </nav>

      {/* Hero */}
      <div className="detail-hero" style={{ background: FACTION_BG[char.faction] ?? "rgba(0,0,0,0.1)" }}>
        <div className="detail-hero-av-wrap">
          {char.imageFile ? (
            <img src={`/chars/${char.imageFile}`} alt={char.name} className="detail-hero-img" />
          ) : (
            <div className="detail-hero-av" style={{ background: char.bg, color: char.color }}>
              {char.initial}
            </div>
          )}
        </div>
        <div className="detail-hero-info">
          <div className="detail-eyebrow">{char.faction}</div>
          <h1 className="detail-title">{char.name}</h1>
          <div className="detail-role">{char.role}</div>
          <div className="detail-tags">
            <span className="detail-tag">Debut Ch. {char.debutChapter}</span>
            <span className="detail-tag">{char.debutArc}</span>
            {char.bounty && <span className="detail-tag">฿{char.bounty}</span>}
            {char.devilFruitType && (
              <span className="detail-tag" style={{ color: DF_TYPE_COLOR[char.devilFruitType] }}>
                {char.devilFruitType}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="detail-body">

        {/* Overview */}
        <section className="detail-section">
          <h2 className="detail-section-title">Overview</h2>
          <p className="detail-text">{char.description}</p>
        </section>

        {/* Abilities */}
        {char.abilities && (
          <section className="detail-section">
            <h2 className="detail-section-title">Abilities & Fighting Style</h2>
            <p className="detail-text">{char.abilities}</p>
          </section>
        )}

        {/* Devil Fruit */}
        {char.devilFruit && (
          <section className="detail-section">
            <h2 className="detail-section-title">Devil Fruit</h2>
            <div className="detail-card" style={{ borderColor: (DF_TYPE_COLOR[char.devilFruitType!] ?? "#888") + "55" }}>
              <div className="detail-card-label" style={{ color: DF_TYPE_COLOR[char.devilFruitType!] }}>
                {char.devilFruitType}
              </div>
              <div className="detail-card-name">{char.devilFruit}</div>
              <Link
                href={`/fruits/${char.devilFruit.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
                className="detail-link"
              >
                View fruit detail →
              </Link>
            </div>
          </section>
        )}

        {/* Pre-Timeskip Story */}
        {char.keyMoments && char.keyMoments.length > 0 && (
          <section className="detail-section">
            <h2 className="detail-section-title">Pre-Timeskip Story</h2>
            <ul className="detail-list">
              {char.keyMoments.map((m, i) => (
                <li key={i} className="detail-list-item">{m}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Bounty history */}
        {char.bountyHistory && char.bountyHistory.length > 0 && (
          <section className="detail-section">
            <h2 className="detail-section-title">Bounty History</h2>
            <table className="detail-table">
              <tbody>
                {char.bountyHistory.map((b, i) => (
                  <tr key={i}>
                    <td style={{ color: "#F0B020", fontWeight: 600 }}>฿{b.amount}</td>
                    <td>{b.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Quick Facts */}
        <section className="detail-section">
          <h2 className="detail-section-title">Quick Facts</h2>
          <table className="detail-table">
            <tbody>
              <tr><td>Faction</td><td>{char.faction}</td></tr>
              <tr><td>Role</td><td>{char.role}</td></tr>
              <tr><td>First Appeared</td><td>Chapter {char.debutChapter} — {char.debutArc}</td></tr>
              {char.bounty && <tr><td>Final Pre-Timeskip Bounty</td><td>฿{char.bounty}</td></tr>}
              {char.devilFruit && <tr><td>Devil Fruit</td><td>{char.devilFruit} ({char.devilFruitType})</td></tr>}
            </tbody>
          </table>
        </section>

      </div>
    </main>
  );
}
