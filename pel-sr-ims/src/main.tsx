import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ActionProvider } from "./components/ActionContext";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ActionProvider>
      <App />
    </ActionProvider>
  </StrictMode>,
)
