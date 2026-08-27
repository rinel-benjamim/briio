import { useSQLiteContext } from "expo-sqlite";
import { generateId } from "@/utils/uuid";
import type { RDO, RdoStatus } from "@/types";

export interface CreateRdoInput {
  project_id: string;
  report_date: string;
}

export interface UpdateRdoInput {
  status?: RdoStatus;
  progress_percentage?: number;
  generated_pdf_uri?: string;
  completed_at?: string;
  generated_at?: string;
}

export function useRdoRepository() {
  const db = useSQLiteContext();

  async function findAll(): Promise<RDO[]> {
    return db.getAllAsync<RDO>(
      "SELECT * FROM rdos ORDER BY report_date DESC, created_at DESC"
    );
  }

  async function findById(id: string): Promise<RDO | null> {
    return db.getFirstAsync<RDO>(
      "SELECT * FROM rdos WHERE id = ?",
      [id]
    );
  }

  async function findByProjectId(projectId: string): Promise<RDO[]> {
    return db.getAllAsync<RDO>(
      "SELECT * FROM rdos WHERE project_id = ? ORDER BY report_date DESC",
      [projectId]
    );
  }

  async function findByProjectAndDate(
    projectId: string,
    reportDate: string
  ): Promise<RDO | null> {
    return db.getFirstAsync<RDO>(
      "SELECT * FROM rdos WHERE project_id = ? AND report_date = ?",
      [projectId, reportDate]
    );
  }

  async function findLatestByProject(projectId: string): Promise<RDO | null> {
    return db.getFirstAsync<RDO>(
      "SELECT * FROM rdos WHERE project_id = ? ORDER BY report_date DESC LIMIT 1",
      [projectId]
    );
  }

  async function getNextNumber(projectId: string): Promise<number> {
    const result = await db.getFirstAsync<{ max_num: number | null }>(
      "SELECT MAX(number) as max_num FROM rdos WHERE project_id = ?",
      [projectId]
    );
    return (result?.max_num ?? 0) + 1;
  }

  async function create(input: CreateRdoInput): Promise<RDO> {
    const id = generateId();
    const now = new Date().toISOString();
    const number = await getNextNumber(input.project_id);

    await db.runAsync(
      `INSERT INTO rdos (
        id, project_id, number, report_date, status,
        progress_percentage, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.project_id,
        number,
        input.report_date,
        "draft",
        0,
        now,
        now,
      ]
    );

    const rdo = await findById(id);
    if (!rdo) throw new Error("Erro ao criar RDO");
    return rdo;
  }

  async function update(id: string, input: UpdateRdoInput): Promise<RDO> {
    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (input.status !== undefined) { fields.push("status = ?"); values.push(input.status); }
    if (input.progress_percentage !== undefined) { fields.push("progress_percentage = ?"); values.push(input.progress_percentage); }
    if (input.generated_pdf_uri !== undefined) { fields.push("generated_pdf_uri = ?"); values.push(input.generated_pdf_uri); }
    if (input.completed_at !== undefined) { fields.push("completed_at = ?"); values.push(input.completed_at); }
    if (input.generated_at !== undefined) { fields.push("generated_at = ?"); values.push(input.generated_at); }

    fields.push("updated_at = ?");
    values.push(now);
    values.push(id);

    await db.runAsync(
      `UPDATE rdos SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    const rdo = await findById(id);
    if (!rdo) throw new Error("RDO não encontrado");
    return rdo;
  }

  async function remove(id: string): Promise<void> {
    await db.runAsync("DELETE FROM rdos WHERE id = ?", [id]);
  }

  async function count(): Promise<number> {
    const result = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM rdos"
    );
    return result?.count ?? 0;
  }

  async function countByProject(projectId: string): Promise<number> {
    const result = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM rdos WHERE project_id = ?",
      [projectId]
    );
    return result?.count ?? 0;
  }

  async function existsForDate(projectId: string, reportDate: string): Promise<boolean> {
    const result = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM rdos WHERE project_id = ? AND report_date = ?",
      [projectId, reportDate]
    );
    return (result?.count ?? 0) > 0;
  }

  return {
    findAll,
    findById,
    findByProjectId,
    findByProjectAndDate,
    findLatestByProject,
    getNextNumber,
    create,
    update,
    remove,
    count,
    countByProject,
    existsForDate,
  };
}
