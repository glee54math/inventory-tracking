import { Link, useParams } from "react-router-dom";
import { MATH_LEVELS } from "../utils/types";
import { previewableFilesForLevel } from "./levelFileHelpers";

const mathModules = import.meta.glob('./math-levels/*/*.tsx');
const englishModules = import.meta.glob('./english-levels/*/*.tsx');

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

export default function LevelFilesPage() {
    const { levelId } = useParams<{ levelId: string }>();
    if (!levelId) return null;

    const isMath = MATH_LEVELS.includes(levelId);
    const files = filesForLevel(levelId, isMath);

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <Link to="/levels/LevelsPage" className="text-sm text-gray-500 hover:text-gray-700">
                ← All Levels
            </Link>
            <h1 className="text-2xl font-bold mt-2 mb-6">{levelId} — Files</h1>

            {files.length === 0 ? (
                <p className="text-gray-400 text-sm">No files found for {levelId}.</p>
            ) : (
                <ul className="space-y-2">
                    {files.map((file) => (
                        <li key={file}>
                            <Link
                                to={`/levels/${levelId}/${file}`}
                                className="inline-block px-3 py-2 bg-gray-100 hover:bg-green-200 border border-gray-300 hover:border-green-400 rounded text-sm font-medium text-gray-800 transition-colors"
                            >
                                {file}
                                {file === levelId && (
                                    <span className="ml-2 text-xs text-gray-400">(shell)</span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
