export interface WorkforceItem {
  id: string;
  role: string;
  people: number;
  hoursPerPerson: number;
  totalHours: number;
}

export const MOCK_WORKFORCE_SUMMARY = {
  workers: 7,
  totalHours: 56,
};

export const MOCK_WORKFORCE: WorkforceItem[] = [
  { id: "1", role: "Mestre de Obras", people: 2, hoursPerPerson: 8, totalHours: 16 },
  { id: "2", role: "Serventes", people: 5, hoursPerPerson: 8, totalHours: 40 },
];

export const MOCK_ROLES = [
  "Mestre de Obras",
  "Servente",
  "Pedreiro",
  "Eletricista",
  "Canalizador",
  "Operador de Máquinas",
  "Outro",
];

export const MOCK_WORKFORCE_DATA: Record<string, { role: string; people: number; hoursPerPerson: number; observation: string }> = {
  "1": { role: "Mestre de Obras", people: 2, hoursPerPerson: 8, observation: "" },
  "2": { role: "Serventes", people: 5, hoursPerPerson: 8, observation: "" },
};
