import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadWorkersFromDB, checkWorkerHasPin, createWorkerPin, verifyWorkerPin, createNewWorker } from "../../utils/inventoryService";
import type { Worker } from "../../utils/types";
import { useNameContext } from "./NameContext";
import { signInWithEmail } from "../../utils/authService";
import { auth } from "../../utils/firebase";
import { getAdminEmail, getAdminPassword } from "../../utils/config";

type LoginStep = "selectWorker" | "enterPin" | "createPin" | "confirmPin" | "addNewWorker";

export default function WorkerLogin() {
  const navigate = useNavigate();
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

  /**
   * Sign in to Firebase Auth as Mr. Lee
   * This enables access to protected admin routes like /dashboard
   */
  const signInAsAdmin = async () => {
    console.log(auth.currentUser?.email, getAdminEmail())
    try {
      // Check if already signed in
      if (auth.currentUser) {
        console.log("✅ Already signed into Firebase as:", auth.currentUser.email);
        return;
      }

      // Sign in with admin credentials from config
      const adminEmail = getAdminEmail();
      const adminPassword = getAdminPassword();
      
      // LOG WHAT WE'RE TRYING
      console.log("🔍 Attempting sign-in with:");
      console.log("   Email:", adminEmail);
      console.log("   Password length:", adminPassword.length, "characters");
      console.log("   Password starts with:", adminPassword.substring(0, 4) + "...");
      
      await signInWithEmail(adminEmail, adminPassword);
      console.log("✅ Signed into Firebase Auth as admin");
    } catch (err) {
      console.error("❌ Failed to sign into Firebase Auth:", err);
      // Don't block the worker login if Firebase auth fails
      // The worker can still use the system, just not protected routes
      setError("Note: Admin features may be limited. Please check your credentials.");
    }
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
          
          // If Mr. Lee is logging in, also sign into Firebase Auth
          if (selectedWorker === "Mr. Lee") {
            await signInAsAdmin();
          }
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
        
        // If Mr. Lee is logging in, also sign into Firebase Auth
        if (selectedWorker === "Mr. Lee") {
          await signInAsAdmin();
        }
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

  const selectedWorkerInfo = workersList.find(w => w.initials === selectedWorker);
  const selectedWorkerName = selectedWorkerInfo
    ? `${selectedWorkerInfo.firstName} ${selectedWorkerInfo.lastName}`
    : selectedWorker;

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex flex-col justify-center items-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={() => navigate("/student-login")}
          className="px-4 py-2 !bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:!bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Student Portal
        </button>
        <button
          onClick={() => navigate("/parent-login")}
          className="px-4 py-2 !bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:!bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Parent Portal
        </button>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-white text-5xl font-bold mb-3 tracking-tight drop-shadow-xl">
            PEL
          </h1>
          <p className="text-blue-100 text-lg font-medium">
            Worker Login Portal
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          {/* Select Worker */}
          {loginStep === "selectWorker" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Your Name
                </label>
                <select
                  value={selectedWorker}
                  onChange={(e) => handleWorkerSelect(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 text-gray-800 text-base
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-all duration-200 shadow-sm
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Choose a worker...</option>
                  {workersList.map((worker) => (
                    <option key={worker.initials} value={worker.initials}>
                      {worker.firstName} {worker.lastName} ({worker.initials})
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {isLoading && (
                <div className="text-center text-gray-600">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}

              <button
                onClick={handleShowAddWorker}
                className="w-full !bg-gray-100 text-gray-700 py-3 rounded-xl
                  font-medium text-base hover:!bg-gray-200
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                + Add New Worker
              </button>
            </div>
          )}

          {/* Add New Worker */}
          {loginStep === "addNewWorker" && (
            <form onSubmit={handleAddNewWorker} className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Add New Worker
                  </label>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    ← Back
                  </button>
                </div>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newWorkerFirstName}
                    onChange={(e) => setNewWorkerFirstName(e.target.value)}
                    placeholder="First Name"
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      transition-all duration-200 shadow-sm
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  
                  <input
                    type="text"
                    value={newWorkerLastName}
                    onChange={(e) => setNewWorkerLastName(e.target.value)}
                    placeholder="Last Name"
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      transition-all duration-200 shadow-sm
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  />

                  <select
                    value={newWorkerLocation}
                    onChange={(e) => setNewWorkerLocation(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      transition-all duration-200 shadow-sm
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="san-ramon">San Ramon</option>
                    <option value="dublin">Dublin</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !newWorkerFirstName.trim() || !newWorkerLastName.trim()}
                className="w-full !bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl
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
                <p className="text-sm text-gray-500 mb-3">
                  Logging in as: <span className="font-semibold text-gray-700">{selectedWorkerName}</span>
                </p>
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
                className="w-full !bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl
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
                <p className="text-sm text-gray-500 mb-3">
                  Logging in as: <span className="font-semibold text-gray-700">{selectedWorkerName}</span>
                </p>
                <div className="!bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
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
                className="w-full !bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl
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
                <p className="text-sm text-gray-500 mb-3">
                  Logging in as: <span className="font-semibold text-gray-700">{selectedWorkerName}</span>
                </p>
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
                className="w-full !bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl
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