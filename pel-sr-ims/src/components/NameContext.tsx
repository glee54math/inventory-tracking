import React, { createContext, useContext, useState} from "react";
import type { ReactNode } from "react";

interface NameContextType {
    nameOfWorker: string;
    setNameOfWorker: React.Dispatch<React.SetStateAction<string>>;
}

const NameContext = createContext<NameContextType | undefined>(undefined);

export const useNameContext = () => {
    const context = useContext(NameContext);
    if (!context)
        throw new Error("useNameContext must be used within a Provider");
    return context;
}

export const NameProvider = ({ children }: { children: ReactNode }) => {
    const [nameOfWorker, setNameOfWorker] = useState<string>("");

    return (
        <NameContext.Provider
            value={{
                nameOfWorker,
                setNameOfWorker,
            }}
        >
            {children}
        </NameContext.Provider>
    );
};