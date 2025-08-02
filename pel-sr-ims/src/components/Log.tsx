import { useEffect, useState } from "react";
// import { loadLog } from "../utils/inventoryService";
import type { LogEntry } from "../utils/types";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../utils/firebase";

function Log() {
  const [actionLog, setActionLog] = useState<LogEntry[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  // const visibleLogs = actionLog.slice(0, visibleCount);

  useEffect(() => {
    const fetchLogs = async () => {
      const logsQuery = query(
        collection(db,"logs"),
        orderBy("timeStamp", "desc"),
        limit(visibleCount)
      );

      const snapshot = await getDocs(logsQuery);
      const newLogs: LogEntry[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const logEntry: LogEntry = {
          timeStamp: data.timeStamp.toDate(), // convert Firestore Timestamp to JS Date
          userID: data.userID,
          eventType: data.eventType,
          message: data.message,
        };
        newLogs.push(logEntry);
      });
      // Sort newest first (optional)
      // newLogs.sort((a, b) => b.timeStamp.getTime() - a.timeStamp.getTime());
      setActionLog(newLogs);
    };
    
    fetchLogs();
  }, [visibleCount]);

  return (
    <div className="overflow-auto">
      {actionLog.map((entry, index) => (
        <p key={entry.eventType + index}>
          {index + 1 + ")   " + entry.timeStamp.toLocaleDateString() + " " + entry.timeStamp.toLocaleTimeString() + "  |  " + entry.message}
        </p>
      ))}

      {(
        <button
          onClick={() => setVisibleCount((prev) => prev + 20)}
          className="mt-2 px-4 py-1 text-black rounded"
        >
          Show More
        </button>
      )}
    </div>
  );
}

export default Log;
