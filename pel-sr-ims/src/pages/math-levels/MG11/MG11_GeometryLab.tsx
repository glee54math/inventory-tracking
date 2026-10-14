// MG11_GeometryLab.tsx — tabs for each standard, with Firestore-backed
// mastery progress. Ported from a converted Claude Artifact
// (MG11_Geometry_Lab/); supporting modules/shapes/lib/components live one
// level deeper, in GeometryLab/, same split MultDivFractionLab uses for its
// own diagrams/units.
import React, { useState } from "react";
import "./MG11_GeometryLab_styles.css";
import { AreaModule, areaProgressKey } from "./GeometryLab/modules/Area";
import { VolumeModule } from "./GeometryLab/modules/Volume";
import { CoordinateModule } from "./GeometryLab/modules/Coordinate";
import { NetsModule } from "./GeometryLab/modules/Nets";
import { WordProblemsModule } from "./GeometryLab/modules/WordProblems";
import { Stars } from "./GeometryLab/components/ui";
import { MASTERY_GOAL, useModuleProgress } from "../../../hooks/useModuleProgress";
import { useStudentContext } from "../../../components/student_portal/StudentContext";

const MODULE_ID = "MG11_GeometryLab";

type TabId = "area" | "volume" | "coord" | "nets" | "word";
const TABS: { id: TabId; label: string; std: string }[] = [
  { id: "area", label: "Area", std: "6.G.1" },
  { id: "volume", label: "Volume", std: "6.G.2" },
  { id: "coord", label: "Coordinate plane", std: "6.G.3" },
  { id: "nets", label: "Nets & surface area", std: "6.G.4" },
  { id: "word", label: "Word problems", std: "Mixed" },
];

function GeometryLab() {
  const { currentStudent } = useStudentContext();
  const { progress, record, reset } = useModuleProgress(
    currentStudent?.id ?? null,
    currentStudent?.location ?? null,
    MODULE_ID
  );
  const [tab, setTab] = useState<TabId>("area");
  const [confirmReset, setConfirmReset] = useState(false);

  const total = Object.values(progress).reduce((sum, u) => sum + u.solved, 0);
  // Area has no single progress key of its own — mastery lives per shape
  // (area-rect, area-right, ...) — so its tab total sums across all of them.
  const areaSolved = Object.entries(progress)
    .filter(([key]) => key.startsWith("area-"))
    .reduce((sum, [, u]) => sum + u.solved, 0);

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
        <div className="score" title="Problems solved">
          <span className="score-num">{total}</span>
          <span>solved</span>
          <button
            className="link"
            onClick={() => {
              if (confirmReset) {
                reset();
                setConfirmReset(false);
              } else setConfirmReset(true);
            }}
            onBlur={() => setConfirmReset(false)}
          >
            {confirmReset ? "Click again to clear all stars" : "Reset progress"}
          </button>
        </div>
      </header>
      <nav className="tabs" role="tablist" aria-label="Topics">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={"tab" + (tab === t.id ? " on" : "")} onClick={() => setTab(t.id)}>
            <span className="tab-label">{t.label}</span>
            <span className="tab-std">
              {t.std}
              {t.id === "area" ? (
                areaSolved ? <span className="tab-count">{areaSolved} solved</span> : null
              ) : (
                <Stars n={progress[t.id]?.clean ?? 0} max={MASTERY_GOAL} label={`${t.label} mastery`} />
              )}
            </span>
          </button>
        ))}
      </nav>
      <main>
        {tab === "area" && (
          <AreaModule
            progress={progress}
            onSolved={(clean, shapeId) => record(areaProgressKey(shapeId), clean)}
          />
        )}
        {tab === "volume" && <VolumeModule onSolved={(clean) => record("volume", clean)} />}
        {tab === "coord" && <CoordinateModule onSolved={(clean) => record("coord", clean)} />}
        {tab === "nets" && <NetsModule onSolved={(clean) => record("nets", clean)} />}
        {tab === "word" && <WordProblemsModule onSolved={(clean) => record("word", clean)} />}
      </main>
    </div>
  );
}

export { GeometryLab };
export default GeometryLab;
