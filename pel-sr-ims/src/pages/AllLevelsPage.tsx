import { Link } from "react-router-dom";

const mathLevels: Record<string, string[]> = {
    "Kindergarten": ["MK1", "MK2", "MK3", "MK4"],
    "Elementary School": ["MG1", "MG2", "MG3", "MG4", "MG5", "MG6", "MG7", "MG8", "MG9", "MG10", "MG11"],
    "Middle School": ["MM1", "MM2", "MM3"],
    "High School": ["MH1", "MH2", "MH3", "MH4", "MH5", "MH6", "MHG", "MHT"],
    "Special Topics": ["WordProblems", "MG6_TwoDigitVisualAddition", "MG6_VerticalAddition", "MG7_Nx1DigitMultiplication"],
};

const englishLevels: Record<string, string[]> = {
    "Kindergarten": ["EK1", "EK2", "EK3", "EK4"],
    "Elementary School": ["EG1", "EG1B", "EG2", "EG2B", "EG3", "EG4", "EG5", "EG6", "EG7", "EG8", "EG9", "EG10"],
    "Middle School": ["EM1", "EM2", "EM3", "EM4", "EM5"],
    "High School": ["EH1", "EH2", "EH3", "EH4", "EH5", "EH6"],
};

function LevelGroup({ title, levels }: { title: string; levels: string[] }) {
    return (
        <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                    <Link
                        key={level}
                        to={`/levels/${level}`}
                        className="px-3 py-1 bg-gray-100 hover:bg-green-200 border border-gray-300 hover:border-green-400 rounded text-sm font-medium text-gray-800 transition-colors"
                    >
                        {level}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function AllLevelsPage() {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">All Levels</h1>

            <section className="mb-8">
                <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-4">Math</h2>
                {Object.entries(mathLevels).map(([group, levels]) => (
                    <LevelGroup key={group} title={group} levels={levels} />
                ))}
            </section>

            <section>
                <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-4">English</h2>
                {Object.entries(englishLevels).map(([group, levels]) => (
                    <LevelGroup key={group} title={group} levels={levels} />
                ))}
            </section>
        </div>
    );
}
