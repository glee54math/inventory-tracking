import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Student } from "../../utils/types";

interface StudentContextType {
  currentStudent: Student | null;
  setCurrentStudent: React.Dispatch<React.SetStateAction<Student | null>>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) throw new Error("useStudentContext must be used within a StudentProvider");
  return context;
};

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  return (
    <StudentContext.Provider value={{ currentStudent, setCurrentStudent }}>
      {children}
    </StudentContext.Provider>
  );
};
