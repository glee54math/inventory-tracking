import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NameProvider } from "./components/NameContext.tsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
// import App from "./App.tsx";
import AppRoutes from "./routes/AppRoutes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/inventory-tracking">
      <NameProvider>
        <AppRoutes />
      </NameProvider>
    </BrowserRouter>
  </StrictMode>
);
