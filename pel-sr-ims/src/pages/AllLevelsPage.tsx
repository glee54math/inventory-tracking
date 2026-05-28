import { Link } from "react-router-dom";

const mathModules = import.meta.glob('./math-levels/*.tsx');

const allMathIds = Object.keys(mathModules)
    .map(path => path.replace('./math-levels/', '').replace('.tsx', ''))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

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
