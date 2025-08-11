// import { useState } from "react";
import { useState, useRef, useEffect } from "react";
import { useNameContext } from "./NameContext";

interface SideBarProps {
    showInventory: boolean;
    toggleInventory: () => void;
}

export default function Sidebar({showInventory, toggleInventory}: SideBarProps) {
    // const [showSidebar, setShowSidebar] = useState<boolean>(false);
    const { nameOfWorker } = useNameContext();
    const [isProfileButtonPressed, setIsProfileButtonPressed] = useState<boolean>(false);
    const profileDropdownRef = useRef<HTMLDivElement|null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
            setIsProfileButtonPressed(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [profileDropdownRef]);

    return (
        <div
            id="sidebar"
        >
            {/* Profile Button */}
            <div id="profile-button" ref={profileDropdownRef} className="mb-3">
                <p className="text-xs">
                    Logged in as:
                </p>
                <button 
                    onClick={() => setIsProfileButtonPressed(!isProfileButtonPressed)}
                    className="w-full !bg-gray-200 px-3 py-2 border outline-1 outline-gray-200 rounded hover:!bg-green-300"
                >
                    {nameOfWorker}
                </button>
                {isProfileButtonPressed && (
                    <ul className="absolute mt-2 w-32 bg-white border border-gray-300 rounded">
                        <li className="rounded">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full text-left px-4 py-2 text-sm hover:!bg-gray-200 rounded"
                            >
                                Log Out
                            </button>
                        </li>
                    </ul>
                )}
            </div>
            {/* Hide/Show Inventory Button */}
            <div id="inventory-button" className="mb-3 w-full mx-1/2">
                <p className="text-xs">
                    {showInventory ? "Hide Inventory" : "Show Inventory"}
                </p>
                <button
                    id="Inventory"
                    onClick={toggleInventory}
                    className="py-2 w-full !bg-gray-200 hover:!bg-green-300 hover:!border-blue-300"
                    title={showInventory ? "Hide" : "Show"}
                >
                    {/* {showInventory ? "Hide" : "Show"} */}
                    {showInventory ? "⮜ " : "⮞ "}  
                </button>
            </div>
        </div>
    )
}