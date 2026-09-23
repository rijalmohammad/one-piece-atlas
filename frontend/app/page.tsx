"use client";

import { useState, useCallback, lazy, Suspense } from "react";
import ArcSection from "@/components/ArcSection";
import SidePanel from "@/components/SidePanel";
import { ARC_GROUPS, LOCS, REGION_META } from "@/lib/locations";
import { CHARACTERS, Character } from "@/lib/characters";
import { DEVIL_FRUITS, DevilFruit } from "@/lib/devilfruits";

const CharactersTab   = lazy(() => import("@/components/CharactersTab"));
const DevilFruitsTab  = lazy(() => import("@/components/DevilFruitsTab"));
const ArcTimelineTab  = lazy(() => import("@/components/ArcTimelineTab"));
const CharacterPanel  = lazy(() => import("@/components/CharacterPanel"));
const DevilFruitPanel = lazy(() => import("@/components/DevilFruitPanel"));

type ActiveTab = "map" | "characters" | "devilfruits" | "timeline";

export default function Home() {
  const [activeTab, setActiveTab]       = useState<ActiveTab>("map");
  const [region, setRegion]             = useState<"eastblue" | "grandline">("eastblue");
  const [activeKey, setActiveKey]       = useState<string | null>(null);
  const [maxChapter, setMaxChapter]     = useState(9999);
  const [activeChar, setActiveChar]     = useState<Character | null>(null);
  const [activeFruit, setActiveFruit]   = useState<DevilFruit | null>(null);

  const meta = REGION_META[region];

  const openLoc = useCallback((key: string) => { setActiveKey(key); }, []);
  const closePanel = useCallback(() => { setActiveKey(null); }, []);
  const changeRegion = useCallback((r: string) => {
    setRegion(r as "eastblue" | "grandline");
    setActiveKey(null);
  }, []);

  const openChar  = useCallback((c: Character)  => { setActiveChar(c); setActiveFruit(null); }, []);
  const closeChar = useCallback(() => { setActiveChar(null); }, []);
  const openFruit  = useCallback((f: DevilFruit) => { setActiveFruit(f); setActiveChar(null); }, []);
  const closeFruit = useCallback(() => { setActiveFruit(null); }, []);

  const activeLoc  = activeKey ? LOCS[activeKey] ?? null : null;
  const locPanelOpen  = activeTab === "map" && !!activeKey;
  const charPanelOpen = activeTab === "characters" && !!activeChar;
  const fruitPanelOpen = activeTab === "devilfruits" && !!activeFruit;
  const anyPanelOpen  = locPanelOpen || charPanelOpen || fruitPanelOpen;

  return (
    <>
      <nav className="topnav">
        <span className="topnav-logo">☠ Grand Line Atlas</span>
        <div className="topnav-divider" />
        <div className="topnav-tabs">
          {([
            ["map","World Map"],
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
          {activeTab === "map" && (
            <select
              className="region-select"
              value={region}
              onChange={(e) => changeRegion(e.target.value)}
            >
              {Object.entries(REGION_META).map(([key, m]) => (
                <option key={key} value={key}>{m.label}</option>
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
              max={597}
              step={1}
              value={maxChapter >= 9999 ? 597 : maxChapter}
              onChange={(e) => {
                const v = Number(e.target.value);
                setMaxChapter(v >= 597 ? 9999 : v);
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
            <div className="arcs-layout">
              {ARC_GROUPS[region].map((arcGroup) => (
                <ArcSection
                  key={arcGroup.arc}
                  arcGroup={arcGroup}
                  activeKey={activeKey}
                  onSelect={openLoc}
                  colSpan={Math.min(arcGroup.keys.length, 4)}
                />
              ))}
            </div>
          </>
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

      {/* Mobile overlay */}
      {anyPanelOpen && (
        <div
          className="map-overlay"
          style={{ opacity: 1, pointerEvents: "all" }}
          onClick={() => { closePanel(); closeChar(); closeFruit(); }}
        />
      )}

      {/* Location panel */}
      <SidePanel
        locationKey={activeTab === "map" ? activeKey : null}
        loc={activeTab === "map" ? activeLoc : null}
        onClose={closePanel}
        maxChapter={maxChapter}
      />

      {/* Character panel */}
      <Suspense fallback={null}>
        <CharacterPanel character={charPanelOpen ? activeChar : null} onClose={closeChar} />
      </Suspense>

      {/* Devil Fruit panel */}
      <Suspense fallback={null}>
        <DevilFruitPanel fruit={fruitPanelOpen ? activeFruit : null} onClose={closeFruit} />
      </Suspense>
    </>
  );
}
