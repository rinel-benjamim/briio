import { createContext, useContext, useState, type ReactNode } from "react";
import { MOCK_RDO_CONTEXT } from "@/mocks";

interface RdoContextData {
  rdoId: string | null;
  projectId: string | null;
  projectName: string;
  date: string;
  setRdoId: (id: string | null) => void;
  setProjectId: (id: string | null) => void;
}

const RdoContext = createContext<RdoContextData>({
  rdoId: null,
  projectId: null,
  projectName: MOCK_RDO_CONTEXT.projectName,
  date: MOCK_RDO_CONTEXT.date,
  setRdoId: () => {},
  setProjectId: () => {},
});

export function RdoProvider({ children }: { children: ReactNode }) {
  const [rdoId, setRdoId] = useState<string | null>("1");
  const [projectId, setProjectId] = useState<string | null>("1");

  return (
    <RdoContext.Provider
      value={{
        rdoId,
        projectId,
        projectName: MOCK_RDO_CONTEXT.projectName,
        date: MOCK_RDO_CONTEXT.date,
        setRdoId,
        setProjectId,
      }}
    >
      {children}
    </RdoContext.Provider>
  );
}

export function useRdo() {
  const context = useContext(RdoContext);
  if (!context) {
    throw new Error("useRdo must be used within a RdoProvider");
  }
  return context;
}
