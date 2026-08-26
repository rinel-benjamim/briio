export interface MaterialItem {
  id: string;
  name: string;
  quantity: string;
}

export const MOCK_MATERIALS_SUMMARY = {
  records: 3,
  totalItems: 12,
};

export const MOCK_MATERIALS_LIST: MaterialItem[] = [
  { id: "1", name: "Cimento Portland 42.5", quantity: "50 sacos" },
  { id: "2", name: "Areia média", quantity: "8 m³" },
  { id: "3", name: "Bloco de cimento", quantity: "500 un." },
];

export const MOCK_MATERIALS_OPTIONS = [
  "Cimento Portland 42.5",
  "Areia média",
  "Bloco de cimento",
  "Brita 1",
  "Brita 2",
  "Ferro de construção",
  "Outro",
];

export const MOCK_UNITS = ["sacos", "m³", "un.", "kg", "L", "m"];

export type MaterialStatusOption = "recebido" | "utilizado" | "em_falta" | "em_transito";

export const MATERIAL_STATUS_OPTIONS: { value: MaterialStatusOption; label: string }[] = [
  { value: "recebido", label: "Recebido" },
  { value: "utilizado", label: "Utilizado" },
  { value: "em_falta", label: "Em falta" },
  { value: "em_transito", label: "Em trânsito" },
];

export const MATERIAL_STATUS_LABELS: Record<MaterialStatusOption, string> = {
  recebido: "Recebido",
  utilizado: "Utilizado",
  em_falta: "Em falta",
  em_transito: "Em trânsito",
};

export const MOCK_MATERIALS_DATA: Record<string, { material: string; quantity: number; unit: string; status: MaterialStatusOption; observation: string }> = {};
