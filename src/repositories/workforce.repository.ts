import { useSQLiteContext } from "expo-sqlite";
import { generateId } from "@/utils/uuid";
import type { WorkforceEntry } from "@/types";

export interface CreateWorkforceInput {
  function: string;
  people_count: number;
  hours_per_person: number;
  observation?: string;
}

export interface UpdateWorkforceInput {
  function?: string;
  people_count?: number;
  hours_per_person?: number;
  observation?: string;
}

export function useWorkforceRepository() {
  const db = useSQLiteContext();

  async function findByRdoId(rdoId: string): Promise<WorkforceEntry[]> {
    return db.getAllAsync<WorkforceEntry>(
      "SELECT * FROM workforce_entries WHERE rdo_id = ? ORDER BY created_at ASC",
      [rdoId]
    );
  }

  async function findById(id: string): Promise<WorkforceEntry | null> {
    return db.getFirstAsync<WorkforceEntry>(
      "SELECT * FROM workforce_entries WHERE id = ?",
      [id]
    );
  }

  async function create(rdoId: string, input: CreateWorkforceInput): Promise<WorkforceEntry> {
    const id = generateId();
    const now = new Date().toISOString();
    const totalHours = input.people_count * input.hours_per_person;

    await db.runAsync(
      `INSERT INTO workforce_entries (id, rdo_id, function, people_count, hours_per_person, total_hours, observation, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, rdoId, input.function, input.people_count, input.hours_per_person, totalHours, input.observation ?? null, now, now]
    );

    const entry = await findById(id);
    if (!entry) throw new Error("Erro ao criar entrada de mão de obra");
    return entry;
  }

  async function update(id: string, input: UpdateWorkforceInput): Promise<WorkforceEntry> {
    const existing = await findById(id);
    if (!existing) throw new Error("Entrada de mão de obra não encontrada");

    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (input.function !== undefined) { fields.push("function = ?"); values.push(input.function); }
    if (input.people_count !== undefined) { fields.push("people_count = ?"); values.push(input.people_count); }
    if (input.hours_per_person !== undefined) { fields.push("hours_per_person = ?"); values.push(input.hours_per_person); }
    if (input.observation !== undefined) { fields.push("observation = ?"); values.push(input.observation); }

    if (input.people_count !== undefined || input.hours_per_person !== undefined) {
      const peopleCount = input.people_count ?? existing.people_count;
      const hoursPerPerson = input.hours_per_person ?? existing.hours_per_person;
      fields.push("total_hours = ?");
      values.push(peopleCount * hoursPerPerson);
    }

    fields.push("updated_at = ?");
    values.push(now);
    values.push(id);

    await db.runAsync(
      `UPDATE workforce_entries SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    const updated = await findById(id);
    if (!updated) throw new Error("Erro ao atualizar entrada de mão de obra");
    return updated;
  }

  async function remove(id: string): Promise<void> {
    await db.runAsync("DELETE FROM workforce_entries WHERE id = ?", [id]);
  }

  async function removeByRdoId(rdoId: string): Promise<void> {
    await db.runAsync("DELETE FROM workforce_entries WHERE rdo_id = ?", [rdoId]);
  }

  async function getSummary(rdoId: string): Promise<{ workers: number; totalHours: number }> {
    const result = await db.getFirstAsync<{ workers: number; totalHours: number }>(
      "SELECT COALESCE(SUM(people_count), 0) as workers, COALESCE(SUM(total_hours), 0) as totalHours FROM workforce_entries WHERE rdo_id = ?",
      [rdoId]
    );
    return result ?? { workers: 0, totalHours: 0 };
  }

  return {
    findByRdoId,
    findById,
    create,
    update,
    remove,
    removeByRdoId,
    getSummary,
  };
}
