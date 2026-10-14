// MG11_GeometryLab.tsx — tabs for each standard, plus a per-browser solved
// counter. Ported from a converted Claude Artifact (MG11_Geometry_Lab/);
// supporting modules/shapes/lib/components live one level deeper, in
// GeometryLab/, same split MultDivFractionLab uses for its own diagrams/units.
import React, { useEffect, useState } from "react";
import "./MG11_GeometryLab_styles.css";
import { AreaModule } from "./GeometryLab/modules/Area";
import { VolumeModule } from "./GeometryLab/modules/Volume";
import { CoordinateModule } from "./GeometryLab/modules/Coordinate";
import { NetsModule } from "./GeometryLab/modules/Nets";
import { WordProblemsModule } from "./GeometryLab/modules/WordProblems";

type TabId = "area" | "volume" | "coord" | "nets" | "word";
const TABS: { id: TabId; label: string; std: string }[] = [
  { id: "area", label: "Area", std: "6.G.1" },
  { id: "volume", label: "Volume", std: "6.G.2" },
  { id: "coord", label: "Coordinate plane", std: "6.G.3" },
  { id: "nets", label: "Nets & surface area", std: "6.G.4" },
  { id: "word", label: "Word problems", std: "Mixed" },
];

const KEY = "pel-geometry-lab-progress";
function loadProgress(): Record<TabId, number> {
  const empty = { area: 0, volume: 0, coord: 0, nets: 0, word: 0 };
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

function GeometryLab() {
  const [tab, setTab] = useState<TabId>("area");
  const [progress, setProgress] = useState(loadProgress);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress));
    } catch {
      /* storage unavailable */
    }
  }, [progress]);
  const solved = (id: TabId) => () => setProgress((p) => ({ ...p, [id]: p[id] + 1 }));
  const total = Object.values(progress).reduce((a, b) => a + b, 0);

  return (
    <div className="geometry-lab">
      <header className="top">
        <div className="brand">
          <svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true">
            <polygon points="6,32 34,32 34,10" fill="var(--c-gold-soft)" stroke="var(--c-gold)" strokeWidth="2.5" strokeLinejoin="round" />
            <rect x="6" y="14" width="14" height="18" fill="var(--c-blue-soft)" stroke="var(--c-blue)" strokeWidth="2.5" />
          </svg>
          <div>
            <h1>Geometry Lab</h1>
            <p>Grade 6 geometry practice</p>
          </div>
        </div>
        <div className="score" title="Problems solved in this browser">
          <span className="score-num">{total}</span>
          <span>solved</span>
        </div>
      </header>
      <nav className="tabs" role="tablist" aria-label="Topics">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={"tab" + (tab === t.id ? " on" : "")} onClick={() => setTab(t.id)}>
            <span className="tab-label">{t.label}</span>
            <span className="tab-std">
              {t.std}
              {progress[t.id] ? <span className="tab-count">{progress[t.id]} ✓</span> : null}
            </span>
          </button>
        ))}
      </nav>
      <main>
        {tab === "area" && <AreaModule onSolved={solved("area")} />}
        {tab === "volume" && <VolumeModule onSolved={solved("volume")} />}
        {tab === "coord" && <CoordinateModule onSolved={solved("coord")} />}
        {tab === "nets" && <NetsModule onSolved={solved("nets")} />}
        {tab === "word" && <WordProblemsModule onSolved={solved("word")} />}
      </main>
    </div>
  );
}

export { GeometryLab };
export default GeometryLab;
