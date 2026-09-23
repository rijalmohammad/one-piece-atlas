import { notFound } from "next/navigation";
import Link from "next/link";
import { ARC_GROUPS, LOCS } from "@/lib/locations";

type ArcEntry = { arc: string; keys: string[]; region: string; isFiller?: boolean };

function getAllArcs(): ArcEntry[] {
  const entries: ArcEntry[] = [];
  for (const [region, groups] of Object.entries(ARC_GROUPS)) {
    for (const g of groups) {
      entries.push({ arc: g.arc, keys: g.keys, region, isFiller: g.isFiller });
    }
  }
  return entries;
}

function toArcSlug(arc: string) {
  return arc.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function generateStaticParams() {
  return getAllArcs().map((a) => ({ arc: toArcSlug(a.arc) }));
}

export default async function ArcDetailPage({ params }: { params: Promise<{ arc: string }> }) {
  const { arc } = await params;
  const all = getAllArcs();
  const entry = all.find((a) => toArcSlug(a.arc) === arc);
  if (!entry) notFound();

  const locations = entry.keys.map((k) => ({ key: k, loc: LOCS[k] })).filter((x) => !!x.loc);

  return (
    <main className="detail-page">
      <nav className="detail-nav">
        <Link href="/" className="detail-back">← Back to Atlas</Link>
      </nav>

      <div className="detail-hero" style={{ background: "rgba(240,176,32,0.06)" }}>
        <div className="detail-hero-info" style={{ paddingLeft: 0 }}>
          <div className="detail-eyebrow">
            {entry.region === "eastblue" ? "East Blue" : "Grand Line"}
            {entry.isFiller ? " · Anime Only" : ""}
          </div>
          <h1 className="detail-title">{entry.arc}</h1>
          {entry.isFiller && (
            <span className="arc-filler-badge" style={{ marginTop: 6, display: "inline-block" }}>
              Anime Only
            </span>
          )}
          <div className="detail-tags" style={{ marginTop: 10 }}>
            <span className="detail-tag">{locations.length} location{locations.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>

      <div className="detail-body">
        <section className="detail-section">
          <h2 className="detail-section-title">Locations</h2>
          <div className="detail-location-list">
            {locations.map(({ key, loc }) => (
              <Link key={key} href={`/locations/${key}`} className="detail-location-card">
                <div className="detail-location-eyebrow">{loc!.eyebrow}</div>
                <div className="detail-location-title">{loc!.title}</div>
                <div className="detail-location-lore">{loc!.lore.slice(0, 120)}…</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
