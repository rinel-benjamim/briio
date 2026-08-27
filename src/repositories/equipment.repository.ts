import { useSQLiteContext } from "expo-sqlite";
import { generateId } from "@/utils/uuid";
import type { EquipmentEntry, EquipmentStatus } from "@/types";

export interface CreateEquipmentInput {
  equipment: string;
  quantity: number;
  hours_used?: number;
  status?: EquipmentStatus;
  observation?: string;
}

export interface UpdateEquipmentInput {
  equipment?: string;
  quantity?: number;
  hours_used?: number;
  status?: EquipmentStatus;
  observation?: string;
}

export function useEquipmentRepository() {
  const db = useSQLiteContext();

  async function findByRdoId(rdoId: string): Promise<EquipmentEntry[]> {
    return db.getAllAsync<EquipmentEntry>(
      "SELECT * FROM equipment_entries WHERE rdo_id = ? ORDER BY created_at ASC",
      [rdoId]
    );
  }

  async function findById(id: string): Promise<EquipmentEntry | null> {
    return db.getFirstAsync<EquipmentEntry>(
      "SELECT * FROM equipment_entries WHERE id = ?",
      [id]
    );
  }

  async function create(rdoId: string, input: CreateEquipmentInput): Promise<EquipmentEntry> {
    const id = generateId();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO equipment_entries (id, rdo_id, equipment, quantity, hours_used, status, observation, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, rdoId, input.equipment, input.quantity, input.hours_used ?? 0, input.status ?? "operational", input.observation ?? null, now, now]
    );

    const entry = await findById(id);
    if (!entry) throw new Error("Erro ao criar entrada de equipamento");
    return entry;
  }

  async function update(id: string, input: UpdateEquipmentInput): Promise<EquipmentEntry> {
    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (input.equipment !== undefined) { fields.push("equipment = ?"); values.push(input.equipment); }
    if (input.quantity !== undefined) { fields.push("quantity = ?"); values.push(input.quantity); }
    if (input.hours_used !== undefined) { fields.push("hours_used = ?"); values.push(input.hours_used); }
    if (input.status !== undefined) { fields.push("status = ?"); values.push(input.status); }
    if (input.observation !== undefined) { fields.push("observation = ?"); values.push(input.observation); }

    fields.push("updated_at = ?");
    values.push(now);
    values.push(id);

    await db.runAsync(
      `UPDATE equipment_entries SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    const entry = await findById(id);
    if (!entry) throw new Error("Entrada de equipamento não encontrada");
    return entry;
  }

  async function remove(id: string): Promise<void> {
    await db.runAsync("DELETE FROM equipment_entries WHERE id = ?", [id]);
  }

  async function removeByRdoId(rdoId: string): Promise<void> {
    await db.runAsync("DELETE FROM equipment_entries WHERE rdo_id = ?", [rdoId]);
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
