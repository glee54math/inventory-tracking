import { useEffect, useState } from "react";
// import { loadLog } from "../utils/inventoryService";
import type { LogEntry } from "../utils/types";
import { collection, getDocs, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";

function Log() {
  const [actionLog, setActionLog] = useState<LogEntry[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  // const visibleLogs = actionLog.slice(0, visibleCount);

  useEffect(() => {
    const logsQuery = query(
      collection(db,"logs"),
      orderBy("timeStamp","desc"),
      limit(visibleCount)
    );

    const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
      const newLogs: LogEntry[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        newLogs.push({
          timeStamp: data.timeStamp.toDate(), // convert Firestore Timestamp to JS Date
          userID: data.userID,
          eventType: data.eventType,
          message: data.message,
        });
      });
      setActionLog(newLogs);
    });

    return () => unsubscribe();
  }, [visibleCount]);

  return (
    <div className="mx-2 overflow-auto">
      {actionLog.map((entry, index) => (
        <pre
          key={entry.eventType + index}
          className="mx-2"
        >
          {index + 1 + ")  " + entry.timeStamp.toLocaleDateString() + " " + entry.timeStamp.toLocaleTimeString() + "  |  " + entry.message}
        </pre>
      ))}

      {(
        <button
          onClick={() => setVisibleCount((prev) => prev + 20)}
          className="m-2 px-4 py-1 text-black hover:!bg-blue-300 border outline-1 outline-blue-500 rounded"
        >
          Show More
        </button>
      )}
    </div>
  );
}

export default Log;
