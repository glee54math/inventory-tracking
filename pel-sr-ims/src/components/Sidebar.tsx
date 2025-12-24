// import { useState } from "react";
import { useState, useRef, useEffect } from "react";
import { useNameContext } from "./NameContext";
import { useNavigate } from "react-router-dom";

interface SideBarProps {
    showInventory: boolean;
    toggleInventory: () => void;
    toggleStudentDatabase: () => void;
}

export default function Sidebar({showInventory, toggleInventory, toggleStudentDatabase}: SideBarProps) {
    // const [showSidebar, setShowSidebar] = useState<boolean>(false);
    const sideBarButtonCSS = "py-2 w-full !bg-gray-200 hover:!bg-green-300 hover:!border-blue-300";
    const { nameOfWorker } = useNameContext();
    const [isProfileButtonPressed, setIsProfileButtonPressed] = useState<boolean>(false);
    const profileDropdownRef = useRef<HTMLDivElement|null>(null);
    const levelsDropdownRef = useRef<HTMLDivElement | null>(null);
    const [isLevelsButtonPressed, setIsLevelsButtonPressed] = useState<boolean>(false);
    const [levelsArray, setLevelsArray] = useState<string[]>(
        [
            "MK1", "MK2", "MK3", "MK4",
            "MG1", "MG2", "MG3", "MG4", "MG5", "MG6", "MG7", "MG8", "MG9", "MG10", "MG11", 
            "MM1", "MM2", "MM3", 
            "MH1", "MH2", "MH3", "MH4", "MH5", "MH6", "MHG", "MHT",

            "EK1", "EK2", "EK3", "EK4", "EK5", 
            "EG1", "EG1B", "EG2", "EG2B", "EG3", "EG4", "EG5", "EG6", "EG7", "EG8", "EG9", "EG10",
            "EM1", "EM2", "EM3", "EM4", "EM5",
            "EH1", "EH2", "EH3", "EH4", "EH5", "EH6",
        ]
    );
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const mouseTarget = event.target as Node;
        
            // profile dropdown
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(mouseTarget)) {
                setIsProfileButtonPressed(false);
            }

            // levelSelection dropdown
            if (levelsDropdownRef.current && !levelsDropdownRef.current.contains(mouseTarget)) {
                setIsLevelsButtonPressed(false);
            }

        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    return (
        <div
            id="sidebar"
        >
            {/* Profile Button */}
            <div id="profile-button" ref={profileDropdownRef} className="mb-3">
                <p className="text-xs text-center">
                    Logged in as:
                </p>
                <button 
                    onClick={() => setIsProfileButtonPressed(!isProfileButtonPressed)}
                    className={sideBarButtonCSS}
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
                <p className="text-xs text-center">
                    {showInventory ? "Hide Inventory" : "Show Inventory"}
                </p>
                <button
                    id="Inventory"
                    onClick={toggleInventory}
                    className={sideBarButtonCSS}
                    title={showInventory ? "Hide" : "Show"}
                >
                    {/* {showInventory ? "Hide" : "Show"} */}
                    {showInventory ? "⮜ " : "⮞ "}  
                </button>
            </div>

            {/* Student Database */}
            <div id="student-database-button" className="mb-3 w-full mx-1/2">
                <p className="text-xs text-center">
                    Student Database
                </p>
                <a>
                    <button
                        id="student-database"
                        onClick={toggleStudentDatabase}
                        className={sideBarButtonCSS}
                    >
                        SDB
                    </button>
                </a>
            </div>

            {/* Levels */}
            <div id="levels-dropdown" ref={levelsDropdownRef} className="mb-3">
                <p className="text-xs text-center">
                    All Levels
                </p>
                <button
                    id="level-dropdown-button"
                    onClick={() => setIsLevelsButtonPressed(!isLevelsButtonPressed)}
                    className={sideBarButtonCSS}
                >
                    Levels
                </button>
                {isLevelsButtonPressed && (
                    <ul id="level-dropdown-button-list" className="absolute mt-2 w-32 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded">
                        {levelsArray.map((level:string, index) => (
                            <li 
                                id={level+"-button-redirect"}
                                key={level+"-button-redirect"}
                                className="rounded">
                                <button
                                    onClick={() => {
                                        // return level pressed
                                        console.log(level + " was pressed on Sidebar.");
                                        navigate(`/levels/${level}`);
                                        // close the dropdown
                                        setIsLevelsButtonPressed(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm hover:!bg-gray-200 rounded"
                                >
                                    {level}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Presentation */}
            <div id="presentation-slides" className="mb-3 w-full mx-1/2">
                <p id="presentation-slides-text-on-top-of-button" className="text-xs text-center">
                    Presentation 
                </p>
                <button
                    // Will go to slides; different tsx files that link together
                    className={sideBarButtonCSS}
                >
                    Slides
                </button>
            </div>
        </div>
    )
}