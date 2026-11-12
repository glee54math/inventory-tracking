import { Link } from "react-router-dom";
import {
    Baby,
    Backpack,
    BookOpen,
    BookText,
    GraduationCap,
    Sigma,
    Sparkles,
    type LucideIcon,
} from "lucide-react";
import { countPreviewableFilesByLevel } from "./levelFileHelpers";
import "./math-levels/shared/styles/lab-base.css";
import "./LevelFilesPage_styles.css";

// Broad glob over every file in every level folder — countPreviewableFilesByLevel
// filters out multi-file skills' supporting files (see levelFileHelpers.ts) so this
// badge count always matches what LevelFilesPage.tsx actually lists for that level.
const mathModules = import.meta.glob('./math-levels/*/*.tsx');
const englishModules = import.meta.glob('./english-levels/*/*.tsx');

const mathFileCounts = countPreviewableFilesByLevel(mathModules, './math-levels/');
const englishFileCounts = countPreviewableFilesByLevel(englishModules, './english-levels/');

const allMathIds = Object.keys(mathFileCounts).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
);

const mathLevels = (() => {
    const categories: Record<string, string[]> = {
        "Kindergarten": [],
        "Elementary School": [],
        "Middle School": [],
        "High School": [],
        "Special Topics": [],
    };
    for (const id of allMathIds) {
        if (/^MK\d+$/.test(id))      categories["Kindergarten"].push(id);
        else if (/^MG\d+$/.test(id)) categories["Elementary School"].push(id);
        else if (/^MM\d+$/.test(id)) categories["Middle School"].push(id);
        else if (/^MH/.test(id))     categories["High School"].push(id);
        else                          categories["Special Topics"].push(id);
    }
    return categories;
})();

const englishLevels: Record<string, string[]> = {
    "Kindergarten": ["EK1", "EK2", "EK3", "EK4"],
    "Elementary School": ["EG1", "EG1B", "EG2", "EG2B", "EG3", "EG4", "EG5", "EG6", "EG7", "EG8", "EG9", "EG10"],
    "Middle School": ["EM1", "EM2", "EM3", "EM4", "EM5"],
    "High School": ["EH1", "EH2", "EH3", "EH4", "EH5", "EH6"],
};

// Each subject gets one accent color (Math blue, English green), set as CSS
// variables on its card so the chips and icons pick it up.
type SubjectMeta = { icon: LucideIcon; className: string };

const SUBJECT_META: Record<string, SubjectMeta> = {
    Math: { icon: Sigma, className: "all-levels-subject--math" },
    English: { icon: BookText, className: "all-levels-subject--english" },
};

const GRADE_BAND_ICON: Record<string, LucideIcon> = {
    "Kindergarten": Baby,
    "Elementary School": Backpack,
    "Middle School": BookOpen,
    "High School": GraduationCap,
    "Special Topics": Sparkles,
};

function GradeBandGroup({
    title,
    levels,
    fileCounts,
}: {
    title: string;
    levels: string[];
    fileCounts: Record<string, number>;
}) {
    if (levels.length === 0) return null;

    const BandIcon = GRADE_BAND_ICON[title] ?? Sparkles;

    return (
        <div className="all-levels-band">
            <div className="all-levels-band-head">
                <BandIcon size={18} className="all-levels-band-icon" />
                <h3>{title}</h3>
                <span className="all-levels-band-count">{levels.length}</span>
            </div>
            <div className="all-levels-chips">
                {levels.map((level) => (
                    <Link key={level} to={`/levels/${level}/files`} className="all-levels-chip">
                        {level}
                        {/* Only worth flagging once there's more than one file to browse into —
                            every level folder has at least its (possibly empty) shell file. */}
                        {fileCounts[level] > 1 && <span className="all-levels-chip-badge">{fileCounts[level]}</span>}
                    </Link>
                ))}
            </div>
        </div>
    );
}

function SubjectCard({
    title,
    levels,
    fileCounts,
}: {
    title: string;
    levels: Record<string, string[]>;
    fileCounts: Record<string, number>;
}) {
    const meta = SUBJECT_META[title];
    const SubjectIcon = meta.icon;
    const total = Object.values(levels).reduce((n, l) => n + l.length, 0);

    return (
        <section className={`all-levels-subject ${meta.className}`}>
            <div className="all-levels-subject-head">
                <span className="all-levels-subject-icon">
                    <SubjectIcon size={22} />
                </span>
                <h2>{title}</h2>
                <span className="level-files-count">{total} levels</span>
            </div>
            <div className="all-levels-bands">
                {Object.entries(levels).map(([group, groupLevels]) => (
                    <GradeBandGroup key={group} title={group} levels={groupLevels} fileCounts={fileCounts} />
                ))}
            </div>
        </section>
    );
}

export default function AllLevelsPage() {
    return (
        <div className="level-files-page lab-base">
            <div className="level-files-head">
                <div className="level-files-hero">
                    <div>
                        <h1>All Levels</h1>
                        <p className="level-files-band">Browse every level and its labs, by subject and grade band.</p>
                    </div>
                </div>
            </div>

            <div className="all-levels-subjects">
                <SubjectCard title="Math" levels={mathLevels} fileCounts={mathFileCounts} />
                <SubjectCard title="English" levels={englishLevels} fileCounts={englishFileCounts} />
            </div>
        </div>
    );
}
