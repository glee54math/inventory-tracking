import React, { createContext, useContext, useState, ReactNode } from "react";

type MovementType =
  | "BackToFront"
  | "BackToStudent"
  | "FrontToBack"
  | "FrontToStudent"
  | "ShipmentToBack"
  | "ShipmentToFront";

interface ActionContextType {
  subject: "Math" | "English" | null;
  level: string;
  selectedSubsections: string[];
  movementMap: Record<string, MovementType>;
  movementNumOfCopiesMap: Record<string, number>;
  setSubject: React.Dispatch<React.SetStateAction<"Math" | "English" | null>>;
  setLevel: React.Dispatch<React.SetStateAction<string>>;
  setSelectedSubsections: React.Dispatch<React.SetStateAction<string[]>>;
  setMovementMap: React.Dispatch<
    React.SetStateAction<Record<string, MovementType>>
  >;
  setMovementNumOfCopiesMap: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
}

const ActionContext = createContext<ActionContextType | undefined>(undefined);

export const useActionContext = () => {
  const context = useContext(ActionContext);
  if (!context) throw new Error("useActionContext must be used within a Provider");
  return context;
};

export const ActionProvider = ({ children }: { children: ReactNode }) => {
  const [subject, setSubject] = useState<"Math" | "English" | null>(null);
  const [level, setLevel] = useState<string>("");
  const [selectedSubsections, setSelectedSubsections] = useState<string[]>([]);
  const [movementMap, setMovementMap] = useState<Record<string, MovementType>>({});
  const [movementNumOfCopiesMap, setMovementNumOfCopiesMap] = useState<Record<string, number>>({});

  return (
    <ActionContext.Provider
      value={{
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
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};
