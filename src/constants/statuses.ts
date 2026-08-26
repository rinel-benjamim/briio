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
    dotColor: "#176B50",
    bgColor: "#DDF5E9",
    textColor: "#176B50",
  },
  completed: {
    label: "Concluído",
    dotColor: "#687770",
    bgColor: "#F5F7F6",
    textColor: "#687770",
  },
  archived: {
    label: "Arquivada",
    dotColor: "#E69B2D",
    bgColor: "#FFF2D8",
    textColor: "#E69B2D",
  },
};

export const PROJECT_STATUS_CONFIG_UPPERCASE: Record<ProjectStatus, StatusConfig> = {
  active: {
    label: "ATIVA",
    dotColor: "#176B50",
    bgColor: "#DDF5E9",
    textColor: "#176B50",
  },
  completed: {
    label: "CONCLUÍDA",
    dotColor: "#687770",
    bgColor: "#F5F7F6",
    textColor: "#687770",
  },
  archived: {
    label: "ARQUIVADA",
    dotColor: "#E69B2D",
    bgColor: "#FFF2D8",
    textColor: "#E69B2D",
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
    bgColor: "#FFF2D8",
    textColor: "#E69B2D",
  },
  generated: {
    label: "Gerado",
    bgColor: "#DDF5E9",
    textColor: "#176B50",
  },
};
