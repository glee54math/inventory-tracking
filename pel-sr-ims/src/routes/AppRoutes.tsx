// AppRoutes.tsx - Updated with protected routes and parent portal

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

// Pages
import LevelsPage from "../pages/LevelsPage";
import AllLevelsPage from "../pages/AllLevelsPage";
import App from "../App";
import Dashboard from "../components/student_progress_dashboard/Dashboard";
import ParentLogin from "../components/parent_portal/ParentLogin";
import ParentRegistration from "../components/parent_portal/ParentRegistration";
import ParentDashboard from "../components/parent_portal/ParentDashboard";
import StudentLogin from "../components/student_portal/StudentLogin";
import StudentDashboard from "../components/student_portal/StudentDashboard";
import ProtectedRoute from "../routes/ProtectedRoutes";

export default function AppRoutes() {
  const { currentUser, userRole } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/parent-login" element={<ParentLogin />} />
      <Route path="/parent-registration" element={<ParentRegistration />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/student-portal" element={<StudentDashboard />} />
      <Route path="/student-levels/:levelId" element={<LevelsPage />} />

      {/* Protected Parent Routes */}
      <Route
        path="/parent-dashboard"
        element={
          <ProtectedRoute allowedRoles={["parent"]}>
            <ParentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin/Worker Routes */}
      <Route
        path="/"
        element={
          currentUser && (userRole === "admin" || userRole === "worker") ? (
            <App />
          ) : currentUser && userRole === "parent" ? (
            <Navigate to="/parent-dashboard" replace />
          ) : (
            <App />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/levels/LevelsPage"
        element={
          <ProtectedRoute allowedRoles={["admin", "worker"]}>
            <AllLevelsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/levels/:levelId"
        element={
          <ProtectedRoute allowedRoles={["admin", "worker"]}>
            <LevelsPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback - redirect based on role */}
      <Route
        path="*"
        element={
          currentUser && userRole === "parent" ? (
            <Navigate to="/parent-dashboard" replace />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}