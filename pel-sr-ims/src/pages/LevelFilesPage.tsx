import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MATH_LEVELS } from "../utils/types";
import { LEVEL_SKILLS } from "../utils/levelSubsections";
import { previewableFilesForLevel } from "./levelFileHelpers";
import { UnitPreviewCarousel } from "./math-levels/shared/components/UnitPreviewCarousel";
import { StackedFractions } from "./math-levels/shared/components/MathText";
import type { Unit } from "./math-levels/shared/units/types";
import "./math-levels/shared/styles/lab-base.css";
import "./LevelFilesPage_styles.css";

const mathModules = import.meta.glob('./math-levels/*/*.tsx');
const englishModules = import.meta.glob('./english-levels/*/*.tsx');

// Only real Labs have a units/index.ts — this is what separates an actual Lab
// (carousel-worthy) from a stray/supporting file that still passes
// previewableFilesForLevel's filter (e.g. MG5.tsx, a leftover demo file with
// no units folder of its own).
const mathUnitModules = import.meta.glob<{ units: Unit[] }>('./math-levels/*/*/units/index.ts');

function filesForLevel(levelId: string, isMath: boolean): string[] {
    const modules = isMath ? mathModules : englishModules;
    const prefix = isMath ? './math-levels/' : './english-levels/';

    return previewableFilesForLevel(modules, prefix, levelId)
        // Shell file (name === levelId) first, then alphabetical.
        .sort((a, b) => {
            if (a === levelId) return -1;
            if (b === levelId) return 1;
            return a.localeCompare(b);
        });
}

// Fallback for Labs LEVEL_SKILLS hasn't labeled yet, e.g. "EvenOddAndArraysLab"
// -> "Even Odd And Arrays".
function humanizeLabFolder(folder: string): string {
    const stripped = folder.endsWith("Lab") ? folder.slice(0, -3) : folder;
    return stripped.replace(/([a-z0-9])([A-Z])/g, "$1 $2").trim();
}

// Same grade bands as AllLevelsPage's groups.
function gradeBand(levelId: string): string {
    if (/^[ME]K/.test(levelId)) return "Kindergarten";
    if (/^[ME]G/.test(levelId)) return "Elementary School";
    if (/^[ME]M/.test(levelId)) return "Middle School";
    if (/^[ME]H/.test(levelId)) return "High School";
    return "Special Topics";
}

interface LevelLab {
    componentFile: string;
    label: string;
    units: Unit[];
}

export default function LevelFilesPage() {
    const { levelId } = useParams<{ levelId: string }>();
    const navigate = useNavigate();
    const [labs, setLabs] = useState<LevelLab[] | null>(null);

    const isMath = levelId ? MATH_LEVELS.includes(levelId) : false;
    const files = levelId ? filesForLevel(levelId, isMath) : [];

    // LEVEL_SKILLS already maintains a human-readable label per Lab componentFile
    // (for the practice-session skill picker) — reuse it here instead of guessing.
    const labelByComponentFile = useMemo(() => {
        const map = new Map<string, string>();
        for (const skills of Object.values(LEVEL_SKILLS)) {
            for (const skill of skills) {
                if ("componentFile" in skill && skill.label) {
                    map.set(skill.componentFile, skill.label);
                }
            }
        }
        return map;
    }, []);

    useEffect(() => {
        if (!levelId || !isMath) {
            setLabs([]);
            return;
        }

        const prefix = `./math-levels/${levelId}/`;
        const entries = Object.entries(mathUnitModules).filter(([path]) => path.startsWith(prefix));
        if (entries.length === 0) {
            setLabs([]);
            return;
        }

        let cancelled = false;
        Promise.all(
            entries.map(async ([path, loadUnits]) => {
                const labFolder = path.slice(prefix.length).split("/")[0];
                const componentFile = `${levelId}_${labFolder}`;
                const mod = await loadUnits();
                return {
                    componentFile,
                    label: labelByComponentFile.get(componentFile) ?? humanizeLabFolder(labFolder),
                    units: mod.units,
                };
            })
        ).then((loaded) => {
            if (cancelled) return;
            loaded.sort((a, b) => a.label.localeCompare(b.label));
            setLabs(loaded);
        });

        return () => {
            cancelled = true;
        };
    }, [levelId, isMath, labelByComponentFile]);

    if (!levelId) return null;

    const subject = isMath ? "Math" : "English";
    const count = labs && labs.length > 0 ? labs.length : files.length;
    const countLabel = labs && labs.length > 0 ? (count === 1 ? "1 lab" : `${count} labs`) : count === 1 ? "1 file" : `${count} files`;

    return (
        <div className="level-files-page lab-base">
            <div className="level-files-head">
                <Link to="/levels/LevelsPage" className="level-back-btn">
                    <span aria-hidden="true">←</span> All Levels
                </Link>
                <div className="level-files-hero">
                    <div>
                        <h1>{levelId}</h1>
                        <p className="level-files-band">
                            {subject} · {gradeBand(levelId)}
                        </p>
                    </div>
                    {labs !== null && count > 0 && <span className="level-files-count">{countLabel}</span>}
                </div>
            </div>

            {labs === null ? (
                <p className="level-files-empty">Loading…</p>
            ) : labs.length > 0 ? (
                <StackedFractions>
                    <h2 className="level-files-section-title">Labs</h2>
                    <div className="level-files-labs">
                        {labs.map((lab) => {
                            const open = () => navigate(`/levels/${levelId}/${lab.componentFile}`);
                            return (
                                <section key={lab.componentFile} className="level-files-lab-card">
                                    <div className="level-files-lab-top">
                                        <h2>{lab.label}</h2>
                                        <span className="level-files-units">
                                            {lab.units.length === 1 ? "1 unit" : `${lab.units.length} units`}
                                        </span>
                                    </div>
                                    <UnitPreviewCarousel units={lab.units} onPick={open} />
                                    <button type="button" className="level-files-open" onClick={open}>
                                        Open lab
                                    </button>
                                </section>
                            );
                        })}
                    </div>
                </StackedFractions>
            ) : files.length === 0 ? (
                <p className="level-files-empty">No files found for {levelId}.</p>
            ) : (
                <ul className="level-files-list">
                    {files.map((file) => (
                        <li key={file}>
                            <Link to={`/levels/${levelId}/${file}`} className="level-back-btn">
                                {file}
                                {file === levelId && <span className="level-files-shell-tag">(shell)</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
