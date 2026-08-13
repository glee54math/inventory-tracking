import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStudentsFromDB } from "../utils/inventoryService";
import type { Student } from "../utils/types";
import { useStudentContext } from "./StudentContext";

const SHARED_PIN = "1234";

type LoginStep = "enterPin" | "selectStudent";

export default function StudentLogin() {
  const navigate = useNavigate();
  const { setCurrentStudent } = useStudentContext();
  const [step, setStep] = useState<LoginStep>("enterPin");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin !== SHARED_PIN) {
      setError("Incorrect PIN. Please try again.");
      setPin("");
      return;
    }
    setLoading(true);
    try {
      const list = await loadStudentsFromDB("san-ramon");
      setStudents(list);
      setStep("selectStudent");
    } catch {
      setError("Could not load student list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;
    const [firstName, lastName] = val.split("|");
    const student = students.find(
      (s) => s.firstName === firstName && s.lastName === lastName
    );
    if (!student) return;
    setCurrentStudent(student);
    navigate("/student-portal");
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex flex-col justify-center items-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,198,180,0.3),rgba(255,255,255,0))]" />

      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-20 px-4 py-2 !bg-white/20 text-white text-sm font-medium rounded-xl hover:!bg-white/30 transition-all duration-200 focus:outline-none"
      >
        ← Back
      </button>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-white text-5xl font-bold mb-3 tracking-tight drop-shadow-xl">
            PEL
          </h1>
          <p className="text-emerald-100 text-lg font-medium">Student Portal</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          {step === "enterPin" && (
            <form onSubmit={handlePinSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="pin"
                  className="block text-sm font-semibold text-gray-700 mb-3"
                >
                  Enter Access PIN
                </label>
                <input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                    setError("");
                  }}
                  maxLength={4}
                  placeholder="••••"
                  autoFocus
                  disabled={loading}
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 text-gray-800 text-2xl
                    text-center tracking-[0.5em] font-bold
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                    transition-all duration-200 shadow-sm
                    disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="mt-2 text-xs text-gray-500 text-center">4-digit PIN</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={pin.length !== 4 || loading}
                className="w-full !bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl
                  font-semibold text-lg shadow-lg hover:shadow-xl
                  transform hover:scale-[1.02] active:scale-[0.98]
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                {loading ? "Loading..." : "Continue"}
              </button>
            </form>
          )}

          {step === "selectStudent" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Who are you?
                </label>
                <select
                  onChange={handleStudentSelect}
                  defaultValue=""
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 text-gray-800 text-base
                    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                    transition-all duration-200 shadow-sm"
                >
                  <option value="" disabled>
                    Choose your name...
                  </option>
                  {students.map((s) => (
                    <option
                      key={`${s.firstName}|${s.lastName}`}
                      value={`${s.firstName}|${s.lastName}`}
                    >
                      {s.firstName} {s.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => { setStep("enterPin"); setPin(""); setError(""); }}
                className="w-full !bg-gray-100 text-gray-600 py-3 rounded-xl font-medium text-sm
                  hover:!bg-gray-200 transition-all duration-200"
              >
                ← Back
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-emerald-100 text-sm mt-6">
          PEL Student Learning Portal
        </p>
      </div>
    </div>
  );
}
