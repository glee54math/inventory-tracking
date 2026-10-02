export type PracticeMode = "visual" | "wordProblem" | "standalone";

const MODE_LABELS: Record<PracticeMode, string> = {
  visual: "Visual Practice",
  wordProblem: "Word Problems",
  standalone: "More Practice",
};

const MODE_STYLES: Record<PracticeMode, string> = {
  visual: "border-blue-200 text-blue-700 hover:border-blue-400 hover:bg-blue-50",
  wordProblem: "border-emerald-200 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50",
  standalone: "border-purple-200 text-purple-700 hover:border-purple-400 hover:bg-purple-50",
};

interface PracticeModeSelectorProps {
  availableModes: PracticeMode[];
  onSelect: (mode: PracticeMode) => void;
}

export default function PracticeModeSelector({ availableModes, onSelect }: PracticeModeSelectorProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
      <h2 className="text-lg font-bold text-gray-800 mb-2">How do you want to practice?</h2>
      <p className="text-sm text-gray-400 mb-6">Pick one to get started.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {availableModes.map((mode) => (
          <button
            key={mode}
            onClick={() => onSelect(mode)}
            className={`flex-1 sm:max-w-xs px-6 py-5 rounded-xl border-2 font-semibold transition-all duration-200 ${MODE_STYLES[mode]}`}
          >
            {MODE_LABELS[mode]}
          </button>
        ))}
      </div>
    </div>
  );
}
