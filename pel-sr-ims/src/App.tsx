import { useEffect, useState } from "react";
import { useRef } from "react";
import "./App.css";
import WorkerLogin from "./components/inventory_app/WorkerLogin";
import Sidebar from "./components/inventory_app/Sidebar";
import Inventory from "./components/inventory_app/Inventory";
import {
  determinePacketsNeededToBeOrdered,
} from "./utils/inventoryService";
import Log from "./components/inventory_app/Log";
import type { InventoryData, InsufficientSubsection } from "./utils/types";
import ActionContainer from "./components/inventory_app/ActionContainer";
import type { CellEdit } from "./components/inventory_app/Inventory";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./utils/firebase";
import { useNameContext } from "./components/inventory_app/NameContext";
import Database from "./components/inventory_app/Database";
import WorkerTimeSheet from "./components/inventory_app/WorkerTimeSheet";
import { useIdleDetection } from "./components/inventory_app/useIdleDetection";
import IdleWarningModal from "./components/inventory_app/idleWarningModal";
import FlaggedInventorySummary from "./components/inventory_app/FlaggedInventorySummary";

type InventoryType =
  | "Back Math"
  | "Front Math"
  | "Back English"
  | "Front English";

function restructure(lowStock: InsufficientSubsection[]): InventoryData {
  const result: InventoryData = {};

  for (const { level, range, missingCount } of lowStock) {
    if (!result[level]) {
      result[level] = [];
    }
    result[level].push({ range, count: missingCount });
  }

  return result;
}

function App() {
  const [inventories, setInventories] = useState<
    Record<InventoryType, InventoryData>
  >({} as Record<InventoryType, InventoryData>);
  const [showInventory, setShowInventory] = useState(true);
  const [showActionPanel, setShowActionPanel] = useState(true);
  const [inventoriesVisibility, setInventoriesVisibility] = useState<
    Record<string, boolean>
  >({});
  const { nameOfWorker, setNameOfWorker } = useNameContext();
  const [insufficientPackets, setInsufficientPackets] = useState<
    InsufficientSubsection[]
  >([]);
  const [showInsufficient, setShowInsufficient] = useState<boolean>(false);
  const [showStudentDatabase, setShowStudentDatabase] = useState<boolean>(false);
  const [showTimesheet, setShowTimesheet] = useState<boolean>(false);
  const [showFlaggedSections, setShowFlaggedSections] = useState<boolean>(false);
  const [flagRefreshKey, setFlagRefreshKey] = useState<number>(0);
  // Incremented after each successful submission to reset Inventory cell edit state
  const [inventoryResetKey, setInventoryResetKey] = useState<number>(0);

  // ── Cell edit queue ───────────────────────────────────────────────────────
  // When the user edits a cell in any Inventory, we accumulate CellEdits here
  // and pass them down to ActionContainer, which merges them into its action list.
  const [pendingCellEdits, setPendingCellEdits] = useState<CellEdit[]>([]);

  const handleCellEdit = (edit: CellEdit) => {
    setPendingCellEdits((prev) => {
      // Replace any existing queued edit for the same inventory+level+range
      const filtered = prev.filter(
        (e) =>
          !(
            e.inventoryName === edit.inventoryName &&
            e.level === edit.level &&
            e.range === edit.range
          )
      );
      return [...filtered, edit];
    });
  };

  const handleCellEditsConsumed = () => {
    setPendingCellEdits([]);
  };
  // ─────────────────────────────────────────────────────────────────────────

  const handleIdle = () => {
    setNameOfWorker("");
  };

  const { isWarning, resetTimer, remainingSeconds } = useIdleDetection({
    onIdle: handleIdle,
    idleTime: 150000,
    warningTime: 30000,
    enabled: nameOfWorker !== "",
  });

  const handleStayLoggedIn = () => {
    resetTimer();
  };

  const handleLogout = () => {
    setNameOfWorker("");
  };

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

  const [logHeight, setLogHeight] = useState(250);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const handleMovement = (e: MouseEvent) => {
      if (!isDragging.current) return;
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

  // Map Firestore doc IDs (e.g. "math_back") to display names (e.g. "Back Math")
  // The Inventory component needs the display name to determine movement type.
  const toDisplayName = (firestoreId: string): string => {
    // "math_back" -> "Back Math", "english_front" -> "Front English"
    const parts = firestoreId.split("_");
    if (parts.length === 2) {
      const [subject, side] = parts;
      return `${side.charAt(0).toUpperCase() + side.slice(1)} ${
        subject.charAt(0).toUpperCase() + subject.slice(1)
      }`;
    }
    return firestoreId;
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 p-4 gap-4 overflow-auto">
      {/* Login Screen */}
      {nameOfWorker === "" && <WorkerLogin />}

      {/* Main Dashboard */}
      {nameOfWorker && (
        <div
          id="dashboard"
          className="flex h-screen w-screen bg-gray-100 p-4 gap-4 overflow-auto"
        >
          {/* Sidebar */}
          <div className="bg-gray-100 p-2 min-w-[60px] border w-fit">
            <Sidebar
              showInventory={showInventory}
              toggleInventory={() => setShowInventory((prev) => !prev)}
              toggleStudentDatabase={() => {
                setShowStudentDatabase((prev) => !prev);
                setShowTimesheet(false);
              }}
              toggleTimesheet={() => {
                setShowTimesheet((prev) => !prev);
                setShowStudentDatabase(false);
              }}
              showActions={showActionPanel}
              toggleActions={() => setShowActionPanel((prev) => !prev)}
            />
          </div>

          {/* Inventory Panel || Student Database Panel */}
          <div
            className={`transition-all duration-500 overflow-auto bg-white ${
              showInventory || showStudentDatabase || showTimesheet
                ? `${showActionPanel ? "w-[40%]" : "flex-1"} opacity-100 p-2 border pointer-events-auto`
                : "w-0 opacity-0 !p-0 !border-none pointer-events-none"
            }`}
          >
            {/* Inventories */}
            {showInventory && !showStudentDatabase && !showTimesheet && (
              <div className="overflow-auto w-full max-w-full">
                {Object.entries(inventories).map(([firestoreId, inventory]) => {
                  const displayName = toDisplayName(firestoreId);
                  return (
                    <div key={firestoreId} className="p-2 gap-4">
                      <button
                        onClick={() =>
                          setInventoriesVisibility((prev) => ({
                            ...prev,
                            [firestoreId]: !prev[firestoreId],
                          }))
                        }
                        className="font-bold mb-2 text-center w-full px-1 py-1 rounded hover:!bg-green-300 hover:!border-blue-300"
                      >
                        {displayName} Inventory{" "}
                        {inventoriesVisibility[firestoreId] ? "▼" : "▶"}
                      </button>
                      {inventoriesVisibility[firestoreId] && (
                        <Inventory
                          data={inventory}
                          inventoryName={displayName}
                          onCellEdit={handleCellEdit}
                          resetKey={inventoryResetKey}
                        />
                      )}
                    </div>
                  );
                })}

                {/* Amount Needed to Be Ordered */}
                <div id="insufficient-packets">
                  <button
                    onClick={async () => {
                      const temp = await determinePacketsNeededToBeOrdered();
                      setShowInsufficient((prev) => !prev);
                      setInsufficientPackets(temp);
                    }}
                    className="font-bold mb-2 text-center w-full px-1 py-1 rounded hover:!bg-green-300 hover:!border-blue-300"
                  >
                    Packets That Need To Be Ordered{" "}
                    {showInsufficient ? "▼" : "▶"}
                  </button>
                  {showInsufficient && (
                    <div id="insufficient-packets-table">
                      {/* No onCellEdit here — this is read-only derived data */}
                      <Inventory data={restructure(insufficientPackets)} />
                    </div>
                  )}
                </div>

                {/* Flagged Sections */}
                <div id="flagged-sections">
                  <div className="flex items-center gap-1 mb-2">
                    <button
                      onClick={() => setShowFlaggedSections((prev) => !prev)}
                      className="font-bold text-center flex-1 px-1 py-1 rounded hover:!bg-green-300 hover:!border-blue-300"
                    >
                      Flagged Sections {showFlaggedSections ? "▼" : "▶"}
                    </button>
                    {showFlaggedSections && (
                      <button
                        onClick={() => setFlagRefreshKey((prev) => prev + 1)}
                        title="Refresh flagged sections"
                        className="text-sm text-center rounded border hover:!bg-blue-100"
                      >
                        🔄
                      </button>
                    )}
                  </div>
                  {showFlaggedSections && (
                    <div id="flagged-sections-table">
                      <FlaggedInventorySummary refreshKey={flagRefreshKey} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Student Database */}
            {showStudentDatabase && !showTimesheet && (
              <div className="w-[40%] opacity-100 p-2 border overflow-auto w-full max-w-full">
                <Database />
              </div>
            )}

            {/* Time Card */}
            {showTimesheet && (
              <div className="w-[40%] opacity-100 p-2 border overflow-auto w-full max-w-full">
                <WorkerTimeSheet />
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div
            className={`flex flex-col transition-all duration-500 gap-4 ${
              showActionPanel
                ? `${showInventory || showStudentDatabase || showTimesheet ? "w-[60%]" : "w-full"} opacity-100 overflow-hidden pointer-events-auto`
                : "w-0 opacity-0 overflow-hidden !p-0 pointer-events-none"
            }`}
          >
            <div className="border p-2 bg-white flex-3">
              <div className="flex justify-end items-center">
                <h2 className="font-bold mb-2 text-center w-full">Actions</h2>
              </div>
              <div className="max-h-[70vh] flex flex-col">
                <ActionContainer
                  workerName={nameOfWorker}
                  pendingCellEdits={pendingCellEdits}
                  onCellEditsConsumed={handleCellEditsConsumed}
                  onSubmitSuccess={() => setInventoryResetKey((k) => k + 1)}
                />
              </div>
            </div>

            <div
              className="relative w-full bg-white border"
              style={{ height: `${logHeight}px`, minHeight: "100px" }}
            >
              <div
                className="absolute top-0 left-0 w-full h-2 cursor-row-resize bg-gray-300 z-10"
                onMouseDown={handleMouseDown}
              ></div>
              <div className="pt-2 h-full overflow-auto">
                <h2 className="font-bold mb-2 text-center">Log</h2>
                <Log />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Idle Warning Modal */}
      {isWarning && nameOfWorker && (
        <IdleWarningModal
          workerName={nameOfWorker}
          remainingSeconds={remainingSeconds}
          onConfirm={handleStayLoggedIn}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;