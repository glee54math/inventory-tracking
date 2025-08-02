import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NameProvider } from "./components/NameContext.tsx";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NameProvider>
      <App />
    </NameProvider>
  </StrictMode>
);
