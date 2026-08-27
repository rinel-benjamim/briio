import { useSQLiteContext } from "expo-sqlite";
import { generateId } from "@/utils/uuid";
import type { Task, TaskStatus } from "@/types";

export interface CreateTaskInput {
  description: string;
  location?: string;
  quantity?: number;
  unit?: string;
  progress_percentage?: number;
  status?: TaskStatus;
  observation?: string;
}

export interface UpdateTaskInput {
  description?: string;
  location?: string;
  quantity?: number;
  unit?: string;
  progress_percentage?: number;
  status?: TaskStatus;
  observation?: string;
}

export function useTaskRepository() {
  const db = useSQLiteContext();

  async function findByRdoId(rdoId: string): Promise<Task[]> {
    return db.getAllAsync<Task>(
      "SELECT * FROM tasks WHERE rdo_id = ? ORDER BY created_at ASC",
      [rdoId]
    );
  }

  async function findById(id: string): Promise<Task | null> {
    return db.getFirstAsync<Task>(
      "SELECT * FROM tasks WHERE id = ?",
      [id]
    );
  }

  async function create(rdoId: string, input: CreateTaskInput): Promise<Task> {
    const id = generateId();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO tasks (id, rdo_id, description, location, quantity, unit, progress_percentage, status, observation, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, rdoId, input.description,
        input.location ?? null, input.quantity ?? null, input.unit ?? null,
        input.progress_percentage ?? 0, input.status ?? "in_progress",
        input.observation ?? null, now, now,
      ]
    );

    const task = await findById(id);
    if (!task) throw new Error("Erro ao criar tarefa");
    return task;
  }

  async function update(id: string, input: UpdateTaskInput): Promise<Task> {
    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (input.description !== undefined) { fields.push("description = ?"); values.push(input.description); }
    if (input.location !== undefined) { fields.push("location = ?"); values.push(input.location); }
    if (input.quantity !== undefined) { fields.push("quantity = ?"); values.push(input.quantity); }
    if (input.unit !== undefined) { fields.push("unit = ?"); values.push(input.unit); }
    if (input.progress_percentage !== undefined) { fields.push("progress_percentage = ?"); values.push(input.progress_percentage); }
    if (input.status !== undefined) { fields.push("status = ?"); values.push(input.status); }
    if (input.observation !== undefined) { fields.push("observation = ?"); values.push(input.observation); }

    fields.push("updated_at = ?");
    values.push(now);
    values.push(id);

    await db.runAsync(
      `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    const task = await findById(id);
    if (!task) throw new Error("Tarefa não encontrada");
    return task;
  }

  async function remove(id: string): Promise<void> {
    await db.runAsync("DELETE FROM tasks WHERE id = ?", [id]);
  }

  async function removeByRdoId(rdoId: string): Promise<void> {
    await db.runAsync("DELETE FROM tasks WHERE rdo_id = ?", [rdoId]);
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
