import { useActionContext } from "./ActionContext";

function Log() {
  const { submittedActions } = useActionContext();
  return (
    <div>
      {submittedActions.map((action, index) => (
        <div key={index}>
          {action.selectedSubsections.map((range: string) => (
            <pre key={range}>
              {action.level} {range}: {action.movementMap[range]} -{" "}
              {action.movementNumOfCopiesMap[range]} copies.
            </pre>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Log;
