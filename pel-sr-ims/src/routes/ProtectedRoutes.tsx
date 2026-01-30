// ProtectedRoute.tsx - Component for protecting routes based on authentication and roles

import { Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import type { UserRole } from "../utils/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { currentUser, userRole, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not logged in
  if (requireAuth && !currentUser) {
    return <Navigate to="/parent-login" replace />;
  }

  // Check if user has required role
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Redirect based on user role
    switch (userRole) {
      case "admin":
        return <Navigate to="/dashboard" replace />;
      case "worker":
        return <Navigate to="/" replace />;
      case "parent":
        return <Navigate to="/parent-dashboard" replace />;
      case "student":
        return <Navigate to="/student-dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}