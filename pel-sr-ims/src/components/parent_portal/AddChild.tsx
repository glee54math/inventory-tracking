// AddChildModal.tsx - Modal for parents to add additional children to their account

import { useState } from "react";
import { searchStudentsByName, addChildToParent, verifyParentChildMatch, getParentProfile } from "../../utils/parentService";
import type { ChildSearchResult } from "../../utils/types";

interface AddChildModalProps {
  parentUid: string;
  existingChildren: string[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddChildModal({ 
  parentUid, 
  existingChildren, 
  onClose, 
  onSuccess 
}: AddChildModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ChildSearchResult[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a child's name");
      return;
    }

    setError("");
    setSuccess("");
    setSearching(true);

    try {
      // Get parent profile to verify matches
      const parentProfile = await getParentProfile(parentUid);
      
      if (!parentProfile) {
        setError("Parent profile not found");
        setSearching(false);
        return;
      }

      const results = await searchStudentsByName(searchQuery);
      
      // Filter out children already linked
      let availableResults = results.filter(
        child => !existingChildren.includes(child.studentId)
      );

      // Filter by parent name match (security check)
      availableResults = availableResults.filter(child => 
        verifyParentChildMatch(
          child,
          parentProfile.firstName,
          parentProfile.lastName,
          parentProfile.parentType
        )
      );
      
      setSearchResults(availableResults);
      
      if (availableResults.length === 0) {
        if (results.length > 0) {
          setError("No matching students found. The parent names on file don't match your account. Please contact Mr. Lee at pelsanramon@gmail.com for assistance.");
        } else {
          setError("No students found matching that name. Please try again or contact Mr. Lee at pelsanramon@gmail.com");
        }
      }
    } catch (err: any) {
      setError("Failed to search for students. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleAddChild = async () => {
    if (!selectedChild) {
      setError("Please select a child");
      return;
    }

    setError("");
    setAdding(true);

    try {
      await addChildToParent(parentUid, selectedChild);
      setSuccess("Child added successfully!");
      
      // Wait a moment to show success message
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to add child. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 !bg-black !bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="!bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add Another Child</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={adding}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="!bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="!bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Search Section */}
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Search for your child by name. If they're enrolled in the program, you can link them to your account.
          </p>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter child's name..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={searching}
              className="px-6 py-2 !bg-blue-600 text-white rounded-lg font-semibold hover:!bg-blue-700 transition disabled:opacity-50"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Select Your Child</h3>
            <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
              {searchResults.map((child) => (
                <div
                  key={child.studentId}
                  className={`p-4 hover:!bg-gray-50 cursor-pointer transition ${
                    selectedChild === child.studentId ? '!bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedChild(child.studentId)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {child.firstName} {child.lastName}
                      </h4>
                      <div className="text-sm text-gray-600 mt-1">
                        {child.father && <p>Father: {child.father}</p>}
                        {child.mother && <p>Mother: {child.mother}</p>}
                        {child.joinDate && <p>Join Date: {child.joinDate}</p>}
                      </div>
                    </div>
                    <input
                      type="radio"
                      checked={selectedChild === child.studentId}
                      onChange={() => {}}
                      className="w-5 h-5 text-blue-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={adding}
            className="flex-1 !bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:!bg-gray-300 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAddChild}
            disabled={!selectedChild || adding}
            className="flex-1 !bg-green-600 text-white py-2 rounded-lg font-semibold hover:!bg-green-700 transition disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add Child"}
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 !bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Can't find your child?</strong> Contact Mr. Lee at{" "}
            <a href="mailto:pelsanramon@gmail.com" className="underline">
              pelsanramon@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}