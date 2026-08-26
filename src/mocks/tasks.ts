export interface ActivityItem {
  id: string;
  name: string;
  location: string;
  quantity: string;
  status: string;
}

export const MOCK_TASKS_SUMMARY = {
  activities: 2,
};

export const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: "1", name: "Execução de alvenaria", location: "Piso 2 — Bloco A", quantity: "120 m²", status: "em_curso" },
  { id: "2", name: "Assentamento de revestimento", location: "Piso 1 — Bloco B", quantity: "85 m²", status: "concluido" },
];

export const MOCK_TASK_UNITS = ["m²", "m³", "un.", "kg", "L", "m", "sacos"];

export type TaskStatusOption = "em_execucao" | "concluida" | "paralisada";

export const TASK_STATUS_OPTIONS: { value: TaskStatusOption; label: string }[] = [
  { value: "em_execucao", label: "Em execução" },
  { value: "concluida", label: "Concluída" },
  { value: "paralisada", label: "Paralisada" },
];

export const TASK_STATUS_LABELS: Record<TaskStatusOption, string> = {
  em_execucao: "Em execução",
  concluida: "Concluída",
  paralisada: "Paralisada",
};

export const TASK_SCREEN_STATUS_LABELS: Record<string, { label: string; color: string; bgColor: string }> = {
  em_curso: { label: "Em curso", color: "#B96A00", bgColor: "#FFF8F0" },
  concluido: { label: "Concluído", color: "#137333", bgColor: "#E6F4EA" },
};

export const MOCK_TASKS_DATA: Record<string, { description: string; location: string; quantity: number; unit: string; status: TaskStatusOption; observation: string; progress: number }> = {};
