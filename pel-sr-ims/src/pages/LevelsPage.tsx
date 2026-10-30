import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function LevelsPage() {
    // fileId is optional — used by the admin file browser (/levels/:levelId/:fileId) to
    // preview a specific non-shell file. Falls back to the shell (levelId itself) when
    // absent, which is what /student-levels/:levelId and the Sidebar's admin jump-to-level
    // both rely on.
    const { levelId, fileId } = useParams<{ levelId: string; fileId?: string }>();
    const targetFile = fileId ?? levelId;
    const [error, setError] = useState<string | null>(null);
    const [LevelComponent, setLevelComponent] = useState<React.ComponentType | null>(null);

    useEffect(() => {
        if (!levelId || !targetFile) {     // can't be levelID, Id is lowercase
            return;
        }
        setError(null);    // This part runs if there is a levelId present, but doesn't check its validity.
        setLevelComponent(null);

        const isMath = levelId.startsWith("M");
        const primary = isMath
            ? import(`./math-levels/${levelId}/${targetFile}.tsx`)
            : import(`./english-levels/${levelId}/${targetFile}.tsx`);

        // Only one folder can hold a given level, so a failed import is reported as-is.
        // (It used to fall through to the English folder, which hid the real error,
        // e.g. a crash inside the lab or a stale dev server, behind "not found".)
        primary
            .then((module) => {
                setLevelComponent(() => module.default);
            })
            .catch((err: unknown) => {
                console.error(`Failed to load ${levelId}/${targetFile}:`, err);
                setError(err instanceof Error ? err.message : String(err));
            });
    }, [levelId, targetFile]);

    if (error) {
        return (
            <div className="p-6">
                <p className="font-semibold">{`Couldn't load ${targetFile}.`}</p>
                <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap">{error}</p>
                <p className="text-sm text-gray-500 mt-2">
                    If you just added or changed this file, restart the dev server and hard-refresh (Ctrl+Shift+R).
                </p>
            </div>
        );
    }
    if (!LevelComponent) {
        return <div>Loading Component...</div>
    }

    return <LevelComponent />
}
