import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { NameProvider } from "./components/inventory_app/NameContext";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/inventory-tracking">
      <AuthProvider>
        <NameProvider>
          <AppRoutes />
        </NameProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);