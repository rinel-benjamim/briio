export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Profile extends BaseEntity {
  name: string;
  role: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
}

export type ProjectStatus = "active" | "completed" | "archived";

export interface Project extends BaseEntity {
  name: string;
  reference: string | null;
  location: string | null;
  province: string | null;
  start_date: string | null;
  expected_end_date: string | null;
  responsible_name: string | null;
  client_name: string | null;
  contractor_name: string | null;
  inspector_name: string | null;
  status: ProjectStatus;
  archived_at: string | null;
}

export type RdoStatus = "draft" | "completed" | "generated";

export interface RDO extends BaseEntity {
  project_id: string;
  number: number;
  report_date: string;
  status: RdoStatus;
  progress_percentage: number;
  generated_pdf_uri: string | null;
  completed_at: string | null;
  generated_at: string | null;
}

export interface RDOConfiguration extends BaseEntity {
  project_id: string;
  default_responsible: string | null;
  signature_person: string | null;
  signature_type: string | null;
  template: string | null;
}

export type WeatherPeriod = "morning" | "afternoon" | "night";
export type WeatherCondition = "sunny" | "cloudy" | "rain";

export interface RDOWeatherCondition extends BaseEntity {
  rdo_id: string;
  period: WeatherPeriod;
  condition: WeatherCondition | null;
  notes: string | null;
}

export interface WorkforceEntry extends BaseEntity {
  rdo_id: string;
  function: string;
  people_count: number;
  hours_per_person: number;
  total_hours: number;
  observation: string | null;
}

export type MaterialStatus = "received" | "used" | "missing" | "in_transit";

export interface MaterialEntry extends BaseEntity {
  rdo_id: string;
  material: string;
  quantity: number;
  unit: string | null;
  status: MaterialStatus;
  observation: string | null;
}

export type EquipmentStatus = "operational" | "stopped" | "maintenance" | "unavailable";

export interface EquipmentEntry extends BaseEntity {
  rdo_id: string;
  equipment: string;
  quantity: number;
  hours_used: number;
  status: EquipmentStatus;
  observation: string | null;
}

export type TaskStatus = "in_progress" | "completed" | "paused";

export interface Task extends BaseEntity {
  rdo_id: string;
  description: string;
  location: string | null;
  quantity: number | null;
  unit: string | null;
  progress_percentage: number;
  status: TaskStatus;
  observation: string | null;
}

export type OccurrenceImpact = "none" | "low" | "relevant" | "stoppage";

export interface Occurrence extends BaseEntity {
  rdo_id: string;
  title: string;
  occurred_at: string | null;
  location: string | null;
  description: string | null;
  impact: OccurrenceImpact;
  action_taken: string | null;
}

export interface RDOObservation extends BaseEntity {
  rdo_id: string;
  content: string;
}

export type PhotographType = "before" | "during" | "after";

export interface Photograph extends BaseEntity {
  rdo_id: string;
  file_uri: string;
  thumbnail_uri: string | null;
  caption: string | null;
  location: string | null;
  type: PhotographType | null;
  sort_order: number;
}

export interface AppSetting extends BaseEntity {
  key: string;
  value: string | null;
}
