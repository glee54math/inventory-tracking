// ParentDashboard.tsx - Main parent dashboard with improved layout and overflow handling

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { getParentProfile } from "../utils/parentService";
import { signOutUser } from "../utils/authService";
import { getChildrenData } from "../utils/parentService";
import ChildProgressView from "./ChildProgressView";
import AddChildModal from "./AddChild";
import type { Parent } from "../utils/types";
import type { Student } from "../utils/types";

export default function ParentDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [parentProfile, setParentProfile] = useState<Parent | null>(null);
  const [children, setChildren] = useState<Student[]>([]);
  const [activeChildIndex, setActiveChildIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddChildModal, setShowAddChildModal] = useState(false);

  useEffect(() => {
    loadParentData();
  }, [currentUser]);

  const loadParentData = async () => {
    if (!currentUser) {
      navigate("/parent-login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Load parent profile
      const profile = await getParentProfile(currentUser.uid);
      
      if (!profile) {
        setError("Parent profile not found. Please contact Mr. Lee at pelsanramon@gmail.com");
        setLoading(false);
        return;
      }

      setParentProfile(profile);

      // Load children data
      if (profile.children && profile.children.length > 0) {
        const childrenData = await getChildrenData(profile.children);
        setChildren(childrenData);
      }
    } catch (err: any) {
      setError("Failed to load data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate("/parent-login");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const handleAddChildSuccess = () => {
    setShowAddChildModal(false);
    // Reload parent data to get updated children list
    loadParentData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-red-600 mb-4 text-center text-xl">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">Error</h2>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          <button
            onClick={() => navigate("/parent-login")}
            className="w-full !bg-blue-600 text-white py-2 rounded-lg font-semibold hover:!bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!parentProfile || children.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">No Children Found</h2>
          <p className="text-gray-600 mb-4">
            No children are currently linked to your account. Please contact Mr. Lee at pelsanramon@gmail.com for assistance.
          </p>
          <button
            onClick={handleSignOut}
            className="w-full !bg-gray-600 text-white py-2 rounded-lg font-semibold hover:!bg-gray-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b w-full flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left spacer for centering */}
            <div className="w-24"></div>
            
            {/* Centered Title */}
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold text-gray-800">Parent Portal</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {parentProfile.firstName}!
              </p>
            </div>
            
            {/* Sign Out Button (Top Right) */}
            <button
              onClick={handleSignOut}
              className="px-4 py-2 !bg-gray-200 text-gray-700 rounded-lg hover:!bg-gray-300 transition font-medium whitespace-nowrap"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-auto">
        {/* Child Tabs and Add Child Button */}
        <div className="flex gap-4 mb-6">
          {/* Child Tabs */}
          {children.length > 1 && (
            <div className="bg-white rounded-lg shadow-sm p-2 flex gap-2 overflow-x-auto flex-shrink-0 flex-1">
              {children.map((child, index) => (
                <button
                  key={child.firstName + child.lastName}
                  onClick={() => setActiveChildIndex(index)}
                  className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition ${
                    activeChildIndex === index
                      ? '!bg-blue-600 text-white'
                      : '!bg-gray-100 text-gray-700 hover:!bg-gray-200'
                  }`}
                >
                  {child.firstName} {child.lastName}
                </button>
              ))}
            </div>
          )}
          
          {/* Add Child Button */}
          <button
            onClick={() => setShowAddChildModal(true)}
            className="bg-white rounded-lg shadow-sm px-4 py-3 !bg-green-600 text-white hover:!bg-green-700 transition font-semibold whitespace-nowrap flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Child
          </button>
        </div>

        {/* Active Child Progress - With proper overflow */}
        <div className="overflow-auto">
          {children[activeChildIndex] && (
            <ChildProgressView student={children[activeChildIndex]} />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t w-full flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-600">
          <p>Questions? Contact Mr. Lee @ <a href="mailto:pelsanramon@gmail.com" className="text-blue-600 hover:underline">pelsanramon@gmail.com</a></p>
        </div>
      </footer>

      {/* Add Child Modal */}
      {showAddChildModal && parentProfile && (
        <AddChildModal
          parentUid={parentProfile.uid}
          existingChildren={parentProfile.children}
          onClose={() => setShowAddChildModal(false)}
          onSuccess={handleAddChildSuccess}
        />
      )}
    </div>
  );
}