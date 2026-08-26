export interface RdoSectionItem {
  id: string;
  name: string;
  summary: string;
  completed?: boolean;
}

export interface RdoSectionWithRoute extends RdoSectionItem {
  route: string;
}

export const RDO_SECTIONS: RdoSectionItem[] = [
  { id: "1", name: "Condições do dia", summary: "Manhã · Tarde · Noite", completed: true },
  { id: "2", name: "Mão de obra", summary: "7 trabalhadores · 8h", completed: true },
  { id: "3", name: "Materiais", summary: "3 registos", completed: true },
  { id: "4", name: "Equipamentos", summary: "2 registos", completed: true },
  { id: "5", name: "Tarefas", summary: "2 tarefas", completed: true },
  { id: "6", name: "Ocorrências", summary: "2 ocorrências", completed: true },
  { id: "7", name: "Observações", summary: "Preenchido", completed: true },
  { id: "8", name: "Fotografias", summary: "6 fotografias", completed: true },
];

export const RDO_SECTIONS_WITH_ROUTES: RdoSectionWithRoute[] = [
  { id: "1", name: "Condições do dia", summary: "Manhã · Tarde · Noite", route: "weather" },
  { id: "2", name: "Mão de obra", summary: "7 trabalhadores · 8h", route: "workforce" },
  { id: "3", name: "Materiais", summary: "3 registos", route: "materials" },
  { id: "4", name: "Equipamentos", summary: "2 registos", route: "equipment" },
  { id: "5", name: "Tarefas", summary: "2 tarefas", route: "tasks" },
  { id: "6", name: "Ocorrências", summary: "2 ocorrências", route: "occurrences" },
  { id: "7", name: "Observações", summary: "Preenchido", route: "observations" },
  { id: "8", name: "Fotografias", summary: "6 fotografias", route: "photos" },
];

export const SECTION_ROUTES: Record<string, string> = {
  "1": "weather",
  "2": "workforce",
  "3": "materials",
  "4": "equipment",
  "5": "tasks",
  "6": "occurrences",
  "7": "observations",
  "8": "photos",
};
