export type PracticeMode = "visual" | "wordProblem" | "standalone";

const MODE_LABELS: Record<PracticeMode, string> = {
  visual: "Visual Practice",
  wordProblem: "Word Problems",
  standalone: "More Practice",
};

const MODE_STYLES: Record<PracticeMode, string> = {
  visual: "border-primary-200 text-primary-700 hover:border-primary-400 hover:bg-primary-50",
  wordProblem: "border-success-200 text-success-700 hover:border-success-400 hover:bg-success-50",
  standalone: "border-tertiary-200 text-tertiary-700 hover:border-tertiary-400 hover:bg-tertiary-50",
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
