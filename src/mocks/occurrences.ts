export interface OccurrenceItem {
  id: string;
  title: string;
  time: string;
  location: string;
  description: string;
}

export const MOCK_OCCURRENCES: OccurrenceItem[] = [
  {
    id: "1",
    title: "Chuva intensa",
    time: "14:20",
    location: "Área externa",
    description:
      "Interrupção dos trabalhos exteriores durante aproximadamente 1 hora.",
  },
  {
    id: "2",
    title: "Atraso na entrega de material",
    time: "10:30",
    location: "Frente B",
    description:
      "A entrega do cimento prevista para a manhã ocorreu às 14h.",
  },
];

export type ImpactOption = "sem_impacto" | "impacto_baixo" | "impacto_relevante" | "paralisacao";

export const IMPACT_OPTIONS: { value: ImpactOption; label: string }[] = [
  { value: "sem_impacto", label: "Sem impacto" },
  { value: "impacto_baixo", label: "Impacto baixo" },
  { value: "impacto_relevante", label: "Impacto relevante" },
  { value: "paralisacao", label: "Paralisação" },
];

export interface OccurrenceData {
  title: string;
  time: string;
  location: string;
  description: string;
  impact: ImpactOption;
}

export const MOCK_OCCURRENCES_DATA: Record<string, OccurrenceData> = {};
