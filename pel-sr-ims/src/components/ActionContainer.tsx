import { useState } from "react";
import type { MovementType, SubmittedAction } from "../utils/types";
import Action from "./Action";
import { updateInventoryFromActions } from "../utils/inventoryService";

function ActionContainer() {
  const [actionList, setActionList] = useState<SubmittedAction[]>([]);

  const createNewAction = () => {
    const newAction: SubmittedAction = {
      subject: null,
      level: "",
      movementMap: {},
      movementNumOfCopiesMap: {},
      selectedSubsections: [],
    };

    setActionList((prev) => [...prev, newAction]);
  };

  const handleActionChange = (index: number, updatedAction: SubmittedAction) => {
    setActionList((prev) =>
      prev.map((action, i) => (i === index ? updatedAction : action))
    );
  };

  const removeAction = (index: number) => {
    setActionList((prev) => prev.filter((_, i) => i !== index));
  };

  const submitAllActions = async () => {
    // Filter out incomplete actions
    const completeActions = actionList.filter(action => 
      action.subject && 
      action.level && 
      action.selectedSubsections.length > 0 &&
      Object.keys(action.movementMap).length > 0 &&
      Object.keys(action.movementNumOfCopiesMap).length > 0
    );

    if (completeActions.length === 0) {
      return;
    }

    try {
      // Submit to database
      await updateInventoryFromActions(completeActions);
      
      // Clear the action list after successful submission
      setActionList([]);
    } catch (error) {
      console.error("Error submitting actions:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Inventory Management Actions</h2>
        {actionList.length === 0 && (
          <p className="text-gray-500">No actions created yet. Click "Create New Action" to start.</p>
        )}
      </div>

      {actionList.map((action, index) => (
        <div key={index} className="relative">
          <Action
            index={index}
            data={action}
            onChange={(updatedAction) => handleActionChange(index, updatedAction)}
          />
          {actionList.length > 1 && (
            <button
              onClick={() => removeAction(index)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <div className="flex gap-4 pt-4 border-t">
        <button
          onClick={createNewAction}
          className="border outline-1 outline-blue-500 rounded bg-blue-200 px-4 py-2 hover:bg-blue-300"
        >
          Create New Action
        </button>
        
        {actionList.length > 0 && (
          <button
            onClick={submitAllActions}
            className="border outline-1 outline-green-500 rounded bg-green-200 px-4 py-2 hover:bg-green-300"
          >
            Submit All Actions
          </button>
        )}
        
        {actionList.length > 0 && (
          <button
            onClick={() => setActionList([])}
            className="border outline-1 outline-red-500 rounded bg-red-200 px-4 py-2 hover:bg-red-300"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}

export default ActionContainer;
  
  // import { useState } from "react";
  // import type { MovementType, SubmittedAction } from "../utils/types";
  // import Action from "./Action";
  // import { ActionProvider } from "./ActionContext";

  // function ActionContainer() {
  //   const [actionList, setActionList] = useState<SubmittedAction[]>(
  //     [] as SubmittedAction[]
  //   );

  //   /*
  //         export interface SubmittedAction {
  //         subject: "Math" | "English" | null;
  //         level: string;
  //         movementMap: Record<string, MovementType>;
  //         movementNumOfCopiesMap: Record<string, number>;
  //         selectedSubsections: string[];
  //         }
  //     */
  //   const createNewAction = () => {
  //     const newAction = {
  //       subject: null as "Math" | "English" | null,
  //       level: "" as string,
  //       movementMap: {} as Record<string, MovementType>,
  //       movementNumOfCopiesMap: { "": 0 } as Record<string, number>,
  //       selectedSubsections: [] as string[],
  //     };

  //     setActionList((prev) => [...prev, newAction]);
  //   };

  //   return (
  //     <div className="space-y-4">
  //       {actionList.map((action: SubmittedAction, index) => (
  //     <Action
  //       key={index}
  //       index={index}
  //       data={action}
  //       onChange={(updatedAction) => {
  //       setActionList((prev) =>
  //           prev.map((a, i) => (i === index ? updatedAction : a))
  //       );
  //     }}
  //   />
  // ))}

  //       <button
  //         onClick={() => createNewAction()}
  //         className="border outline-1 outline-blue-500 rounded mt-3 bg-blue-200"
  //       >
  //         Create New
  //       </button>
  //       {/* <button onClick={() => createNewAction()}>Submit All</button> */}
  //     </div>
  //   );
  // }

  // export default ActionContainer;
