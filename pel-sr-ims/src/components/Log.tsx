import { useEffect, useState } from "react";
import { loadLog } from "../utils/inventoryService";
import type { LogEntry } from "../utils/types";

function Log() {
  const [actionLog, setActionLog] = useState<LogEntry[]>([]);

  useEffect(() => {
    const load = async () => {
      const logsFromDB = await loadLog();

      // Convert Firestore.Timestamp to JS Date
      const processed = Object.values(logsFromDB).map((entry) => ({
        ...entry,
        timeStamp: entry.timeStamp.toDate() ?? entry.timeStamp, // fallback if already Date
      }));

      setActionLog(processed);
    };
    load();
  }, []);

  return (
    <div className="overflow-auto">
      {actionLog.map((entry, index) => (
        <p key={entry.eventType + index}>
          {index + 1 + ") " + entry.timeStamp + " | " + entry.message}
        </p>
      ))}
    </div>
  );
}

export default Log;
