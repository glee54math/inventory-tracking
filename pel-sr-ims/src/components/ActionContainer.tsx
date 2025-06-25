import { useState } from "react";
import type { MovementType, SubmittedAction } from "../utils/types";
import Action from "./Action";
import { ActionProvider } from "./ActionContext";

function ActionContainer() {
  const [actionList, setActionList] = useState<SubmittedAction[]>(
    [] as SubmittedAction[]
  );

  /*
        export interface SubmittedAction {
        subject: "Math" | "English" | null;
        level: string;
        movementMap: Record<string, MovementType>;
        movementNumOfCopiesMap: Record<string, number>;
        selectedSubsections: string[];
        }
    */
  const createNewAction = () => {
    const newAction = {
      subject: null as "Math" | "English" | null,
      level: "" as string,
      movementMap: {} as Record<string, MovementType>,
      movementNumOfCopiesMap: { "": 0 } as Record<string, number>,
      selectedSubsections: [] as string[],
    };

    setActionList((prev) => [...prev, newAction]);
  };

  return (
    <div className="space-y-4">
      {actionList.map((action: SubmittedAction, index) => (
        <ActionProvider key={index}>
          <Action />
        </ActionProvider>
          // onChange={(updatedAction: SubmittedAction) => {
          //     setActionList((prev) => prev.map((a,i) => (i === index ? updatedAction : a)))
          // }}
      ))}
      <button
        onClick={() => createNewAction()}
        className="border outline-1 outline-blue-500 rounded mt-1 bg-blue-200"
      >
        Create New
      </button>
      {/* <button onClick={() => createNewAction()}>Submit All</button> */}
    </div>
  );
}

export default ActionContainer;
