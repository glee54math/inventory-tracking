import { useEffect, useState } from "react";
import { loadWorkersFromDB, checkWorkerHasPin, verifyWorkerPin } from "../../utils/inventoryService";
import type { Worker } from "../../utils/types";

interface WorkerSwitchModalProps {
  onWorkerSwitch: (workerInitials: string) => void;
  onCancel: () => void;
  currentWorker?: string;
}

type SwitchStep = "selectWorker" | "enterPin";

export default function WorkerSwitchModal({
  onWorkerSwitch,
  onCancel,
  currentWorker,
}: WorkerSwitchModalProps) {
  const [workersList, setWorkersList] = useState<Worker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<string>("");
  const [switchStep, setSwitchStep] = useState<SwitchStep>("selectWorker");
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadWorkers = async () => {
      const temp: Worker[] = await loadWorkersFromDB();
      setWorkersList(temp);
    };
    loadWorkers();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleWorkerSelect = async (workerInitials: string) => {
    if (!workerInitials) return;

    setSelectedWorker(workerInitials);
    setError("");
    setIsLoading(true);

    try {
      // Check if worker has a PIN
      const hasPin = await checkWorkerHasPin(workerInitials);

      if (hasPin) {
        setSwitchStep("enterPin");
      } else {
        // No PIN required, switch immediately
        onWorkerSwitch(workerInitials);
      }
    } catch (err) {
      setError("Error checking worker status. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinInput = (value: string) => {
    const digitOnly = value.replace(/\D/g, "").slice(0, 4);
    setPin(digitOnly);
    setError("");
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pin.length !== 4) {
      setError("PIN must be exactly 4 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const isValid = await verifyWorkerPin(selectedWorker, pin);

      if (isValid) {
        onWorkerSwitch(selectedWorker);
      } else {
        setError("Incorrect PIN. Please try again.");
        setPin("");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSwitchStep("selectWorker");
    setSelectedWorker("");
    setPin("");
    setError("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Worker Selection */}
        {switchStep === "selectWorker" && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Switch Worker
              </h2>
              {currentWorker && (
                <p className="text-sm text-gray-600">
                  Currently: <strong>{currentWorker}</strong>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="worker-select"
                className="block text-sm font-semibold text-gray-700 mb-3"
              >
                Select Worker
              </label>
              <select
                id="worker-select"
                value={selectedWorker}
                onChange={(e) => handleWorkerSelect(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 text-gray-800 text-base
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  appearance-none bg-white cursor-pointer transition-all duration-200
                  hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-sm"
              >
                <option value="">Choose worker...</option>
                <option value="Mr. Lee">Mr. Lee</option>
                {workersList.map((worker: Worker) => (
                  <option key={worker.initials} value={worker.initials}>
                    {worker.firstName} {worker.lastName}
                  </option>
                ))}
              </select>
            </div>

            {isLoading && (
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
              </div>
            )}

            <button
              onClick={onCancel}
              disabled={isLoading}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl
                font-semibold text-base hover:bg-gray-50
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Enter PIN */}
        {switchStep === "enterPin" && (
          <form onSubmit={handlePinSubmit} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label
                  htmlFor="pin-input"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Enter PIN for {selectedWorker}
                </label>
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back
                </button>
              </div>
              <input
                id="pin-input"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                value={pin}
                onChange={(e) => handlePinInput(e.target.value)}
                maxLength={4}
                placeholder="••••"
                autoFocus
                disabled={isLoading}
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 text-gray-800 text-2xl
                  text-center tracking-[0.5em] font-bold
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  transition-all duration-200 shadow-sm
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="mt-2 text-xs text-gray-500 text-center">
                4-digit PIN
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={pin.length !== 4 || isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl
                  font-semibold text-lg shadow-lg hover:shadow-xl
                  transform hover:scale-[1.02] active:scale-[0.98]
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading ? "Verifying..." : "Switch Worker"}
              </button>

              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-2.5 rounded-xl
                  font-medium text-base hover:bg-gray-50
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}