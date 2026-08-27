import { useSQLiteContext } from "expo-sqlite";
import { generateId } from "@/utils/uuid";
import type { MaterialEntry, MaterialStatus } from "@/types";

export interface CreateMaterialInput {
  material: string;
  quantity: number;
  unit?: string;
  status?: MaterialStatus;
  observation?: string;
}

export interface UpdateMaterialInput {
  material?: string;
  quantity?: number;
  unit?: string;
  status?: MaterialStatus;
  observation?: string;
}

export function useMaterialRepository() {
  const db = useSQLiteContext();

  async function findByRdoId(rdoId: string): Promise<MaterialEntry[]> {
    return db.getAllAsync<MaterialEntry>(
      "SELECT * FROM material_entries WHERE rdo_id = ? ORDER BY created_at ASC",
      [rdoId]
    );
  }

  async function findById(id: string): Promise<MaterialEntry | null> {
    return db.getFirstAsync<MaterialEntry>(
      "SELECT * FROM material_entries WHERE id = ?",
      [id]
    );
  }

  async function create(rdoId: string, input: CreateMaterialInput): Promise<MaterialEntry> {
    const id = generateId();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO material_entries (id, rdo_id, material, quantity, unit, status, observation, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, rdoId, input.material, input.quantity, input.unit ?? null, input.status ?? "received", input.observation ?? null, now, now]
    );

    const entry = await findById(id);
    if (!entry) throw new Error("Erro ao criar entrada de material");
    return entry;
  }

  async function update(id: string, input: UpdateMaterialInput): Promise<MaterialEntry> {
    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (input.material !== undefined) { fields.push("material = ?"); values.push(input.material); }
    if (input.quantity !== undefined) { fields.push("quantity = ?"); values.push(input.quantity); }
    if (input.unit !== undefined) { fields.push("unit = ?"); values.push(input.unit); }
    if (input.status !== undefined) { fields.push("status = ?"); values.push(input.status); }
    if (input.observation !== undefined) { fields.push("observation = ?"); values.push(input.observation); }

    fields.push("updated_at = ?");
    values.push(now);
    values.push(id);

    await db.runAsync(
      `UPDATE material_entries SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    const entry = await findById(id);
    if (!entry) throw new Error("Entrada de material não encontrada");
    return entry;
  }

  async function remove(id: string): Promise<void> {
    await db.runAsync("DELETE FROM material_entries WHERE id = ?", [id]);
  }

  async function removeByRdoId(rdoId: string): Promise<void> {
    await db.runAsync("DELETE FROM material_entries WHERE rdo_id = ?", [rdoId]);
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
