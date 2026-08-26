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
    dotColor: "#16A34A",
    bgColor: "#DCFCE7",
    textColor: "#15803D",
  },
  completed: {
    label: "Concluído",
    dotColor: "#9CA3AF",
    bgColor: "#F3F4F6",
    textColor: "#6B7280",
  },
  archived: {
    label: "Arquivada",
    dotColor: "#F59E0B",
    bgColor: "#FEF3C7",
    textColor: "#D97706",
  },
};

export const PROJECT_STATUS_CONFIG_UPPERCASE: Record<ProjectStatus, StatusConfig> = {
  active: {
    label: "ATIVA",
    dotColor: "#16A34A",
    bgColor: "#DCFCE7",
    textColor: "#15803D",
  },
  completed: {
    label: "CONCLUÍDA",
    dotColor: "#9CA3AF",
    bgColor: "#F3F4F6",
    textColor: "#6B7280",
  },
  archived: {
    label: "ARQUIVADA",
    dotColor: "#F59E0B",
    bgColor: "#FEF3C7",
    textColor: "#D97706",
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
    bgColor: "rgba(245, 158, 11, 0.12)",
    textColor: "#F59E0B",
  },
  generated: {
    label: "Gerado",
    bgColor: "rgba(16, 185, 129, 0.12)",
    textColor: "#10B981",
  },
};
