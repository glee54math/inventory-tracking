import { useEffect, useState } from "react";
import { useRef } from "react";
import "./App.css";
import WorkerLogin from "./components/WorkerLogin";
import Sidebar from "./components/Sidebar";
import Inventory from "./components/Inventory";
import {
  // saveInventory,
  // loadInventory,
  // loadAllInventories,
  determinePacketsNeededToBeOrdered,
} from "./utils/inventoryService";
import Log from "./components/Log";
// import data from "./assets/data.json";
// import dataMath from "./assets/dataMath.json";
import type { InventoryData, InsufficientSubsection } from "./utils/types";
import ActionContainer from "./components/ActionContainer";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./utils/firebase";
import { useNameContext } from "./components/NameContext";
import Database from "./components/Database";
import AppRoutes from "./routes/AppRoutes";

type InventoryType =
  | "Back Math"
  | "Front Math"
  | "Back English"
  | "Front English";

function restructure(lowStock: InsufficientSubsection[]): InventoryData {
  const result: InventoryData = {};

  // console.log(lowStock);
  for (const { level, range, missingCount } of lowStock) {
    if (!result[level]) {
      result[level] = [];
    }

    result[level].push({
      range,
      count: missingCount,
    });
  }

  return result;
}

function App() {
  const [inventories, setInventories] = useState<
    Record<InventoryType, InventoryData>
  >({} as Record<InventoryType, InventoryData>);
  const [showInventory, setShowInventory] = useState(true);
  const [inventoriesVisibility, setInventoriesVisibility] = useState<
    Record<string, boolean>
  >({});
  // const [userLoggedIn, setUserLoggedIn] = useState<string>(""); // pivoted to NameContext
  const {nameOfWorker} = useNameContext();
  const [insufficientPackets, setInsufficientPackets] = useState<
    InsufficientSubsection[]
  >([]);
  const [showInsufficient, setShowInsufficient] = useState<boolean>(false);
  const [showStudentDatabase, setShowStudentDatabase] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const newInventories: Record<string, InventoryData> = {};

      snapshot.forEach((doc) => {
        newInventories[doc.id] = doc.data();
      });
      setInventories(newInventories);
    });
    return () => unsubscribe();
  }, []);

  // Keep this in case we need to hard upload.
  // const handleUpload = async () => {
  //   saveInventory(data, "english_front");
  //   saveInventory(data, "english_back");
  //   saveInventory(dataMath, "math_back");
  //   saveInventory(dataMath, "math_front");
  //   alert("Uploaded!");
  // };

  const [logHeight, setLogHeight] = useState(250);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
  }
  useEffect(() => {
    const handleMovement = (e: MouseEvent) => {
    if(!isDragging.current) return;
    const newHeight = window.innerHeight - e.clientY - 32;
    setLogHeight(Math.max(150, newHeight));
    };  
    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMovement);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMovement);
      window.removeEventListener("mouseup", handleMouseUp);
  };
}, []);

  return (
    <div className="flex h-screen w-screen bg-gray-100 p-4 gap-4 overflow-auto">
      {/* Makeshift Login Screen */}
      {nameOfWorker === "" && (
        <WorkerLogin />
      )}

      {nameOfWorker && (
        <div
          id="dashboard"
          className="flex h-screen w-screen bg-gray-100 p-4 gap-4 overflow-auto"
        >
          {/* Sidebar */}
          <div className="bg-gray-100 p-2 min-w-[60px] border w-fit">
            <Sidebar 
              showInventory = {showInventory}
              toggleInventory={() => setShowInventory(prev => !prev)}
              toggleStudentDatabase={() => setShowStudentDatabase(prev => !prev)}
            />
            
          </div>

          {/* Inventory Panel || Student Database Panel */}
          <div
            className={`transition-all duration-500 overflow-auto bg-white ${
              showInventory || showStudentDatabase
                ? "w-[40%] opacity-100 p-2 border pointer-events-auto"
                : "w-0 opacity-0 !p-0 !border-none pointer-events-none"
            }`}
          >

            {/* Inventories */}
            {showInventory && !showStudentDatabase && (
              <div className="overflow-auto w-full max-w-full">
                {Object.entries(inventories).map(([name, inventory]) => (
                  <div key={name} className="p-2 gap-4">
                    <button
                      onClick={() =>
                        setInventoriesVisibility((prev) => ({
                          ...prev,
                          [name]: !prev[name],
                        }))
                      }
                      className="font-bold mb-2 text-center w-full px-1 py-1 rounded hover:!bg-green-300 hover:!border-blue-300"
                    >
                      {name} Inventory {inventoriesVisibility[name] ? "▼" : "▶"}
                    </button>
                    {inventoriesVisibility[name] && (
                      <Inventory data={inventory} />
                    )}
                  </div>
                ))}
                
                {/* Amount Needed to Be Ordered */}
                <div id="insufficient-packets">
                  <button
                    onClick={async () => {
                      //fetch data before setting state
                      const temp = await determinePacketsNeededToBeOrdered();
                      setShowInsufficient((prev) => !prev);
                      setInsufficientPackets(temp);
                    }}
                    className="font-bold mb-2 text-center w-full px-1 py-1 rounded hover:!bg-green-300 hover:!border-blue-300"
                  >
                    Packets That Need To Be Ordered {showInsufficient ? "▼" : "▶"}
                  </button>

                  {showInsufficient && (
                    <div id="insufficient-packets-table">
                      <Inventory data={restructure(insufficientPackets)} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Student Database */}
            {showStudentDatabase && (
              <div className="w-[40%] opacity-100 p-2 border overflow-auto w-full max-w-full">
                <Database />
              </div>
            )}

            
          </div>

          {/* Right Panel */}
          <div
            className={`flex flex-col transition-all duration-500 gap-4 overflow-hidden ${
              showInventory ? "w-[60%]" : "w-full"
            }`}
          >
            <div className="border p-2 bg-white flex-3">
              <div className="flex justify-end items-center">
                <h2 className="font-bold mb-2 text-center w-full">Actions</h2>
              </div>
              <div className="max-h-[70vh] flex flex-col">
                <ActionContainer workerName={nameOfWorker}/>
              </div>
            </div>
                  
           
            <div className="relative w-full bg-white border"
              style={{ height: `${logHeight}px`, minHeight: "100px" }}
            >

              <div className="absolute top-0 left-0 w-full h-2 cursor-row-resize bg-gray-300 z-10"
                onMouseDown={handleMouseDown}>
              </div>

              <div className="pt-2 h-full overflow-auto">
                <h2 className="font-bold mb-2 text-center">Log</h2>
                <Log />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <AppRoutes /> */}
    </div>
  );
}

export default App;
