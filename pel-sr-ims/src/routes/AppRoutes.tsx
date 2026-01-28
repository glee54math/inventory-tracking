import { Routes, Route } from "react-router-dom";

// Pages
import LevelsPage from "../pages/LevelsPage";
import App from "../App";
import Dashboard from "../components/Dashboard";
// import Inventory from "../components/Inventory";
// import Database from "../components/Database";

export default function AppRoutes() {
    
    return (
        <Routes>
            {/* Auth */}
            <Route path={"/"} element={<App />} />
            {/* <Route path={baseInventoryURL+"/login"} element={<WorkerLogin />} /> */}
            {/* ^^ will eventually replace the WorkerLogin state. Will need to rethink NameContext too  */}

            {/* Core app
            <Route path="/inventory" element={<Inventory data={data}/>} />
            <Route path="/database" element={<Database />} /> */}

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Levels (dynamic) */}
            <Route path={"/levels/:levelId"} element={<LevelsPage />} />
        </Routes>
    );
}