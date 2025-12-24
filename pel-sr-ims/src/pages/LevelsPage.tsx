import { useParams } from "react-router-dom";

export default function LevelsPage() {
  const { levelId } = useParams<{ levelId: string }>();

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Level: {levelId}
      </h1>

      {/* Later: load problems, data, etc */}
    </div>
  );
}