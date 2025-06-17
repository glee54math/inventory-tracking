import { useEffect, useState } from "react";
import "./App.css";
import FrontInventory from "./components/FrontInventory";
import { saveInventory, loadInventory } from "./utils/inventoryService";
import data from "./assets/data.json";
import Action from "./components/Action";
import Log from "./components/Log"

function App() {
  const [inventory, setInventory] = useState<object | null>(null);
  // Below will be used later.
  // const [frontMath, setFrontMath] = useState<object | null>(null);
  // const [frontEnglish, setFrontEnglish] = useState<object | null>(null);
  // const [backMath, setBackMath] = useState<object | null>(null);
  // const [backEnglish, setBackEnglish] = useState<object | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await loadInventory();
      setInventory(data);
    };
    load();
  }, []);

  // I'll upload later.
  const handleUpload = async () => {
    await saveInventory(data);
    alert("Uploaded!");
  };


  let x = 5;
  return (
    <div className="flex h-screen w-screen bg-gray-100 p-4 gap-4 overflow-hidden">
      {/* Left Side */}
      <div className="flex flex-col w-1/2 gap-4 overflow-hidden">
        <div className="border p-2 bg-white flex-1 flex flex-col items-center justify-start">
          <h2 className="font-bold mb-2">Inventory 1</h2>
          <div className="overflow-auto w-full max-w-full">
            {inventory && <FrontInventory data={inventory} />}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col w-1/2 gap-4 overflow-hidden">
        <div className="border p-2 bg-white flex-1">
          <h2 className="font-bold mb-2 text-center">Actions</h2>
          <Action />
          
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

{
  /* <button
          onClick={handleUpload}
          className="mt-2 bg-blue-500 text-green px-3 py-1 rounded"
        >
          Upload Local JSON to Backend
        </button> */
}
