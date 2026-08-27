import { useSQLiteContext } from "expo-sqlite";
import { generateId } from "@/utils/uuid";
import type { Occurrence, OccurrenceImpact } from "@/types";

export interface CreateOccurrenceInput {
  title: string;
  occurred_at?: string;
  location?: string;
  description?: string;
  impact?: OccurrenceImpact;
  action_taken?: string;
}

export interface UpdateOccurrenceInput {
  title?: string;
  occurred_at?: string;
  location?: string;
  description?: string;
  impact?: OccurrenceImpact;
  action_taken?: string;
}

export function useOccurrenceRepository() {
  const db = useSQLiteContext();

  async function findByRdoId(rdoId: string): Promise<Occurrence[]> {
    return db.getAllAsync<Occurrence>(
      "SELECT * FROM occurrences WHERE rdo_id = ? ORDER BY created_at ASC",
      [rdoId]
    );
  }

  async function findById(id: string): Promise<Occurrence | null> {
    return db.getFirstAsync<Occurrence>(
      "SELECT * FROM occurrences WHERE id = ?",
      [id]
    );
  }

  async function create(rdoId: string, input: CreateOccurrenceInput): Promise<Occurrence> {
    const id = generateId();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO occurrences (id, rdo_id, title, occurred_at, location, description, impact, action_taken, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, rdoId, input.title,
        input.occurred_at ?? null, input.location ?? null,
        input.description ?? null, input.impact ?? "none",
        input.action_taken ?? null, now, now,
      ]
    );

    const occurrence = await findById(id);
    if (!occurrence) throw new Error("Erro ao criar ocorrência");
    return occurrence;
  }

  async function update(id: string, input: UpdateOccurrenceInput): Promise<Occurrence> {
    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (input.title !== undefined) { fields.push("title = ?"); values.push(input.title); }
    if (input.occurred_at !== undefined) { fields.push("occurred_at = ?"); values.push(input.occurred_at); }
    if (input.location !== undefined) { fields.push("location = ?"); values.push(input.location); }
    if (input.description !== undefined) { fields.push("description = ?"); values.push(input.description); }
    if (input.impact !== undefined) { fields.push("impact = ?"); values.push(input.impact); }
    if (input.action_taken !== undefined) { fields.push("action_taken = ?"); values.push(input.action_taken); }

    fields.push("updated_at = ?");
    values.push(now);
    values.push(id);

    await db.runAsync(
      `UPDATE occurrences SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    const occurrence = await findById(id);
    if (!occurrence) throw new Error("Ocorrência não encontrada");
    return occurrence;
  }

  async function remove(id: string): Promise<void> {
    await db.runAsync("DELETE FROM occurrences WHERE id = ?", [id]);
  }

  async function removeByRdoId(rdoId: string): Promise<void> {
    await db.runAsync("DELETE FROM occurrences WHERE rdo_id = ?", [rdoId]);
  }

  return {
    findByRdoId,
    findById,
    create,
    update,
    remove,
    removeByRdoId,
  };
}
