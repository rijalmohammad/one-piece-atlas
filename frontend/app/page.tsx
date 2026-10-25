"use client";

import { useState, useCallback, lazy, Suspense, useEffect } from "react";
import IslandCard from "@/components/IslandCard";
import WorldMap from "@/components/WorldMap";
import SidePanel from "@/components/SidePanel";
import HomeChatBox from "@/components/HomeChatBox";
import { ARC_GROUPS, LOCS, REGION_META } from "@/lib/locations";
import { CHARACTERS, Character } from "@/lib/characters";
import { DEVIL_FRUITS, DevilFruit } from "@/lib/devilfruits";
import { ARCS } from "@/lib/arcs";

const CharactersTab   = lazy(() => import("@/components/CharactersTab"));
const DevilFruitsTab  = lazy(() => import("@/components/DevilFruitsTab"));
const ArcTimelineTab  = lazy(() => import("@/components/ArcTimelineTab"));
const CharacterPanel  = lazy(() => import("@/components/CharacterPanel"));
const DevilFruitPanel = lazy(() => import("@/components/DevilFruitPanel"));

type ActiveTab = "home" | "map" | "characters" | "devilfruits" | "timeline";

const REGION_ORDER = ["eastblue", "grandline", "newworld"] as const;

export default function Home() {
  const [activeTab, setActiveTab]     = useState<ActiveTab>("home");
  const [filter, setFilter]           = useState<string>("all");
  const [activeKey, setActiveKey]     = useState<string | null>(null);
  const [maxChapter, setMaxChapter]   = useState(9999);
  const [activeChar, setActiveChar]   = useState<Character | null>(null);
  const [activeFruit, setActiveFruit] = useState<DevilFruit | null>(null);
  const [theme, setTheme]             = useState<"dark" | "light">("dark");
  const [mapView, setMapView]         = useState<"chart" | "cards">("chart");
  const [daily, setDaily]             = useState<{ char: Character; fruit: DevilFruit } | null>(null);

  useEffect(() => {
    const day = Math.floor(Date.now() / 86400000);
    setDaily({
      char: CHARACTERS[day % CHARACTERS.length],
      fruit: DEVIL_FRUITS[(day * 7 + 3) % DEVIL_FRUITS.length],
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const openLoc    = useCallback((key: string) => { setActiveKey(key); }, []);
  const closePanel = useCallback(() => { setActiveKey(null); }, []);
  const changeFilter = useCallback((f: string) => { setFilter(f); setActiveKey(null); }, []);

  const openChar   = useCallback((c: Character)  => { setActiveChar(c); setActiveFruit(null); }, []);
  const closeChar  = useCallback(() => { setActiveChar(null); }, []);
  const openFruit  = useCallback((f: DevilFruit) => { setActiveFruit(f); setActiveChar(null); }, []);
  const closeFruit = useCallback(() => { setActiveFruit(null); }, []);

  const activeLoc      = activeKey ? LOCS[activeKey] ?? null : null;
  const locPanelOpen   = activeTab === "map" && !!activeKey;
  const charPanelOpen  = activeTab === "characters" && !!activeChar;
  const fruitPanelOpen = activeTab === "devilfruits" && !!activeFruit;
  const anyPanelOpen   = locPanelOpen || charPanelOpen || fruitPanelOpen;

  const visibleRegions = filter === "all"
    ? REGION_ORDER
    : REGION_ORDER.filter((r) => r === filter);

  return (
    <>
      <nav className="topnav">
        <span className="topnav-logo">☠ One Piece Atlas</span>
        <div className="topnav-divider" />
        <div className="topnav-tabs">
          {([
            ["home","Home"],
            ["map","Locations"],
            ["characters","Characters"],
            ["devilfruits","Devil Fruits"],
            ["timeline","Arc Timeline"],
          ] as [ActiveTab, string][]).map(([key, label]) => (
            <button
              key={key}
              className={`topnav-tab${activeTab === key ? " active" : ""}`}
              onClick={() => {
                setActiveTab(key);
                setActiveKey(null);
                setActiveChar(null);
                setActiveFruit(null);
              }}
            >{label}</button>
          ))}
        </div>
        <div className="topnav-right">
          <button
            className="theme-toggle"
            onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀" : "🌙"}
          </button>
          {activeTab === "map" && (
            <select
              className="region-select"
              value={filter}
              onChange={(e) => changeFilter(e.target.value)}
            >
              <option value="all">All Locations</option>
              {REGION_ORDER.map((key) => (
                <option key={key} value={key}>{REGION_META[key].label}</option>
              ))}
            </select>
          )}
          <div className="spoiler-control" title="Spoiler-safe: hide chapters above this number">
            <label htmlFor="chapter-slider" className="spoiler-label">
              {maxChapter >= 9999 ? "All chapters" : `Ch. ≤ ${maxChapter}`}
            </label>
            <input
              id="chapter-slider"
              type="range"
              min={1}
              max={1100}
              step={1}
              value={maxChapter >= 9999 ? 1100 : maxChapter}
              onChange={(e) => {
                const v = Number(e.target.value);
                setMaxChapter(v >= 1100 ? 9999 : v);
              }}
              className="chapter-slider"
            />
          </div>
        </div>
      </nav>

      <div
        className={`content-area${anyPanelOpen ? " panel-open" : ""}`}
        id="contentArea"
      >
        {activeTab === "map" && (
          <>
            <div className="view-toggle" role="tablist" aria-label="Location view">
              <button
                className={mapView === "chart" ? "active" : ""}
                onClick={() => setMapView("chart")}
              >🧭 Sea Chart</button>
              <button
                className={mapView === "cards" ? "active" : ""}
                onClick={() => setMapView("cards")}
              >▦ Cards</button>
            </div>
            {visibleRegions.map((regionKey) => {
              const meta = REGION_META[regionKey];
              const keys = (ARC_GROUPS[regionKey] ?? []).flatMap((g) => g.keys);
              return (
                <div key={regionKey} className="region-section">
                  {regionKey === "newworld" && filter === "all" && mapView === "chart" && (
                    <div className="redline-divider" aria-hidden="true">
                      <span>The Red Line</span>
                    </div>
                  )}
                  <div className={`region-hero ${meta.heroClass}`}>
                    <div className="hero-sea-label">{meta.label.toUpperCase()}</div>
                    <div className="region-hero-title">{meta.label}</div>
                    <div className="region-hero-sub">{meta.sub}</div>
                    <div className="hero-tags">
                      {meta.tags.map((t) => (
                        <span key={t} className="hero-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                  {mapView === "chart" ? (
                    <WorldMap regionKey={regionKey} activeKey={activeKey} onSelect={openLoc} />
                  ) : (
                    <div className="islands-grid">
                      {keys.map((key) => {
                        const loc = LOCS[key];
                        if (!loc) return null;
                        return (
                          <IslandCard
                            key={key}
                            locationKey={key}
                            loc={loc}
                            isActive={activeKey === key}
                            onClick={() => openLoc(key)}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {activeTab === "home" && (
          <div className="home-page">
            <div className="home-hero">
              <div className="home-stars" aria-hidden="true" />
              <svg className="home-compass" viewBox="0 0 200 200" aria-hidden="true">
                <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="100" cy="100" r="76" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 5" />
                <path d="M100 8 L112 88 L192 100 L112 112 L100 192 L88 112 L8 100 L88 88 Z" fill="currentColor" opacity="0.55" />
                <path d="M100 34 L106 94 L166 100 L106 106 L100 166 L94 106 L34 100 L94 94 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="100" cy="100" r="6" fill="currentColor" />
              </svg>
              <div className="home-hero-ghost">ONE PIECE</div>
              <div className="home-hero-eyebrow">One Piece Atlas</div>
              <h1 className="home-hero-title">The World of One Piece</h1>
              <p className="home-hero-desc">
                A complete lore reference for the One Piece universe — covering every island,
                character, and devil fruit from East Blue to the Final Sea. Explore the world map,
                browse characters and devil fruits, or ask the AI anything about the lore.
              </p>
              <div className="home-feature-pills">
                <button className="home-pill" onClick={() => setActiveTab("map")}>🗺 Locations</button>
                <button className="home-pill" onClick={() => setActiveTab("characters")}>⚔ Characters</button>
                <button className="home-pill" onClick={() => setActiveTab("devilfruits")}>🍎 Devil Fruits</button>
                <button className="home-pill" onClick={() => setActiveTab("timeline")}>📜 Arc Timeline</button>
              </div>
              <div className="home-sea" aria-hidden="true">
                <svg className="home-wave home-wave-back" viewBox="0 0 1200 60" preserveAspectRatio="none">
                  <path d="M0 30 Q75 4 150 30 T300 30 T450 30 T600 30 T750 30 T900 30 T1050 30 T1200 30 V60 H0 Z" />
                </svg>
                <svg className="home-wave home-wave-front" viewBox="0 0 1200 60" preserveAspectRatio="none">
                  <path d="M0 34 Q75 10 150 34 T300 34 T450 34 T600 34 T750 34 T900 34 T1050 34 T1200 34 V60 H0 Z" />
                </svg>
              </div>
            </div>

            <div className="home-stats">
              {([
                [Object.keys(LOCS).length, "Islands", "map"],
                [CHARACTERS.length, "Characters", "characters"],
                [DEVIL_FRUITS.length, "Devil Fruits", "devilfruits"],
                [ARCS.length, "Story Arcs", "timeline"],
              ] as [number, string, ActiveTab][]).map(([n, label, tab]) => (
                <button key={label} className="home-stat" onClick={() => setActiveTab(tab)}>
                  <span className="home-stat-num">{n}</span>
                  <span className="home-stat-label">{label}</span>
                </button>
              ))}
            </div>

            {daily && (
              <div className="home-daily">
                <button
                  className="home-daily-card"
                  onClick={() => { setActiveTab("characters"); openChar(daily.char); }}
                >
                  <span className="home-daily-label">Character of the Day</span>
                  <span className="home-daily-body">
                    {daily.char.imageFile ? (
                      <img className="home-daily-img" src={`/chars/${daily.char.imageFile}`} alt="" />
                    ) : (
                      <span className="home-daily-img home-daily-initial">{daily.char.initial}</span>
                    )}
                    <span className="home-daily-text">
                      <span className="home-daily-name">{daily.char.name}</span>
                      <span className="home-daily-meta">
                        {daily.char.faction} · {daily.char.role}
                      </span>
                      {daily.char.bounty && <span className="home-daily-bounty">฿ {daily.char.bounty}</span>}
                    </span>
                  </span>
                </button>
                <button
                  className="home-daily-card"
                  onClick={() => { setActiveTab("devilfruits"); openFruit(daily.fruit); }}
                >
                  <span className="home-daily-label">Devil Fruit of the Day</span>
                  <span className="home-daily-body">
                    <span
                      className="home-daily-img home-daily-initial"
                      style={{ color: daily.fruit.userColor }}
                    >
                      🍎
                    </span>
                    <span className="home-daily-text">
                      <span className="home-daily-name">{daily.fruit.name}</span>
                      <span className="home-daily-meta">
                        {daily.fruit.type} · {daily.fruit.user}
                      </span>
                      <span className="home-daily-meta">{daily.fruit.englishName}</span>
                    </span>
                  </span>
                </button>
              </div>
            )}

            <div className="home-chat-section">
              <div className="home-chat-label">Ask the Grand Line Oracle</div>
              <div className="home-chat-sub">Ask anything about One Piece lore, characters, history, or devil fruits.</div>
              <HomeChatBox />
            </div>
          </div>
        )}

        {activeTab === "characters" && (
          <Suspense fallback={<div className="tab-loading">Loading characters…</div>}>
            <CharactersTab onSelect={openChar} activeChar={activeChar} />
          </Suspense>
        )}

        {activeTab === "devilfruits" && (
          <Suspense fallback={<div className="tab-loading">Loading Devil Fruits…</div>}>
            <DevilFruitsTab onSelect={openFruit} activeFruit={activeFruit} />
          </Suspense>
        )}

        {activeTab === "timeline" && (
          <Suspense fallback={<div className="tab-loading">Loading timeline…</div>}>
            <ArcTimelineTab />
          </Suspense>
        )}
      </div>

      {anyPanelOpen && (
        <div
          className="map-overlay"
          style={{ opacity: 1, pointerEvents: "all" }}
          onClick={() => { closePanel(); closeChar(); closeFruit(); }}
        />
      )}

      <SidePanel
        locationKey={activeTab === "map" ? activeKey : null}
        loc={activeTab === "map" ? activeLoc : null}
        onClose={closePanel}
        maxChapter={maxChapter}
      />

      <Suspense fallback={null}>
        <CharacterPanel character={charPanelOpen ? activeChar : null} onClose={closeChar} />
      </Suspense>

      <Suspense fallback={null}>
        <DevilFruitPanel fruit={fruitPanelOpen ? activeFruit : null} onClose={closeFruit} />
      </Suspense>
    </>
  );
}
