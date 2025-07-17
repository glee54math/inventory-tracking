import { useState } from "react";

export default function Sidebar() {
    // const [showSidebar, setShowSidebar] = useState<boolean>(false);

    const handleSidebar = () => {

    }

    return (
        <div
            id="sidebar"
        >
            <button
                id="Inventory"
                className="mt-2 py-2 hover:!bg-green-300 hover:!border-blue-300"
            >
                I
            </button>
        </div>
    )
}