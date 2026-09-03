interface PracticeModeSelectorProps {
  onSelect: (mode: "visual" | "wordProblem") => void;
}

export default function PracticeModeSelector({ onSelect }: PracticeModeSelectorProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
      <h2 className="text-lg font-bold text-gray-800 mb-2">How do you want to practice?</h2>
      <p className="text-sm text-gray-400 mb-6">Pick one to get started.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => onSelect("visual")}
          className="flex-1 sm:max-w-xs px-6 py-5 rounded-xl border-2 border-blue-200 text-blue-700
            font-semibold hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
        >
          Visual Practice
        </button>
        <button
          onClick={() => onSelect("wordProblem")}
          className="flex-1 sm:max-w-xs px-6 py-5 rounded-xl border-2 border-emerald-200 text-emerald-700
            font-semibold hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200"
        >
          Word Problems
        </button>
      </div>
    </div>
  );
}
