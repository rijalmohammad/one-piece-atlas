import { notFound } from "next/navigation";
import Link from "next/link";
import { DEVIL_FRUITS, toSlug } from "@/lib/devilfruits";
import { CHARACTERS, toSlug as charSlug } from "@/lib/characters";

export function generateStaticParams() {
  return DEVIL_FRUITS.map((f) => ({ slug: toSlug(f.name) }));
}

const TYPE_BG: Record<string, string> = {
  Paramecia: "rgba(240,176,32,0.07)",
  Zoan:      "rgba(80,200,80,0.07)",
  Logia:     "rgba(80,160,240,0.07)",
};
const TYPE_COLOR: Record<string, string> = {
  Paramecia: "#F0B020",
  Zoan:      "#7FD47F",
  Logia:     "#5BAAEE",
};

export default async function FruitDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fruit = DEVIL_FRUITS.find((f) => toSlug(f.name) === slug);
  if (!fruit) notFound();

  const userChar = CHARACTERS.find((c) =>
    c.name.toLowerCase().includes(fruit.user.toLowerCase().split(" ")[0]) ||
    fruit.user.toLowerCase().includes(c.name.toLowerCase().split(" ")[0])
  );

  return (
    <main className="detail-page">
      <nav className="detail-nav">
        <Link href="/?tab=devilfruits" className="detail-back">← Back to Atlas</Link>
      </nav>

      {/* Hero */}
      <div className="detail-hero" style={{ background: TYPE_BG[fruit.type] }}>
        <div className="detail-hero-av-wrap">
          <div
            className="detail-hero-av"
            style={{ background: `${fruit.userColor}22`, color: fruit.userColor }}
          >
            {fruit.userInitial}
          </div>
        </div>
        <div className="detail-hero-info">
          <div className="detail-eyebrow" style={{ color: TYPE_COLOR[fruit.type] }}>
            {fruit.type} · Devil Fruit
          </div>
          <h1 className="detail-title">{fruit.name}</h1>
          <div className="detail-role">{fruit.englishName}</div>
          <div className="detail-tags">
            <span className="detail-tag" style={{ color: TYPE_COLOR[fruit.type] }}>{fruit.type}</span>
            <span className="detail-tag">User: {fruit.user}</span>
            <span className="detail-tag">Debut Ch. {fruit.debutChapter}</span>
            <span className="detail-tag">{fruit.debutArc}</span>
          </div>
        </div>
      </div>

      <div className="detail-body">

        {/* Ability */}
        <section className="detail-section">
          <h2 className="detail-section-title">Ability</h2>
          <p className="detail-text">{fruit.ability}</p>
        </section>

        {/* Weakness */}
        {fruit.weakness && (
          <section className="detail-section">
            <h2 className="detail-section-title">Weakness / Limitation</h2>
            <p className="detail-text">{fruit.weakness}</p>
          </section>
        )}

        {/* Named Techniques */}
        {fruit.techniques && fruit.techniques.length > 0 && (
          <section className="detail-section">
            <h2 className="detail-section-title">Named Techniques</h2>
            <ul className="detail-list">
              {fruit.techniques.map((t, i) => (
                <li key={i} className="detail-list-item">{t}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Story Role */}
        {fruit.storyRole && (
          <section className="detail-section">
            <h2 className="detail-section-title">Role in the Story</h2>
            <p className="detail-text">{fruit.storyRole}</p>
          </section>
        )}

        {/* User link */}
        {userChar && (
          <section className="detail-section">
            <h2 className="detail-section-title">Current User</h2>
            <div className="detail-card" style={{ borderColor: `${fruit.userColor}55` }}>
              <div className="detail-card-label" style={{ color: fruit.userColor }}>{userChar.faction}</div>
              <div className="detail-card-name">{userChar.name}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{userChar.role}</div>
              <Link href={`/characters/${charSlug(userChar.name)}`} className="detail-link">
                View character →
              </Link>
            </div>
          </section>
        )}

        {/* Quick Facts */}
        <section className="detail-section">
          <h2 className="detail-section-title">Quick Facts</h2>
          <table className="detail-table">
            <tbody>
              <tr><td>Classification</td><td style={{ color: TYPE_COLOR[fruit.type] }}>{fruit.type}</td></tr>
              <tr><td>Japanese Name</td><td>{fruit.name}</td></tr>
              <tr><td>English Name</td><td>{fruit.englishName}</td></tr>
              <tr><td>Known User</td><td>{fruit.user}</td></tr>
              <tr><td>First Appeared</td><td>Chapter {fruit.debutChapter} — {fruit.debutArc}</td></tr>
            </tbody>
          </table>
        </section>

      </div>
    </main>
  );
}
