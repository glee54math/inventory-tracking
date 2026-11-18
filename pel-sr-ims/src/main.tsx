import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { NameProvider } from "./components/inventory_app/NameContext";
import { StudentProvider } from "./components/student_portal/StudentContext";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Use Vite's BASE_URL ("/inventory-tracking/", trailing slash included) so
        navigate("/") / <Navigate to="/"> — e.g. after idle auto-logout — lands on
        "/inventory-tracking/" instead of "/inventory-tracking", which the Vite dev
        server rejects. Other routes still join cleanly ("/inventory-tracking/dashboard"). */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <NameProvider>
          <StudentProvider>
            <AppRoutes />
          </StudentProvider>
        </NameProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);