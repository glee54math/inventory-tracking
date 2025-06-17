import { useActionContext } from "./ActionContext";

function Log() {
    const {
        subject,
        level,
        selectedSubsections,
        movementMap,
        movementNumOfCopiesMap,
    } = useActionContext();

    return (
        <div>
            <h2>Log will go here</h2>
            {level}
        </div>
    )
}

export default Log;