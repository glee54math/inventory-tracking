import { Routes, Route } from "react-router-dom";

// Pages
import LevelsPage from "../pages/LevelsPage";
import WorkerLogin from "../components/WorkerLogin";
// import Inventory from "../components/Inventory";
// import Database from "../components/Database";

export default function AppRoutes() {
    const baseInventoryURL = "/inventory-tracking";
    return (
        <Routes>
            {/* Auth */}
            <Route path={baseInventoryURL} element={<WorkerLogin />} />
            {/* <Route path={baseInventoryURL+"/login"} element={<WorkerLogin />} /> */}

            {/* Core app
            <Route path="/inventory" element={<Inventory data={data}/>} />
            <Route path="/database" element={<Database />} /> */}

            {/* Levels (dynamic) */}
            <Route path="/levels/:levelId" element={<LevelsPage />} />
        </Routes>
    );
}
