import { useEffect, useState } from "react";
import type { LogEntry, LogActionData } from "../../utils/types";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { reassignLogEntry, canEditLogEntry, undoLogAction, undoMultipleLogActions } from "../../utils/inventoryService";
import { useNameContext } from "./NameContext";
import WorkerSwitchModal from "./WorkerSwitchModal";

interface LogEntryWithId extends LogEntry {
  id: string;
  reassignedFrom?: string;
  reassignedBy?: string;
  reassignedAt?: Date;
  undoData?: LogActionData;
  isUndone?: boolean;
  undoneAt?: Date;
  undoneBy?: string;
}

function Log() {
  const [actionLog, setActionLog] = useState<LogEntryWithId[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [reassigningLogId, setReassigningLogId] = useState<string | null>(null);
  const [showWorkerSwitch, setShowWorkerSwitch] = useState<boolean>(false);
  const [undoInProgress, setUndoInProgress] = useState<string | null>(null);
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selectedLogIds, setSelectedLogIds] = useState<Set<string>>(new Set());
  const [bulkUndoInProgress, setBulkUndoInProgress] = useState<boolean>(false);
  
  const { nameOfWorker } = useNameContext();

  useEffect(() => {
    const logsQuery = query(
      collection(db, "logs"),
      orderBy("timeStamp", "desc"),
      limit(visibleCount)
    );

    const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
      const newLogs: LogEntryWithId[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        newLogs.push({
          id: doc.id,
          timeStamp: data.timeStamp.toDate(),
          userID: data.userID,
          eventType: data.eventType,
          message: data.message,
          reassignedFrom: data.reassignedFrom,
          reassignedBy: data.reassignedBy,
          reassignedAt: data.reassignedAt?.toDate(),
          undoData: data.undoData,
          isUndone: data.isUndone ?? false,
          undoneAt: data.undoneAt?.toDate(),
          undoneBy: data.undoneBy,
        });
      });
      setActionLog(newLogs);
    });

    return () => unsubscribe();
  }, [visibleCount]);

  const handleLogClick = (logId: string) => {
    if (expandedLogId === logId) {
      setExpandedLogId(null);
    } else {
      setExpandedLogId(logId);
    }
  };

  const handleReassignClick = (logId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent log expansion
    setReassigningLogId(logId);
    setShowWorkerSwitch(true);
  };

  const handleWorkerSwitchForReassign = async (newWorkerInitials: string) => {
    if (!reassigningLogId) return;

    try {
      const success = await reassignLogEntry(
        reassigningLogId,
        newWorkerInitials,
        nameOfWorker
      );

      if (success) {
        // Success - the snapshot listener will update the UI automatically
        console.log("Log entry reassigned successfully");
      } else {
        alert("Failed to reassign log entry. It may be older than 4 hours.");
      }
    } catch (error) {
      console.error("Error reassigning log:", error);
      alert("An error occurred while reassigning the log entry.");
    } finally {
      setShowWorkerSwitch(false);
      setReassigningLogId(null);
    }
  };

  const handleCancelReassign = () => {
    setShowWorkerSwitch(false);
    setReassigningLogId(null);
  };

  const checkIfCanEdit = async (logTimestamp: Date): Promise<boolean> => {
    return await canEditLogEntry(logTimestamp);
  };

  const handleToggleSelectMode = () => {
    setSelectMode((prev) => !prev);
    setSelectedLogIds(new Set());
  };

  const handleCheckboxToggle = (entryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLogIds((prev) => {
      const next = new Set(prev);
      if (next.has(entryId)) {
        next.delete(entryId);
      } else {
        next.add(entryId);
      }
      return next;
    });
  };

  const handleBulkUndo = async () => {
    if (selectedLogIds.size === 0) return;
    if (!window.confirm(`Undo ${selectedLogIds.size} selected action${selectedLogIds.size > 1 ? "s" : ""}? This will reverse all selected inventory changes.`)) return;

    // Sort selected entries newest-first using timestamps already in state
    const selectedEntries = actionLog
      .filter((e) => selectedLogIds.has(e.id))
      .sort((a, b) => b.timeStamp.getTime() - a.timeStamp.getTime())
      .map((e) => ({ id: e.id, message: e.message }));

    setBulkUndoInProgress(true);
    try {
      const { failed } = await undoMultipleLogActions(selectedEntries, nameOfWorker);
      if (failed.length > 0) {
        const lines = failed.map((f) => `• ${f.message}`).join("\n");
        alert(`The following action${failed.length > 1 ? "s" : ""} could not be undone:\n\n${lines}`);
      }
    } catch (error) {
      console.error("Error during bulk undo:", error);
      alert("An unexpected error occurred during bulk undo.");
    } finally {
      setBulkUndoInProgress(false);
      setSelectedLogIds(new Set());
      setSelectMode(false);
    }
  };

  const handleUndoClick = async (entry: LogEntryWithId, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Undo this action? This will reverse the inventory change.")) return;

    setUndoInProgress(entry.id);
    try {
      const success = await undoLogAction(entry.id, nameOfWorker);
      if (!success) {
        alert("Failed to undo this action.");
      }
    } catch (error) {
      console.error("Error undoing log action:", error);
      alert("An error occurred while undoing the action.");
    } finally {
      setUndoInProgress(null);
    }
  };

  return (
    <div className="mx-2 overflow-auto">
      {/* Bulk undo toolbar */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={handleToggleSelectMode}
          className="px-3 py-1 text-sm border rounded border-blue-400 text-blue-600 hover:!bg-blue-50 transition-colors"
        >
          {selectMode ? "Cancel" : "Select to Undo"}
        </button>
        {selectMode && (
          <button
            onClick={handleBulkUndo}
            disabled={selectedLogIds.size === 0 || bulkUndoInProgress}
            className="px-3 py-1 text-sm border rounded border-red-400 text-red-600 hover:!bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {bulkUndoInProgress ? "Undoing..." : `Undo Selected (${selectedLogIds.size})`}
          </button>
        )}
      </div>

      {actionLog.map((entry, index) => {
        const isExpanded = expandedLogId === entry.id;
        const canEdit = checkIfCanEdit(entry.timeStamp);

        return (
          <div key={entry.id} className="mb-2">
            <div className="flex items-center">
              {selectMode && (
                <input
                  type="checkbox"
                  checked={selectedLogIds.has(entry.id)}
                  disabled={!!entry.isUndone || !entry.undoData}
                  onClick={(e) => handleCheckboxToggle(entry.id, e)}
                  onChange={() => {}}
                  className="ml-1 mr-2 h-4 w-4 shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                />
              )}
            <button
              onClick={() => handleLogClick(entry.id)}
              className="flex-1 m-1 p-2 text-left text-black hover:!bg-blue-100 border outline-1 outline-blue-500 rounded transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className={`flex-1 ${entry.isUndone ? "line-through text-gray-400" : ""}`}>
                  {index + 1}) {entry.timeStamp.toLocaleDateString()}{" "}
                  {entry.timeStamp.toLocaleTimeString()} | {entry.message}
                </span>
                <span className="ml-2 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {entry.userID}
                </span>
              </div>

              {entry.isUndone && (
                <div className="mt-1 text-xs text-red-500">
                  Undone by {entry.undoneBy} at {entry.undoneAt?.toLocaleString()}
                </div>
              )}

              {entry.reassignedFrom && (
                <div className="mt-1 text-xs text-orange-600">
                  ⚠️ Reassigned from {entry.reassignedFrom} by {entry.reassignedBy}
                </div>
              )}
            </button>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="ml-4 mr-1 mb-2 p-3 bg-gray-50 border border-gray-200 rounded">
                <div className="text-sm space-y-2">
                  <div>
                    <strong className="text-gray-700">Event Type:</strong>{" "}
                    <span className="text-gray-900">{entry.eventType}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Worker:</strong>{" "}
                    <span className="text-gray-900">{entry.userID}</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Time:</strong>{" "}
                    <span className="text-gray-900">
                      {entry.timeStamp.toLocaleString()}
                    </span>
                  </div>
                  
                  {entry.reassignedFrom && (
                    <div className="pt-2 border-t border-gray-300">
                      <strong className="text-orange-700">Reassignment History:</strong>
                      <div className="ml-2 text-xs text-gray-600">
                        Originally: {entry.reassignedFrom}
                        <br />
                        Reassigned by: {entry.reassignedBy}
                        <br />
                        Reassigned at: {entry.reassignedAt?.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {/* Reassign Button */}
                  <div className="pt-2 border-t border-gray-300">
                    <button
                      onClick={(e) => {
                        canEdit.then((editable) => {
                          if (editable) {
                            handleReassignClick(entry.id, e);
                          } else {
                            alert("This log entry is older than 4 hours and cannot be reassigned.");
                          }
                        });
                      }}
                      className="text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1.5 rounded border border-orange-300 transition-colors"
                    >
                      🔄 Reassign to Different Worker
                    </button>
                    <p className="text-xs text-gray-500 mt-1">
                      (Only available within 4 hours of creation)
                    </p>
                  </div>

                  {/* Undo Button */}
                  <div className="pt-2 border-t border-gray-300">
                    {entry.isUndone ? (
                      <p className="text-xs text-red-500">
                        Undone by {entry.undoneBy} at {entry.undoneAt?.toLocaleString()}
                      </p>
                    ) : (
                      <>
                        <button
                          onClick={(e) => handleUndoClick(entry, e)}
                          disabled={!entry.undoData || undoInProgress === entry.id}
                          className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded border border-red-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {undoInProgress === entry.id ? "Undoing..." : "↩ Undo This Action"}
                        </button>
                        {!entry.undoData && (
                          <p className="text-xs text-gray-400 mt-1">
                            (Undo not available — entry was created before this feature)
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={() => setVisibleCount((prev) => prev + 20)}
        className="m-2 px-4 py-1 text-black hover:!bg-blue-300 border outline-1 outline-blue-500 rounded"
      >
        Show More
      </button>

      {/* Worker Switch Modal for Reassignment */}
      {showWorkerSwitch && (
        <WorkerSwitchModal
          currentWorker={nameOfWorker}
          onWorkerSwitch={handleWorkerSwitchForReassign}
          onCancel={handleCancelReassign}
        />
      )}
    </div>
  );
}

export default Log;