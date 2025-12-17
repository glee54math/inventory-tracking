import { useEffect, useState } from "react";
// import { loadLog } from "../utils/inventoryService";
import type { LogEntry } from "../utils/types";
import { collection, getDocs, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebase";

function Log() {
  const [actionLog, setActionLog] = useState<LogEntry[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  // const visibleLogs = actionLog.slice(0, visibleCount);
  const [logActionPressed, setLogActionPressed] = useState<boolean[]>([])

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
        setLogActionPressed((prev) => [...prev, false]);
      });
      setActionLog(newLogs);
      
    });

    return () => unsubscribe();
  }, [visibleCount]);

  const deleteLogAction = (action: LogEntry, index: number) => {
    console.log(actionLog[index]);  // This is the correct LogEntry
    // Give option to delete action. <-- not done within this method.
    // This means that it will delete from database, so that the Log will update.
    // Undoes the action and updates the database values
  }

  return (
    <div className="mx-2 overflow-auto">
      {actionLog.map((entry, index) => (
        <button
          key={entry.eventType + index}
          onClick={() => {
            const newArray = [...logActionPressed];
            newArray[index] = !newArray[index];
            setLogActionPressed(newArray);
            deleteLogAction(entry, index)
          }}
          className="m-1 p-1 text-left text-black hover:!bg-blue-300 border outline-1 outline-blue-500 rounded"
        >
          {index + 1 + ")  " + entry.timeStamp.toLocaleDateString() + " " + entry.timeStamp.toLocaleTimeString() + "  |  " + entry.message}
        </button>
      ))}
      {/* if pressed */}
      
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
