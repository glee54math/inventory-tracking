import { useState } from "react";

export interface VTAFeedbackAnswer {
  usedVTA: boolean;
  selectedWithoutManualChanges: boolean | null;
}

interface VTAFeedbackModalProps {
  onAnswer: (answer: VTAFeedbackAnswer) => void;
}

function VTAFeedbackModal({ onAnswer }: VTAFeedbackModalProps) {
  const [step, setStep] = useState<"vta" | "swmc">("vta");

  const handleVTAAnswer = (usedVTA: boolean) => {
    if (usedVTA) {
      setStep("swmc");
    } else {
      onAnswer({ usedVTA: false, selectedWithoutManualChanges: null });
    }
  };

  const handleSWMCAnswer = (selectedWithoutManualChanges: boolean) => {
    onAnswer({ usedVTA: true, selectedWithoutManualChanges });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
        {step === "vta" ? (
          <>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Did you use Voice-to-Action (VTA)?
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => handleVTAAnswer(true)}
                className="flex-1 bg-green-200 outline-1 outline-green-500 rounded py-2 hover:!bg-green-300"
              >
                Yes
              </button>
              <button
                onClick={() => handleVTAAnswer(false)}
                className="flex-1 bg-gray-200 outline-1 outline-gray-400 rounded py-2 hover:!bg-gray-300"
              >
                No
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Did it select the appropriate boxes/values without you having to
              manually change anything (SWMC)?
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => handleSWMCAnswer(true)}
                className="flex-1 bg-green-200 outline-1 outline-green-500 rounded py-2 hover:!bg-green-300"
              >
                Yes
              </button>
              <button
                onClick={() => handleSWMCAnswer(false)}
                className="flex-1 bg-red-200 outline-1 outline-red-500 rounded py-2 hover:!bg-red-300"
              >
                No
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VTAFeedbackModal;
