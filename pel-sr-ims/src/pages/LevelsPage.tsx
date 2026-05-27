import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function LevelsPage() {
    const { levelId } = useParams<{ levelId: string }>();     // This grabs from the URL
    const [error, setError] = useState<boolean>(false);
    const [LevelComponent, setLevelComponent] = useState<React.ComponentType | null>(null);

    useEffect(() => {
        if (!levelId) {     // can't be levelID, Id is lowercase
            return;
        }
        setError(false);    // This part runs if there is a levelId present, but doesn't check its validity.

        import(`./math-levels/${levelId}.tsx`)
            .then((module) => {
                setLevelComponent(() => module.default);
            })
            .catch(() => {
                import(`./english-levels/${levelId}.tsx`)
                    .then((module) => {
                        setLevelComponent(() => module.default);
                    })
                    .catch(() => {
                        setError(true);
                    });
            });
    }, [levelId]);

    if (error) {
        return <div>{`Level ${levelId} not found.`}</div>
    }
    if (!LevelComponent) {
        return <div>Loading Component...</div>
    }

    return <LevelComponent />
}