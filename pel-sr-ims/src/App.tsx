import { useEffect, useState } from "react";
import "./App.css";
import WorkerLogin from "./components/WorkerLogin";
import Sidebar from "./components/Sidebar";
import Inventory from "./components/Inventory";
import {
  // saveInventory,
  // loadInventory,
  loadAllInventories,
  determinePacketsNeededToBeOrdered,
} from "./utils/inventoryService";
import Log from "./components/Log";
// import data from "./assets/data.json";
// import dataMath from "./assets/dataMath.json";
import type { InventoryData, InsufficientSubsection } from "./utils/types";
import ActionContainer from "./components/ActionContainer";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./utils/firebase";

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
  const [userLoggedIn, setUserLoggedIn] = useState<string>("");
  const [insufficientPackets, setInsufficientPackets] = useState<
    InsufficientSubsection[]
  >([]);
  const [showInsufficient, setShowInsufficient] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const newInventories: Record<string, InventoryData> = {};

      snapshot.forEach((doc) => {
        newInventories[doc.id] = doc.data();
      });
      setInventories(newInventories);
    });
    return () => unsubscribe();
    // const load = async () => {
    //   const allData = await loadAllInventories();
    //   console.log(allData);
    //   const inventoryNames = Object.keys(allData);
    //   const inventoryData = Object.values(allData);

    //   console.log(inventoryData);

    //   const newInventories: Record<string, any> = {};
    //   const visibility: Record<string, boolean> = {};

    //   inventoryNames.forEach((name, index) => {
    //     newInventories[name] = inventoryData[index];
    //   });

    //   setInventories(newInventories);
    //   setInventoriesVisibility(visibility);
    // };
    // load();
  }, []);

  // Keep this in case we need to hard upload.
  // const handleUpload = async () => {
  //   saveInventory(data, "english_front");
  //   saveInventory(data, "english_back");
  //   saveInventory(dataMath, "math_back");
  //   saveInventory(dataMath, "math_front");
  //   alert("Uploaded!");
  // };

  return (
    <div className="flex h-screen w-screen bg-gray-100 p-4 gap-4 overflow-hidden">
      {/* Makeshift Login Screen */}
      {userLoggedIn === "" && (
        <WorkerLogin
          nameOfWorker={userLoggedIn}
          setNameOfWorker={setUserLoggedIn}
        />
      )}

      {userLoggedIn && (
        <div
          id="dashboard"
          className="flex h-screen w-screen bg-gray-100 p-4 gap-4 overflow-hidden"
        >
          {/* Sidebar */}
          <div className="bg-gray-100 p-2 min-w-[60px] border w-fit">
            <Sidebar />
          </div>

          {/* Inventory Panel */}
          <div
            className={`transition-all duration-500 overflow-auto bg-white ${
              showInventory
                ? "w-[40%] opacity-100 p-2 border pointer-events-auto"
                : "w-0 opacity-0 !p-0 !border-none pointer-events-none"
            }`}
          >
            {/* Hide Inventory Button */}
            <button
              onClick={() => setShowInventory(false)}
              className="mb-2 w-full text-black mt-2 px-3 py-1 rounded hover:!bg-green-300 hover:!border-blue-300"
            >
              Hide Inventory
            </button>

            {/* Inventories */}
            {inventories && (
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
              </div>
            )}

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

          {/* Right Panel */}
          <div
            className={`flex flex-col transition-all duration-500 gap-4 overflow-hidden ${
              showInventory ? "w-[60%]" : "w-full"
            }`}
          >
            <div className="border p-2 bg-white flex-3">
              <div className="flex justify-end items-center">
                <h2 className="font-bold mb-2 text-center w-full">Actions</h2>
                {!showInventory && (
                  <button
                    onClick={() => setShowInventory(true)}
                    className="bg-green-500 text-black px-2 py-1 rounded hover:!bg-green-300"
                  >
                    Show Inventory
                  </button>
                )}
              </div>
              <div className="max-h-[70vh] flex flex-col">
                <ActionContainer />
              </div>
            </div>

            <div className="border p-2 bg-white flex-1">
              <h2 className="font-bold mb-2 text-center">Log</h2>
              <div className="max-h-[20vh] flex flex-col">
                <Log />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
