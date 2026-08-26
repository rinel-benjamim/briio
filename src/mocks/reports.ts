export interface ReportItem {
  id: string;
  number: string;
  projectName: string;
  date: string;
  status: "draft" | "generated";
  summary: string;
}

export const MOCK_REPORTS: ReportItem[] = [
  {
    id: "1",
    number: "RDO #024",
    projectName: "Construção Residencial Kilamba",
    date: "20 Ago 2026",
    status: "generated",
    summary: "12 trabalhadores · 4 atividades · 6 fotografias",
  },
  {
    id: "2",
    number: "RDO #023",
    projectName: "Construção Residencial Kilamba",
    date: "19 Ago 2026",
    status: "generated",
    summary: "11 trabalhadores · 5 atividades · 8 fotografias",
  },
  {
    id: "3",
    number: "RDO #022",
    projectName: "Edifício Comercial Talatona",
    date: "18 Ago 2026",
    status: "draft",
    summary: "9 trabalhadores · 3 atividades · 4 fotografias",
  },
  {
    id: "4",
    number: "RDO #021",
    projectName: "Edifício Comercial Talatona",
    date: "17 Ago 2026",
    status: "generated",
    summary: "10 trabalhadores · 5 atividades · 7 fotografias",
  },
  {
    id: "5",
    number: "RDO #020",
    projectName: "Reabilitação Pedrinhas",
    date: "16 Ago 2026",
    status: "generated",
    summary: "8 trabalhadores · 4 atividades · 5 fotografias",
  },
];

export interface DashboardReport {
  id: string;
  number: number;
  date: string;
  day: string;
  month: string;
  projectName: string;
  status: "draft" | "generated";
}

export const MOCK_DASHBOARD_REPORTS: DashboardReport[] = [
  {
    id: "1",
    number: 31,
    date: "11 Ago 2026",
    day: "11",
    month: "Ago",
    projectName: "Reabilitação Pedrinhas",
    status: "generated",
  },
  {
    id: "2",
    number: 30,
    date: "10 Ago 2026",
    day: "10",
    month: "Ago",
    projectName: "Reabilitação Pedrinhas",
    status: "generated",
  },
];

export const MOCK_RECENT_RDOS = [
  { id: "1", date: "11 Ago", number: 31, status: "generated" as const },
  { id: "2", date: "10 Ago", number: 30, status: "generated" as const },
  { id: "3", date: "09 Ago", number: 29, status: "generated" as const },
];
