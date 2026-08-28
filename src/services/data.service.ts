import { useSQLiteContext } from "expo-sqlite";
import { useProfileRepository } from "@/repositories/profile.repository";
import { useProjectRepository } from "@/repositories/project.repository";
import { useRdoRepository } from "@/repositories/rdo.repository";
import { useWeatherRepository } from "@/repositories/weather.repository";
import { useWorkforceRepository } from "@/repositories/workforce.repository";
import { useMaterialRepository } from "@/repositories/material.repository";
import { useEquipmentRepository } from "@/repositories/equipment.repository";
import { useTaskRepository } from "@/repositories/task.repository";
import { useOccurrenceRepository } from "@/repositories/occurrence.repository";
import { useObservationRepository } from "@/repositories/observation.repository";
import { usePhotographRepository } from "@/repositories/photograph.repository";
import { useSettingsRepository } from "@/repositories/settings.repository";

export interface ExportData {
  version: 1;
  exportedAt: string;
  profiles: any[];
  projects: any[];
  rdos: any[];
  rdo_configurations: any[];
  rdo_weather_conditions: any[];
  workforce_entries: any[];
  material_entries: any[];
  equipment_entries: any[];
  tasks: any[];
  occurrences: any[];
  rdo_observations: any[];
  photographs: any[];
  app_settings: any[];
}

export function useDataService() {
  const db = useSQLiteContext();

  async function exportData(): Promise<ExportData> {
    const [profiles, projects, rdos, configurations, weather, workforce, materials, equipment, tasks, occurrences, observations, photographs, settings] = await Promise.all([
      db.getAllAsync("SELECT * FROM profiles"),
      db.getAllAsync("SELECT * FROM projects"),
      db.getAllAsync("SELECT * FROM rdos"),
      db.getAllAsync("SELECT * FROM rdo_configurations"),
      db.getAllAsync("SELECT * FROM rdo_weather_conditions"),
      db.getAllAsync("SELECT * FROM workforce_entries"),
      db.getAllAsync("SELECT * FROM material_entries"),
      db.getAllAsync("SELECT * FROM equipment_entries"),
      db.getAllAsync("SELECT * FROM tasks"),
      db.getAllAsync("SELECT * FROM occurrences"),
      db.getAllAsync("SELECT * FROM rdo_observations"),
      db.getAllAsync("SELECT * FROM photographs"),
      db.getAllAsync("SELECT * FROM app_settings"),
    ]);

    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      profiles,
      projects,
      rdos,
      rdo_configurations: configurations,
      rdo_weather_conditions: weather,
      workforce_entries: workforce,
      material_entries: materials,
      equipment_entries: equipment,
      tasks,
      occurrences,
      rdo_observations: observations,
      photographs,
      app_settings: settings,
    };
  }

  async function importData(data: ExportData): Promise<void> {
    await db.withTransactionAsync(async () => {
      const tables = [
        "photographs", "rdo_observations", "occurrences", "tasks",
        "equipment_entries", "material_entries", "workforce_entries",
        "rdo_weather_conditions", "rdo_configurations", "rdos",
        "projects", "profiles", "app_settings",
      ];
      for (const table of tables) {
        await db.runAsync(`DELETE FROM ${table}`);
      }

      for (const row of data.profiles) {
        await db.runAsync(
          "INSERT INTO profiles (id, name, role, company, phone, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [row.id, row.name, row.role, row.company, row.phone, row.email, row.created_at, row.updated_at]
        );
      }
      for (const row of data.projects) {
        await db.runAsync(
          "INSERT INTO projects (id, name, reference, location, province, start_date, expected_end_date, responsible_name, client_name, contractor_name, inspector_name, status, created_at, updated_at, archived_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [row.id, row.name, row.reference, row.location, row.province, row.start_date, row.expected_end_date, row.responsible_name, row.client_name, row.contractor_name, row.inspector_name, row.status, row.created_at, row.updated_at, row.archived_at]
        );
      }
      for (const row of data.rdos) {
        await db.runAsync(
          "INSERT INTO rdos (id, project_id, number, report_date, status, progress_percentage, generated_pdf_uri, created_at, updated_at, completed_at, generated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [row.id, row.project_id, row.number, row.report_date, row.status, row.progress_percentage, row.generated_pdf_uri, row.created_at, row.updated_at, row.completed_at, row.generated_at]
        );
      }
      for (const row of data.rdo_configurations) {
        await db.runAsync(
          "INSERT INTO rdo_configurations (id, project_id, default_responsible, signature_person, signature_type, template, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [row.id, row.project_id, row.default_responsible, row.signature_person, row.signature_type, row.template, row.created_at, row.updated_at]
        );
      }
      for (const row of data.rdo_weather_conditions) {
        await db.runAsync(
          "INSERT INTO rdo_weather_conditions (id, rdo_id, period, condition, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [row.id, row.rdo_id, row.period, row.condition, row.notes, row.created_at, row.updated_at]
        );
      }
      for (const row of data.workforce_entries) {
        await db.runAsync(
          "INSERT INTO workforce_entries (id, rdo_id, function, people_count, hours_per_person, total_hours, observation, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [row.id, row.rdo_id, row.function, row.people_count, row.hours_per_person, row.total_hours, row.observation, row.created_at, row.updated_at]
        );
      }
      for (const row of data.material_entries) {
        await db.runAsync(
          "INSERT INTO material_entries (id, rdo_id, material, quantity, unit, status, observation, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [row.id, row.rdo_id, row.material, row.quantity, row.unit, row.status, row.observation, row.created_at, row.updated_at]
        );
      }
      for (const row of data.equipment_entries) {
        await db.runAsync(
          "INSERT INTO equipment_entries (id, rdo_id, equipment, quantity, hours_used, status, observation, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [row.id, row.rdo_id, row.equipment, row.quantity, row.hours_used, row.status, row.observation, row.created_at, row.updated_at]
        );
      }
      for (const row of data.tasks) {
        await db.runAsync(
          "INSERT INTO tasks (id, rdo_id, description, location, quantity, unit, progress_percentage, status, observation, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [row.id, row.rdo_id, row.description, row.location, row.quantity, row.unit, row.progress_percentage, row.status, row.observation, row.created_at, row.updated_at]
        );
      }
      for (const row of data.occurrences) {
        await db.runAsync(
          "INSERT INTO occurrences (id, rdo_id, title, occurred_at, location, description, impact, action_taken, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [row.id, row.rdo_id, row.title, row.occurred_at, row.location, row.description, row.impact, row.action_taken, row.created_at, row.updated_at]
        );
      }
      for (const row of data.rdo_observations) {
        await db.runAsync(
          "INSERT INTO rdo_observations (id, rdo_id, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
          [row.id, row.rdo_id, row.content, row.created_at, row.updated_at]
        );
      }
      for (const row of data.photographs) {
        await db.runAsync(
          "INSERT INTO photographs (id, rdo_id, file_uri, thumbnail_uri, caption, location, type, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [row.id, row.rdo_id, row.file_uri, row.thumbnail_uri, row.caption, row.location, row.type, row.sort_order, row.created_at, row.updated_at]
        );
      }
      for (const row of data.app_settings) {
        await db.runAsync(
          "INSERT INTO app_settings (id, key, value, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
          [row.id, row.key, row.value, row.created_at, row.updated_at]
        );
      }
    });
  }

  async function resetDatabase(): Promise<void> {
    await db.withTransactionAsync(async () => {
      const tables = [
        "photographs", "rdo_observations", "occurrences", "tasks",
        "equipment_entries", "material_entries", "workforce_entries",
        "rdo_weather_conditions", "rdo_configurations", "rdos",
        "projects", "profiles", "app_settings",
      ];
      for (const table of tables) {
        await db.runAsync(`DELETE FROM ${table}`);
      }
    });
  }

  async function getCounts(): Promise<Record<string, number>> {
    const tables = [
      "profiles", "projects", "rdos", "workforce_entries",
      "material_entries", "equipment_entries", "tasks",
      "occurrences", "rdo_observations", "photographs",
    ];
    const counts: Record<string, number> = {};
    for (const table of tables) {
      const row = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM ${table}`);
      counts[table] = row?.count ?? 0;
    }
    return counts;
  }

  return { exportData, importData, resetDatabase, getCounts };
}
