import { useEffect, useState } from "react";
import "./App.css";
import FrontInventory from "./components/FrontInventory";
import { saveInventory, loadInventory } from "./utils/inventoryService";
import data from "./assets/data.json";

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

  const handleUpload = async () => {
    await saveInventory(data);
    alert("Uploaded!");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Inventory Dashboard</h1>
      <button
        onClick={handleUpload}
        className="mt-2 bg-blue-500 text-green px-3 py-1 rounded"
      >
        Upload Local JSON to Backend
      </button>
      <h2 className="mt-4 font-semibold">Fetched Inventory from Firebase:</h2>
      <pre className="bg-gray-100 p-2 rounded mt-2">
        {inventory ? JSON.stringify(inventory, null, 2) : "Loading..."}
      </pre>
      <FrontInventory />
      {/* data={inventory} will need to be passed into Inventory */}
    </div>
  );
}

export default App;
