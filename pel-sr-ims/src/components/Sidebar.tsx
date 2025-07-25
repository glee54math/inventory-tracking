import { useState } from "react";

interface SideBarProps {
    showInventory: boolean;
    toggleInventory: () => void;
}

export default function Sidebar({showInventory, toggleInventory}: SideBarProps) {
    // const [showSidebar, setShowSidebar] = useState<boolean>(false);

    const handleSidebar = () => {

    }

    return (
        <div
            id="sidebar"
        >
            <button
                id="Inventory"
                onClick={toggleInventory}
                className="mt-2 py-2 hover:!bg-green-300 hover:!border-blue-300"
                title={showInventory ? "Hide" : "Show"}
            >
                {showInventory ? "Hide" : "Show"}
                {/* {showInventory ? "⮜ " : "⮞ "} */}
            </button>
        </div>
    )
}