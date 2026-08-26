import type { ProjectOption } from "@/components/rdo/ProjectSelector";

export const PROJECTS: ProjectOption[] = [
  {
    id: "1",
    name: "Reabilitação Pedrinhas",
    location: "Zango 1 — Icolo e Bengo",
  },
  {
    id: "2",
    name: "Reestruturação Predial",
    location: "Luanda — Petrangol",
  },
];

export interface MockProject {
  id: string;
  name: string;
  location: string;
}

export const MOCK_PROJECTS: MockProject[] = [
  { id: "1", name: "Reabilitação Pedrinhas", location: "Zango 1 — Icolo e Bengo" },
  { id: "2", name: "Construção Residencial Kilamba", location: "Kilamba — Luanda" },
  { id: "3", name: "Edifício Comercial Talatona", location: "Talatona — Luanda" },
  { id: "4", name: "Ponte sobre o Rio Kwanza", location: "Viana — Luanda" },
];

export const MOCK_PROJECT_DETAIL = {
  id: "1",
  name: "Reabilitação Pedrinhas",
  location: "Zango 1 — Icolo e Bengo",
  status: "active" as const,
  responsible: "Kiali Rodrigues",
  contractType: "Construção",
  startDate: "09 Fev 2026",
  deadline: "Maio 2026",
};

export const MOCK_PROJECT_INFO = {
  name: "Reabilitação Pedrinhas",
  status: "Em execução",
  location: "Zango 1 — Icolo e Bengo",
  startDate: "03 Jun 2026",
  endDate: "30 Nov 2026",
  responsible: "Kiali Rodrigues",
  client: "Nome do cliente",
  contractor: "Nome da empresa",
  inspector: "Nome da entidade / responsável",
  reference: "OBR-2026-032",
};

export const MOCK_PROJECT_EDIT = {
  name: "Reabilitação Pedrinhas",
  reference: "OBR-2026-032",
  location: "Zango 1 — Icolo e Bengo",
  province: "Icolo e Bengo",
  startDate: new Date(2026, 5, 3),
  endDate: new Date(2026, 10, 30),
  responsible: "Kiali Rodrigues",
  client: "Nome do cliente",
  contractor: "Nome da empresa",
  inspector: "Nome da entidade / responsável",
};

export const MOCK_PROJECT_CREATED = {
  name: "Reabilitação Pedrinhas",
  location: "Zango 1 — Icolo e Bengo",
  status: "Em execução",
};

export const MOCK_CONFIGURE_RDO = {
  name: "Reabilitação Pedrinhas",
};

export const PROVINCES = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando-Cubango",
  "Cuanza Norte", "Cuanza Sul", "Cunene", "Huambo", "Huíla",
  "Icolo e Bengo", "Luanda", "Lunda Norte", "Lunda Sul",
  "Malanje", "Moxico", "Namibe", "Uíge", "Zaire",
];
