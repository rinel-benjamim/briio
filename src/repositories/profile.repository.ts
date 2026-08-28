import { useSQLiteContext } from "expo-sqlite";
import { generateId } from "@/utils/uuid";
import type { Profile } from "@/types";

export interface CreateProfileInput {
  name: string;
  role?: string;
  company?: string;
  phone?: string;
  email?: string;
}

export interface UpdateProfileInput {
  name?: string;
  role?: string;
  company?: string;
  phone?: string;
  email?: string;
}

export function useProfileRepository() {
  const db = useSQLiteContext();

  async function findFirst(): Promise<Profile | null> {
    return db.getFirstAsync<Profile>(
      "SELECT * FROM profiles ORDER BY created_at ASC LIMIT 1"
    );
  }

  async function findById(id: string): Promise<Profile | null> {
    return db.getFirstAsync<Profile>(
      "SELECT * FROM profiles WHERE id = ?",
      [id]
    );
  }

  async function create(input: CreateProfileInput): Promise<Profile> {
    const id = generateId();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO profiles (id, name, role, company, phone, email, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, input.name, input.role ?? null, input.company ?? null, input.phone ?? null, input.email ?? null, now, now]
    );

    return (await findById(id))!;
  }

  async function update(id: string, input: UpdateProfileInput): Promise<Profile> {
    const fields: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) { fields.push("name = ?"); values.push(input.name); }
    if (input.role !== undefined) { fields.push("role = ?"); values.push(input.role); }
    if (input.company !== undefined) { fields.push("company = ?"); values.push(input.company); }
    if (input.phone !== undefined) { fields.push("phone = ?"); values.push(input.phone); }
    if (input.email !== undefined) { fields.push("email = ?"); values.push(input.email); }

    if (fields.length === 0) return (await findById(id))!;

    fields.push("updated_at = datetime('now')");
    values.push(id);

    await db.runAsync(
      `UPDATE profiles SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    return (await findById(id))!;
  }

  async function upsert(input: CreateProfileInput): Promise<Profile> {
    const existing = await findFirst();
    if (existing) {
      return update(existing.id, input);
    }
    return create(input);
  }

  async function remove(id: string): Promise<void> {
    await db.runAsync("DELETE FROM profiles WHERE id = ?", [id]);
  }

  return { findFirst, findById, create, update, upsert, remove };
}
