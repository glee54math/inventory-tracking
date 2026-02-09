import { useState, useEffect } from 'react';

interface SubmissionConfirmModalProps {
  currentWorker: string;
  onConfirm: () => void;
  onSwitchWorker: () => void;
  onCancel: () => void;
  autoConfirmSeconds?: number;
}

export default function SubmissionConfirmModal({
  currentWorker,
  onConfirm,
  onSwitchWorker,
  onCancel,
  autoConfirmSeconds = 3,
}: SubmissionConfirmModalProps) {
  const [countdown, setCountdown] = useState(autoConfirmSeconds);
  const [isAutoConfirming, setIsAutoConfirming] = useState(true);

  useEffect(() => {
    if (!isAutoConfirming) return;

    if (countdown === 0) {
      onConfirm();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, isAutoConfirming, onConfirm]);

  const handleManualConfirm = () => {
    setIsAutoConfirming(false);
    onConfirm();
  };

  const handleSwitchWorker = () => {
    setIsAutoConfirming(false);
    onSwitchWorker();
  };

  const handleCancel = () => {
    setIsAutoConfirming(false);
    onCancel();
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-slide-up">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Confirm Submission
          </h2>
          <p className="text-gray-600 mb-1">
            Submitting actions as:
          </p>
          <p className="text-2xl font-bold text-blue-600 mb-4">
            {currentWorker}
          </p>
          
          {isAutoConfirming && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-green-800 text-sm">
                Auto-confirming in <strong>{countdown}</strong> second{countdown !== 1 ? 's' : ''}...
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleManualConfirm}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl
              font-semibold text-lg shadow-lg hover:shadow-xl
              transform hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            ✓ Yes, Submit as {currentWorker}
          </button>
          
          <button
            onClick={handleSwitchWorker}
            className="w-full bg-white border-2 border-blue-500 text-blue-600 py-3 rounded-xl
              font-semibold text-lg shadow-sm hover:bg-blue-50
              transform hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            🔄 Switch to Different Worker
          </button>

          <button
            onClick={handleCancel}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-2.5 rounded-xl
              font-medium text-base hover:bg-gray-50
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}