import { useEffect, useState } from "react";
import { loadLog } from "../utils/inventoryService";
import type { LogEntry } from "../utils/types";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";

function Log() {
  const [actionLog, setActionLog] = useState<LogEntry[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const visibleLogs = actionLog.slice(0, visibleCount);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "logs"), (snapshot) => {
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
      newLogs.sort((a, b) => b.timeStamp.getTime() - a.timeStamp.getTime());
      setActionLog(newLogs);
    });
    return () => unsubscribe();
    // const load = async () => {
    //   const logsFromDB = await loadLog();

    //   // Convert Firestore.Timestamp to JS Date
    //   const processed = Object.values(logsFromDB).map((entry) => ({
    //     ...entry,
    //     timeStamp: entry.timeStamp.toDate() ?? entry.timeStamp, // fallback if already Date
    //   }));

    //   setActionLog(processed);
    // };
    // load();
  }, []);

  return (
    <div className="overflow-auto">
      {visibleLogs.map((entry, index) => (
        <p key={entry.eventType + index}>
          {index + 1 + ") " + entry.timeStamp + " | " + entry.message}
        </p>

        
      ))}

      {visibleCount < actionLog.length && (
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