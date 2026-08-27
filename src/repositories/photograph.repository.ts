import { useSQLiteContext } from "expo-sqlite";
import { generateId } from "@/utils/uuid";
import type { Photograph, PhotographType } from "@/types";

export interface CreatePhotographInput {
  file_uri: string;
  thumbnail_uri?: string;
  caption?: string;
  location?: string;
  type?: PhotographType;
  sort_order?: number;
}

export interface UpdatePhotographInput {
  caption?: string;
  location?: string;
  type?: PhotographType;
  sort_order?: number;
}

export function usePhotographRepository() {
  const db = useSQLiteContext();

  async function findByRdoId(rdoId: string): Promise<Photograph[]> {
    return db.getAllAsync<Photograph>(
      "SELECT * FROM photographs WHERE rdo_id = ? ORDER BY sort_order ASC, created_at ASC",
      [rdoId]
    );
  }

  async function findById(id: string): Promise<Photograph | null> {
    return db.getFirstAsync<Photograph>(
      "SELECT * FROM photographs WHERE id = ?",
      [id]
    );
  }

  async function create(rdoId: string, input: CreatePhotographInput): Promise<Photograph> {
    const id = generateId();
    const now = new Date().toISOString();

    let sortOrder = input.sort_order;
    if (sortOrder === undefined) {
      const maxOrder = await db.getFirstAsync<{ max_order: number | null }>(
        "SELECT MAX(sort_order) as max_order FROM photographs WHERE rdo_id = ?",
        [rdoId]
      );
      sortOrder = (maxOrder?.max_order ?? -1) + 1;
    }

    await db.runAsync(
      `INSERT INTO photographs (id, rdo_id, file_uri, thumbnail_uri, caption, location, type, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, rdoId, input.file_uri, input.thumbnail_uri ?? null,
        input.caption ?? null, input.location ?? null, input.type ?? null,
        sortOrder, now, now,
      ]
    );

    const photo = await findById(id);
    if (!photo) throw new Error("Erro ao criar fotografia");
    return photo;
  }

  async function update(id: string, input: UpdatePhotographInput): Promise<Photograph> {
    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: any[] = [];

    if (input.caption !== undefined) { fields.push("caption = ?"); values.push(input.caption); }
    if (input.location !== undefined) { fields.push("location = ?"); values.push(input.location); }
    if (input.type !== undefined) { fields.push("type = ?"); values.push(input.type); }
    if (input.sort_order !== undefined) { fields.push("sort_order = ?"); values.push(input.sort_order); }

    fields.push("updated_at = ?");
    values.push(now);
    values.push(id);

    await db.runAsync(
      `UPDATE photographs SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    const photo = await findById(id);
    if (!photo) throw new Error("Fotografia não encontrada");
    return photo;
  }

  async function remove(id: string): Promise<void> {
    await db.runAsync("DELETE FROM photographs WHERE id = ?", [id]);
  }

  async function removeByRdoId(rdoId: string): Promise<void> {
    await db.runAsync("DELETE FROM photographs WHERE rdo_id = ?", [rdoId]);
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
