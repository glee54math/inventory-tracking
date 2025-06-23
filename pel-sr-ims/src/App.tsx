import { useEffect, useState } from "react";
import "./App.css";
import Inventory from "./components/Inventory";
import Action from "./components/Action";
import { saveInventory, loadInventory } from "./utils/inventoryService";
import Log from "./components/Log";
import data from "./assets/data.json";
import type { InventoryData } from "./utils/types";
import ActionContainer from "./components/ActionContainer";

type InventoryType =
  | "Back Math"
  | "Front Math"
  | "Back English"
  | "Front English";

function App() {
  const [inventories, setInventories] = useState<
    Record<InventoryType, InventoryData>
  >({} as Record<InventoryType, InventoryData>);

  // const actions = Action[]; // Array of Actions that will get processed.
  // Below will be used later.
  // const [frontMath, setFrontMath] = useState<object | null>(null);
  // const [frontEnglish, setFrontEnglish] = useState<object | null>(null);
  // const [backMath, setBackMath] = useState<object | null>(null);
  // const [backEnglish, setBackEnglish] = useState<object | null>(null);

  useEffect(() => {
    const load = async () => {
      const dataMathBack = await loadInventory("math_back");
      const dataMathFront = await loadInventory("math_front");
      setInventories((prev) => ({
        ...prev,
        "Back Math": dataMathBack,
        "Front Math": dataMathFront,
      }));
    };
    load();
  }, []);

  // I'll upload later.
  const handleUpload = async () => {
    await saveInventory(data, "math_back");
    alert("Uploaded!");
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 p-4 gap-4 overflow-hidden">
      {/* Left Side */}
      <div className="flex flex-col w-1/2 gap-4 overflow-hidden">
        <div className="border p-2 bg-white flex-1 flex flex-col items-center justify-start">
          {inventories && (
            <div className="overflow-auto w-full max-w-full">
              {Object.entries(inventories).map(([name, inventory]) => (
                <div key={name} className="p-2 gap-4">
                  <h2 className="font-bold mb-2 text-center">
                    {name} Inventory
                  </h2>
                  <Inventory key={name} data={inventory} />
                </div>
              ))}
            </div>
          )}
          {/* {
            <button
              onClick={handleUpload}
              className="mt-2 bg-blue-500 text-green px-3 py-1 rounded"
            >
              Upload Local JSON to Backend
            </button>
          } */}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col w-1/2 gap-4 overflow-hidden">
        <div className="border p-2 bg-white flex-1">
          <h2 className="font-bold mb-2 text-center">Actions</h2>
          <ActionContainer />
        </div>
        <div className="border p-2 bg-white flex-1">
          <h2 className="font-bold mb-2 text-center">Log</h2>
          <Log />
        </div>
      </div>
    </div>
  );
}

export default App;
