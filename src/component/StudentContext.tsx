import { createContext, useState, type ReactNode } from "react";

// Context type

interface StudentContextType {
  studentId: string | null;
  setStudentId: (id: string | null) => void;
}
interface DataContextType {
  messages: string | any;
  setmessages: (id: string[] | any) => void;
}
// Create context
export const StudentContext = createContext<StudentContextType | null>(null);
export const DataContext = createContext<DataContextType | null>(null);

// Provider
export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [studentId, setStudentId] = useState<string | null>(null);

  return (
    <StudentContext.Provider value={{ studentId, setStudentId }}>
      {children}
    </StudentContext.Provider>
  );
};
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setmessages] = useState<string | null>(null);

  return (
    <DataContext.Provider value={{ messages, setmessages }}>
      {children}
    </DataContext.Provider>
  );
};
