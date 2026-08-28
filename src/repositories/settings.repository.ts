import { useSQLiteContext } from "expo-sqlite";
import { generateId } from "@/utils/uuid";
import type { AppSetting } from "@/types";

export function useSettingsRepository() {
  const db = useSQLiteContext();

  async function get(key: string): Promise<string | null> {
    const row = await db.getFirstAsync<AppSetting>(
      "SELECT * FROM app_settings WHERE key = ?",
      [key]
    );
    return row?.value ?? null;
  }

  async function set(key: string, value: string): Promise<void> {
    const existing = await db.getFirstAsync<AppSetting>(
      "SELECT id FROM app_settings WHERE key = ?",
      [key]
    );

    if (existing) {
      await db.runAsync(
        "UPDATE app_settings SET value = ?, updated_at = datetime('now') WHERE key = ?",
        [value, key]
      );
    } else {
      const id = generateId();
      await db.runAsync(
        "INSERT INTO app_settings (id, key, value, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'))",
        [id, key, value]
      );
    }
  }

  async function remove(key: string): Promise<void> {
    await db.runAsync("DELETE FROM app_settings WHERE key = ?", [key]);
  }

  async function getAll(): Promise<Record<string, string>> {
    const rows = await db.getAllAsync<AppSetting>("SELECT * FROM app_settings");
    const result: Record<string, string> = {};
    for (const row of rows) {
      if (row.value !== null) result[row.key] = row.value;
    }
    return result;
  }

  return { get, set, remove, getAll };
}
