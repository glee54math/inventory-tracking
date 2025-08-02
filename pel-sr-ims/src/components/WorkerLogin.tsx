import { useEffect, useState } from "react";
import { loadWorkersFromDB } from "../utils/inventoryService";
import type { Worker } from "../utils/types";
import { useNameContext } from "./NameContext";


// interface WorkerLoginProps {
//   nameOfWorker: string;
//   setNameOfWorker: React.Dispatch<React.SetStateAction<string>>;
// }

export default function WorkerLogin() {
  const {setNameOfWorker} = useNameContext();
  const [workersList, setWorkersList] = useState<Worker[]>([]);

  useEffect(() => {
    const settingWorkersList = async () => {
      const temp: Worker[] = await loadWorkersFromDB();
      setWorkersList(temp);
    };
    settingWorkersList();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br bg-blue-400 flex flex-col justify-start items-center pt-76">
      <h1 className="text-white text-4xl font-extrabold mb-20 drop-shadow-lg">
        PEL Worker Login
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
        <select
          id="name-of-worker"
          onChange={(e) => setNameOfWorker(e.target.value)}
          className="
            w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800
            text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500
            focus:border-indigo-500 appearance-none bg-white cursor-pointer
          "
        >
          <option value={""}>Select Worker</option>
          <option value={"Mr. Lee"}>Mr. Lee</option>
          {workersList.map((worker: Worker) => (
            <option value={worker.initials}>
              {worker.firstName + " " + worker.lastName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
