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

// Full literal class strings per subject (never interpolated) so Tailwind's
// static scanner can find them — same pattern Sidebar.tsx uses for its
// accent/active-state maps.
type SubjectMeta = {
    icon: LucideIcon;
    headerBg: string;
    iconBg: string;
    iconText: string;
    bandIconText: string;
    chipHoverBorder: string;
    chipHoverBg: string;
    chipHoverText: string;
    chipFocusRing: string;
    chipActiveBg: string;
};

const SUBJECT_META: Record<string, SubjectMeta> = {
    Math: {
        icon: Sigma,
        headerBg: "bg-primary-50/60",
        iconBg: "bg-primary-100",
        iconText: "text-primary-700",
        bandIconText: "text-primary-400",
        chipHoverBorder: "hover:border-primary-300",
        chipHoverBg: "hover:bg-primary-50",
        chipHoverText: "hover:text-primary-700",
        chipFocusRing: "focus-visible:ring-primary-400",
        chipActiveBg: "active:bg-primary-100",
    },
    English: {
        icon: BookText,
        headerBg: "bg-tertiary-50/60",
        iconBg: "bg-tertiary-100",
        iconText: "text-tertiary-700",
        bandIconText: "text-tertiary-400",
        chipHoverBorder: "hover:border-tertiary-300",
        chipHoverBg: "hover:bg-tertiary-50",
        chipHoverText: "hover:text-tertiary-700",
        chipFocusRing: "focus-visible:ring-tertiary-400",
        chipActiveBg: "active:bg-tertiary-100",
    },
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
    meta,
}: {
    title: string;
    levels: string[];
    fileCounts: Record<string, number>;
    meta: SubjectMeta;
}) {
    if (levels.length === 0) return null;

    const BandIcon = GRADE_BAND_ICON[title] ?? Sparkles;

    return (
        <div className="mb-5 last:mb-0">
            <div className="mb-3 flex items-center gap-2">
                <BandIcon size={16} className={meta.bandIconText} />
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
                <span className="text-xs text-gray-400">({levels.length})</span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {levels.map((level) => (
                    <Link
                        key={level}
                        to={`/levels/${level}/files`}
                        className={`group relative flex items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 active:translate-y-0 ${meta.chipHoverBorder} ${meta.chipHoverBg} ${meta.chipHoverText} ${meta.chipFocusRing} ${meta.chipActiveBg}`}
                    >
                        {level}
                        {/* Only worth flagging once there's more than one file to browse into —
                            every level folder has at least its (possibly empty) shell file. */}
                        {fileCounts[level] > 1 && (
                            <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary-100 px-1 text-[10px] font-semibold text-secondary-700 group-hover:bg-secondary-200">
                                {fileCounts[level]}
                            </span>
                        )}
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

    return (
        <section className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm last:mb-0">
            <div className={`flex items-center gap-3 border-b border-gray-200 px-5 py-4 ${meta.headerBg}`}>
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${meta.iconBg} ${meta.iconText}`}>
                    <SubjectIcon size={20} />
                </span>
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
            <div className="p-5">
                {Object.entries(levels).map(([group, groupLevels]) => (
                    <GradeBandGroup key={group} title={group} levels={groupLevels} fileCounts={fileCounts} meta={meta} />
                ))}
            </div>
        </section>
    );
}

export default function AllLevelsPage() {
    return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">All Levels</h1>
                <p className="mt-1 text-sm text-gray-500">Browse every level and its preview files, by subject and grade band.</p>
            </div>

            <SubjectCard title="Math" levels={mathLevels} fileCounts={mathFileCounts} />
            <SubjectCard title="English" levels={englishLevels} fileCounts={englishFileCounts} />
        </div>
    );
}
