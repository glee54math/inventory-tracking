// ParentDashboard.tsx - Main parent dashboard with child tabs

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { getParentProfile } from "../utils/parentService";
import { signOutUser } from "../utils/authService";
import { getChildrenData } from "../utils/parentService";
import ChildProgressView from "./ChildProgressView";
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
        setError("Parent profile not found. Please contact Mr. Lee.");
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
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
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
            No children are currently linked to your account. Please contact Mr. Lee for assistance.
          </p>
          <button
            onClick={handleSignOut}
            className="w-full bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Parent Portal</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {parentProfile.firstName}!
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Child Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children.length > 1 && (
          <div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex gap-2 overflow-x-auto">
            {children.map((child, index) => (
              <button
                key={child.firstName + child.lastName}
                onClick={() => setActiveChildIndex(index)}
                className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition ${
                  activeChildIndex === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {child.firstName} {child.lastName}
              </button>
            ))}
          </div>
        )}

        {/* Active Child Progress */}
        {children[activeChildIndex] && (
          <ChildProgressView student={children[activeChildIndex]} />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-600">
          <p>Questions? Contact Mr. Lee</p>
        </div>
      </footer>
    </div>
  );
}