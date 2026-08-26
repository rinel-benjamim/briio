import type { ProjectStatus } from "@/types";

export interface StatusConfig {
  label: string;
  dotColor: string;
  bgColor: string;
  textColor: string;
}

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, StatusConfig> = {
  active: {
    label: "Em andamento",
    dotColor: "#137333",
    bgColor: "#E6F4EA",
    textColor: "#134E32",
  },
  completed: {
    label: "Concluído",
    dotColor: "#5B6E63",
    bgColor: "#F4F6F4",
    textColor: "#5B6E63",
  },
  archived: {
    label: "Arquivada",
    dotColor: "#B96A00",
    bgColor: "#FFF8F0",
    textColor: "#B96A00",
  },
};

export const PROJECT_STATUS_CONFIG_UPPERCASE: Record<ProjectStatus, StatusConfig> = {
  active: {
    label: "ATIVA",
    dotColor: "#137333",
    bgColor: "#E6F4EA",
    textColor: "#134E32",
  },
  completed: {
    label: "CONCLUÍDA",
    dotColor: "#5B6E63",
    bgColor: "#F4F6F4",
    textColor: "#5B6E63",
  },
  archived: {
    label: "ARQUIVADA",
    dotColor: "#B96A00",
    bgColor: "#FFF8F0",
    textColor: "#B96A00",
  },
};

export type RdoStatus = "draft" | "generated";

export interface RdoStatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
}

export const RDO_STATUS_CONFIG: Record<RdoStatus, RdoStatusConfig> = {
  draft: {
    label: "Rascunho",
    bgColor: "#FFF8F0",
    textColor: "#B96A00",
  },
  generated: {
    label: "Gerado",
    bgColor: "#E6F4EA",
    textColor: "#137333",
  },
};
