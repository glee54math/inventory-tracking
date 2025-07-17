import { useState } from "react";
import {loadWorkersFromDB } from "../utils/inventoryService"
import type { Worker } from "../utils/types";

interface WorkerLoginProps {
    nameOfWorker: string;
    setNameOfWorker: React.Dispatch<React.SetStateAction<string>>;
}

export default function WorkerLogin({
    nameOfWorker,
    setNameOfWorker
}:WorkerLoginProps) {
    // const [nameOfWorker, setNameOfWorker] = useState<string>("");
    const [workersList, setWorkersList] = useState<Worker[]>(Object.values(loadWorkersFromDB));

    return (
      <div>
        <select
            id="name-of-worker"
            onChange={(e) => setNameOfWorker(e.target.value)}
            className="border border-black-200 rounded"
        >
            <option value={""}>Select Worker</option>
            <option 
                value={"Mr. Lee"}
            >Mr. Lee</option>
            {workersList.map((worker:Worker) => (
                <option value={worker.initials}>{worker.firstName +" "+ worker.lastName}</option>
            ))
            
            }
        </select>

      </div>  
    );
}