import { useEffect, useState } from "react";
import { loadWorkersFromDB, checkWorkerHasPin, createWorkerPin, verifyWorkerPin, createNewWorker } from "../utils/inventoryService";
import type { Worker } from "../utils/types";
import { useNameContext } from "./NameContext";

type LoginStep = "selectWorker" | "enterPin" | "createPin" | "confirmPin" | "addNewWorker";

export default function WorkerLogin() {
  const { setNameOfWorker } = useNameContext();
  const [workersList, setWorkersList] = useState<Worker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<string>("");
  const [loginStep, setLoginStep] = useState<LoginStep>("selectWorker");
  const [pin, setPin] = useState<string>("");
  const [confirmPinValue, setConfirmPinValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Add worker form states
  const [newWorkerFirstName, setNewWorkerFirstName] = useState<string>("");
  const [newWorkerLastName, setNewWorkerLastName] = useState<string>("");
  const [newWorkerLocation, setNewWorkerLocation] = useState<string>("san-ramon");

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    const temp: Worker[] = await loadWorkersFromDB();
    setWorkersList(temp);
  };

  const handleWorkerSelect = async (workerInitials: string) => {
    if (!workerInitials) return;
    
    setSelectedWorker(workerInitials);
    setError("");
    setIsLoading(true);

    try {
      // Check if worker has a PIN already
      const hasPin = await checkWorkerHasPin(workerInitials);
      
      if (hasPin) {
        setLoginStep("enterPin");
      } else {
        setLoginStep("createPin");
      }
    } catch (err) {
      setError("Error checking worker status. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinInput = (value: string) => {
    // Only allow digits and limit to 4 characters
    const digitOnly = value.replace(/\D/g, "").slice(0, 4);
    setPin(digitOnly);
    setError("");
  };

  const handleConfirmPinInput = (value: string) => {
    const digitOnly = value.replace(/\D/g, "").slice(0, 4);
    setConfirmPinValue(digitOnly);
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
      if (loginStep === "enterPin") {
        // Verify existing PIN
        const isValid = await verifyWorkerPin(selectedWorker, pin);
        
        if (isValid) {
          setNameOfWorker(selectedWorker);
        } else {
          setError("Incorrect PIN. Please try again.");
          setPin("");
        }
      } else if (loginStep === "createPin") {
        // Move to confirm step
        setLoginStep("confirmPin");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (confirmPinValue.length !== 4) {
      setError("PIN must be exactly 4 digits");
      return;
    }

    if (pin !== confirmPinValue) {
      setError("PINs do not match. Please try again.");
      setConfirmPinValue("");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const success = await createWorkerPin(selectedWorker, pin);
      
      if (success) {
        setNameOfWorker(selectedWorker);
      } else {
        setError("Failed to create PIN. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newWorkerFirstName.trim() || !newWorkerLastName.trim()) {
      setError("Please enter both first and last name");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const success = await createNewWorker(
        newWorkerFirstName.trim(), 
        newWorkerLastName.trim(), 
        newWorkerLocation
      );
      
      if (success) {
        // Reload workers list
        await loadWorkers();
        
        // Clear form and show success message
        const initials = (newWorkerFirstName.charAt(0) + newWorkerLastName.charAt(0)).toUpperCase();
        setError(""); // Clear any errors
        
        // Reset form
        setNewWorkerFirstName("");
        setNewWorkerLastName("");
        
        // Go back to select worker and show success
        setLoginStep("selectWorker");
        
        // Set a temporary success message
        setTimeout(() => {
          alert(`✅ Successfully added ${newWorkerFirstName} ${newWorkerLastName} (${initials}). You can now select them to login.`);
        }, 100);
      } else {
        setError("Failed to add worker. A worker with these initials may already exist.");
      }
    } catch (err) {
      setError("An error occurred while adding the worker.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (loginStep === "confirmPin") {
      setLoginStep("createPin");
      setConfirmPinValue("");
      setError("");
    } else if (loginStep === "addNewWorker") {
      setLoginStep("selectWorker");
      setNewWorkerFirstName("");
      setNewWorkerLastName("");
      setError("");
    } else {
      setLoginStep("selectWorker");
      setSelectedWorker("");
      setPin("");
      setConfirmPinValue("");
      setError("");
    }
  };

  const handleShowAddWorker = () => {
    setLoginStep("addNewWorker");
    setError("");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex flex-col justify-center items-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-white text-5xl font-bold mb-3 tracking-tight drop-shadow-xl">
            PEL
          </h1>
          <p className="text-blue-100 text-lg font-medium">
            Worker Portal
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Worker Selection */}
          {loginStep === "selectWorker" && (
            <div className="space-y-6">
              <div>
                <label 
                  htmlFor="worker-select" 
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Select Your Name
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

              {/* Add New Worker Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleShowAddWorker}
                  disabled={isLoading}
                  className="w-full bg-white border-2 border-blue-500 text-blue-600 py-3 rounded-xl
                    font-semibold text-base shadow-sm hover:bg-blue-50
                    transform hover:scale-[1.02] active:scale-[0.98]
                    transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  + Add New Worker
                </button>
              </div>
            </div>
          )}

          {/* Add New Worker Form */}
          {loginStep === "addNewWorker" && (
            <form onSubmit={handleAddNewWorker} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Add New Worker</h2>
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back
                </button>
              </div>

              <div>
                <label htmlFor="first-name" className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  id="first-name"
                  type="text"
                  value={newWorkerFirstName}
                  onChange={(e) => setNewWorkerFirstName(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter first name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-all duration-200 shadow-sm
                    disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="last-name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="last-name"
                  type="text"
                  value={newWorkerLastName}
                  onChange={(e) => setNewWorkerLastName(e.target.value)}
                  disabled={isLoading}
                  placeholder="Enter last name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-all duration-200 shadow-sm
                    disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <select
                  id="location"
                  value={newWorkerLocation}
                  onChange={(e) => setNewWorkerLocation(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    appearance-none bg-white cursor-pointer transition-all duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <option value="san-ramon">San Ramon</option>
                  {/* Add more locations as needed */}
                </select>
              </div>

              {newWorkerFirstName && newWorkerLastName && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    📝 Initials will be: <strong>{(newWorkerFirstName.charAt(0) + newWorkerLastName.charAt(0)).toUpperCase()}</strong>
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !newWorkerFirstName.trim() || !newWorkerLastName.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl
                  font-semibold text-lg shadow-lg hover:shadow-xl
                  transform hover:scale-[1.02] active:scale-[0.98]
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading ? "Adding Worker..." : "Add Worker"}
              </button>
            </form>
          )}

          {/* Enter PIN */}
          {loginStep === "enterPin" && (
            <form onSubmit={handlePinSubmit} className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label 
                    htmlFor="pin-input" 
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Enter Your PIN
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
                {isLoading ? "Verifying..." : "Login"}
              </button>
            </form>
          )}

          {/* Create PIN */}
          {loginStep === "createPin" && (
            <form onSubmit={handlePinSubmit} className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label 
                    htmlFor="new-pin-input" 
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Create Your PIN
                  </label>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    ← Back
                  </button>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    🔒 First time login detected. Please create a 4-digit PIN for future logins.
                  </p>
                </div>
                <input
                  id="new-pin-input"
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
                  Choose a 4-digit PIN you'll remember
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

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
                Continue
              </button>
            </form>
          )}

          {/* Confirm PIN */}
          {loginStep === "confirmPin" && (
            <form onSubmit={handleConfirmPinSubmit} className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label 
                    htmlFor="confirm-pin-input" 
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Confirm Your PIN
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
                  id="confirm-pin-input"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={confirmPinValue}
                  onChange={(e) => handleConfirmPinInput(e.target.value)}
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
                  Re-enter your PIN to confirm
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={confirmPinValue.length !== 4 || isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl
                  font-semibold text-lg shadow-lg hover:shadow-xl
                  transform hover:scale-[1.02] active:scale-[0.98]
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading ? "Creating PIN..." : "Create PIN & Login"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-blue-100 text-sm mt-6">
          Secure login for authorized personnel only
        </p>
      </div>
    </div>
  );
}