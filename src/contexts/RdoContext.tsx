import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRdoRepository } from "@/repositories/rdo.repository";
import { useProjectRepository } from "@/repositories/project.repository";

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
  projectName: "",
  date: "",
  setRdoId: () => {},
  setProjectId: () => {},
});

function formatReportDate(isoDate: string): string {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const d = new Date(isoDate + "T00:00:00");
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function RdoProvider({ children }: { children: ReactNode }) {
  const [rdoId, setRdoId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [date, setDate] = useState("");

  const rdoRepo = useRdoRepository();
  const projectRepo = useProjectRepository();

  useEffect(() => {
    async function load() {
      if (rdoId) {
        const rdo = await rdoRepo.findById(rdoId);
        if (rdo) {
          setDate(formatReportDate(rdo.report_date));
          if (!projectId) setProjectId(rdo.project_id);
        }
      }
      if (projectId) {
        const project = await projectRepo.findById(projectId);
        if (project) setProjectName(project.name);
      }
    }
    load();
  }, [rdoId, projectId]);

  return (
    <RdoContext.Provider
      value={{
        rdoId,
        projectId,
        projectName,
        date,
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
