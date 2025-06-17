import { useActionContext } from "./ActionContext";

function Action() {

    const {
        subject,
        level,
        selectedSubsections,
        movementMap,
        movementNumOfCopiesMap,
        setSubject,
        setLevel,
        setSelectedSubsections,
        setMovementMap,
        setMovementNumOfCopiesMap,
    } = useActionContext();

    return (
        <div>
            <h2>This is where Action will go.</h2>
            {subject}
        </div>
    )
}

export default Action;