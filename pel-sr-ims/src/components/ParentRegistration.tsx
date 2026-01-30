// ParentRegistration.tsx - Parent account registration flow

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpWithEmail } from "../utils/authService";
import { createParentProfile, searchStudentsByName, addChildToParent } from "../utils/parentService";
import type { ChildSearchResult } from "../utils/types";

export default function ParentRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Step 1: Parent Info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [parentType, setParentType] = useState<"father" | "mother" | "guardian">("mother");
  
  // Step 2: Search Children
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ChildSearchResult[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  
  // General
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setStep(2);
  };

  const handleSearchChildren = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a child's name");
      return;
    }

    setError("");
    setSearching(true);

    try {
      const results = await searchStudentsByName(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        setError("No students found matching that name. Please try again or contact Mr. Lee.");
      }
    } catch (err: any) {
      setError("Failed to search for students. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const toggleChildSelection = (studentId: string) => {
    setSelectedChildren((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleStep2Submit = () => {
    if (selectedChildren.length === 0) {
      setError("Please select at least one child");
      return;
    }
    setError("");
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      // Create Firebase Auth account
      const user = await signUpWithEmail(email, password, `${firstName} ${lastName}`, "parent");
      
      // Create parent profile in Firestore
      await createParentProfile(
        user.uid,
        email,
        firstName,
        lastName,
        parentType,
        selectedChildren
      );

      // Link children to parent
      for (const childId of selectedChildren) {
        await addChildToParent(user.uid, childId);
      }

      // Navigate to parent dashboard
      navigate("/parent-dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <StepIndicator currentStep={step} totalSteps={3} />
        </div>

        {/* Step 1: Parent Information */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Parent Account</h2>
            <p className="text-gray-600 mb-6">Step 1: Enter your information</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am the child's *
                </label>
                <select
                  value={parentType}
                  onChange={(e) => setParentType(e.target.value as "father" | "mother" | "guardian")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="guardian">Guardian</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password * (minimum 6 characters)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/parent-login")}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Search and Select Children */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Find Your Child</h2>
            <p className="text-gray-600 mb-6">Step 2: Search for and select your child(ren)</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Search Box */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchChildren()}
                  placeholder="Enter child's name..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSearchChildren}
                  disabled={searching}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {searching ? "Searching..." : "Search"}
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
                  {searchResults.map((child) => (
                    <div
                      key={child.studentId}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
                        selectedChildren.includes(child.studentId) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => toggleChildSelection(child.studentId)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {child.firstName} {child.lastName}
                          </h3>
                          <div className="text-sm text-gray-600 mt-1">
                            {child.father && <p>Father: {child.father}</p>}
                            {child.mother && <p>Mother: {child.mother}</p>}
                            {child.joinDate && <p>Join Date: {child.joinDate}</p>}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedChildren.includes(child.studentId)}
                          onChange={() => {}}
                          className="w-5 h-5 text-blue-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Children Summary */}
              {selectedChildren.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="font-semibold text-green-800">
                    Selected {selectedChildren.length} child{selectedChildren.length > 1 ? 'ren' : ''}
                  </p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleStep2Submit}
                  disabled={selectedChildren.length === 0}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Your Account</h2>
            <p className="text-gray-600 mb-6">Step 3: Review and create your account</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Your Information</h3>
                <p className="text-gray-600">Name: {firstName} {lastName}</p>
                <p className="text-gray-600">Email: {email}</p>
                <p className="text-gray-600">Role: {parentType.charAt(0).toUpperCase() + parentType.slice(1)}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Your Child{selectedChildren.length > 1 ? 'ren' : ''}
                </h3>
                <ul className="list-disc list-inside text-gray-600">
                  {selectedChildren.map((childId) => {
                    const child = searchResults.find(r => r.studentId === childId);
                    return child ? (
                      <li key={childId}>{child.firstName} {child.lastName}</li>
                    ) : null;
                  })}
                </ul>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                onClick={() => setStep(2)}
                disabled={loading}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Step Indicator Component
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step === currentStep
                ? 'bg-blue-600 text-white'
                : step < currentStep
                ? 'bg-green-600 text-white'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
          {step < totalSteps && (
            <div
              className={`w-12 h-1 ${
                step < currentStep ? 'bg-green-600' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}