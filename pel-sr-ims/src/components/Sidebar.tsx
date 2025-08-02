// import { useState } from "react";
import { useNameContext } from "./NameContext";

interface SideBarProps {
    showInventory: boolean;
    toggleInventory: () => void;
}

export default function Sidebar({showInventory, toggleInventory}: SideBarProps) {
    // const [showSidebar, setShowSidebar] = useState<boolean>(false);
    const { nameOfWorker } = useNameContext();

    return (
        <div
            id="sidebar"
        >
            <p className="text-center text-xs">
                Hello<br></br>{nameOfWorker}
            </p>
            <button
                id="Inventory"
                onClick={toggleInventory}
                className="mt-2 py-2 hover:!bg-green-300 hover:!border-blue-300"
                title={showInventory ? "Hide" : "Show"}
            >
                {/* {showInventory ? "Hide" : "Show"} */}
                {showInventory ? "⮜ " : "⮞ "}
                
            </button>
        </div>
    )
}