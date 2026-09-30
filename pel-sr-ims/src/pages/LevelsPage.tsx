import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function LevelsPage() {
    // fileId is optional — used by the admin file browser (/levels/:levelId/:fileId) to
    // preview a specific non-shell file. Falls back to the shell (levelId itself) when
    // absent, which is what /student-levels/:levelId and the Sidebar's admin jump-to-level
    // both rely on.
    const { levelId, fileId } = useParams<{ levelId: string; fileId?: string }>();
    const targetFile = fileId ?? levelId;
    const [error, setError] = useState<boolean>(false);
    const [LevelComponent, setLevelComponent] = useState<React.ComponentType | null>(null);

    useEffect(() => {
        if (!levelId || !targetFile) {     // can't be levelID, Id is lowercase
            return;
        }
        setError(false);    // This part runs if there is a levelId present, but doesn't check its validity.

        import(`./math-levels/${levelId}/${targetFile}.tsx`)
            .then((module) => {
                setLevelComponent(() => module.default);
            })
            .catch(() => {
                import(`./english-levels/${levelId}/${targetFile}.tsx`)
                    .then((module) => {
                        setLevelComponent(() => module.default);
                    })
                    .catch(() => {
                        setError(true);
                    });
            });
    }, [levelId, targetFile]);

    if (error) {
        return <div>{`Level ${levelId} not found.`}</div>
    }
    if (!LevelComponent) {
        return <div>Loading Component...</div>
    }

    return <LevelComponent />
}
