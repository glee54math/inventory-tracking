import { useEffect } from 'react';

interface IdleWarningModalProps {
  workerName: string;
  remainingSeconds: number;
  onConfirm: () => void;
  onLogout: () => void;
}

export default function IdleWarningModal({
  workerName,
  remainingSeconds,
  onConfirm,
  onLogout,
}: IdleWarningModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Are you still here?
          </h2>
          <p className="text-gray-600 mb-4">
            Logged in as: <strong className="text-blue-600">{workerName}</strong>
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-semibold">
              Auto-logout in {remainingSeconds} second{remainingSeconds !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl
              font-semibold text-lg shadow-lg hover:shadow-xl
              transform hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Yes, it's {workerName}
          </button>
          <button
            onClick={onLogout}
            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl
              font-semibold text-lg shadow-sm hover:bg-gray-50
              transform hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            No, log me out
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}