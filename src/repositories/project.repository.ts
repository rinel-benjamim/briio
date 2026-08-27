import { useSQLiteContext } from "expo-sqlite";
import { generateId } from "@/utils/uuid";
import type { Project, ProjectStatus } from "@/types";

export interface CreateProjectInput {
  name: string;
  reference?: string;
  location?: string;
  province?: string;
  start_date?: string;
  expected_end_date?: string;
  responsible_name?: string;
  client_name?: string;
  contractor_name?: string;
  inspector_name?: string;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  status?: ProjectStatus;
  archived_at?: string;
}

export function useProjectRepository() {
  const db = useSQLiteContext();

  async function findAll(): Promise<Project[]> {
    return db.getAllAsync<Project>(
      "SELECT * FROM projects ORDER BY created_at DESC"
    );
  }

  async function findById(id: string): Promise<Project | null> {
    return db.getFirstAsync<Project>(
      "SELECT * FROM projects WHERE id = ?",
      [id]
    );
  }

  async function findByStatus(status: ProjectStatus): Promise<Project[]> {
    return db.getAllAsync<Project>(
      "SELECT * FROM projects WHERE status = ? ORDER BY created_at DESC",
      [status]
    );
  }

  async function search(query: string): Promise<Project[]> {
    const pattern = `%${query}%`;
    return db.getAllAsync<Project>(
      "SELECT * FROM projects WHERE name LIKE ? OR location LIKE ? ORDER BY created_at DESC",
      [pattern, pattern]
    );
  }

  async function create(input: CreateProjectInput): Promise<Project> {
    const id = generateId();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO projects (
        id, name, reference, location, province,
        start_date, expected_end_date, responsible_name,
        client_name, contractor_name, inspector_name,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.name,
        input.reference ?? null,
        input.location ?? null,
        input.province ?? null,
        input.start_date ?? null,
        input.expected_end_date ?? null,
        input.responsible_name ?? null,
        input.client_name ?? null,
        input.contractor_name ?? null,
        input.inspector_name ?? null,
        "active",
        now,
        now,
      ]
    );

    const project = await findById(id);
    if (!project) throw new Error("Erro ao criar projeto");
    return project;
  }

  async function update(id: string, input: UpdateProjectInput): Promise<Project> {
    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) { fields.push("name = ?"); values.push(input.name); }
    if (input.reference !== undefined) { fields.push("reference = ?"); values.push(input.reference); }
    if (input.location !== undefined) { fields.push("location = ?"); values.push(input.location); }
    if (input.province !== undefined) { fields.push("province = ?"); values.push(input.province); }
    if (input.start_date !== undefined) { fields.push("start_date = ?"); values.push(input.start_date); }
    if (input.expected_end_date !== undefined) { fields.push("expected_end_date = ?"); values.push(input.expected_end_date); }
    if (input.responsible_name !== undefined) { fields.push("responsible_name = ?"); values.push(input.responsible_name); }
    if (input.client_name !== undefined) { fields.push("client_name = ?"); values.push(input.client_name); }
    if (input.contractor_name !== undefined) { fields.push("contractor_name = ?"); values.push(input.contractor_name); }
    if (input.inspector_name !== undefined) { fields.push("inspector_name = ?"); values.push(input.inspector_name); }
    if (input.status !== undefined) { fields.push("status = ?"); values.push(input.status); }
    if (input.archived_at !== undefined) { fields.push("archived_at = ?"); values.push(input.archived_at); }

    fields.push("updated_at = ?");
    values.push(now);
    values.push(id);

    await db.runAsync(
      `UPDATE projects SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    const project = await findById(id);
    if (!project) throw new Error("Projeto não encontrado");
    return project;
  }

  async function remove(id: string): Promise<void> {
    await db.runAsync("DELETE FROM projects WHERE id = ?", [id]);
  }

  async function count(): Promise<number> {
    const result = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM projects"
    );
    return result?.count ?? 0;
  }

  async function countByStatus(): Promise<Record<ProjectStatus, number>> {
    const rows = await db.getAllAsync<{ status: ProjectStatus; count: number }>(
      "SELECT status, COUNT(*) as count FROM projects GROUP BY status"
    );
    const counts: Record<ProjectStatus, number> = { active: 0, completed: 0, archived: 0 };
    for (const row of rows) {
      counts[row.status] = row.count;
    }
    return counts;
  }

  return {
    findAll,
    findById,
    findByStatus,
    search,
    create,
    update,
    remove,
    count,
    countByStatus,
  };
}
