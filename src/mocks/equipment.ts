export interface EquipmentItem {
  id: string;
  name: string;
  units: number;
  hours: number;
}

export const MOCK_EQUIPMENT_SUMMARY = {
  equipmentCount: 3,
  totalHours: 25,
};

export const MOCK_EQUIPMENT: EquipmentItem[] = [
  { id: "1", name: "Retroescavadora", units: 1, hours: 8 },
  { id: "2", name: "Betoneira", units: 2, hours: 6 },
  { id: "3", name: "Camião basculante", units: 3, hours: 7 },
];

export const MOCK_EQUIPMENT_OPTIONS = [
  "Retroescavadora",
  "Betoneira",
  "Camião basculante",
  "Empilhadeira",
  "Guindaste",
  "Compressor",
  "Outro",
];

export type EquipmentStatusOption = "em_operacao" | "parado" | "em_manutencao" | "indisponivel";

export const EQUIPMENT_STATUS_OPTIONS: { value: EquipmentStatusOption; label: string }[] = [
  { value: "em_operacao", label: "Em operação" },
  { value: "parado", label: "Parado" },
  { value: "em_manutencao", label: "Em manutenção" },
  { value: "indisponivel", label: "Indisponível" },
];

export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatusOption, string> = {
  em_operacao: "Em operação",
  parado: "Parado",
  em_manutencao: "Em manutenção",
  indisponivel: "Indisponível",
};

export const MOCK_EQUIPMENT_DATA: Record<string, { equipment: string; quantity: number; hours: number; status: EquipmentStatusOption; observation: string }> = {};
