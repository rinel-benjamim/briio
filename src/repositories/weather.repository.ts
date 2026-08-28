import { useSQLiteContext } from "expo-sqlite";
import { generateId } from "@/utils/uuid";
import type { RDOWeatherCondition, WeatherPeriod, WeatherCondition } from "@/types";

export function useWeatherRepository() {
  const db = useSQLiteContext();

  async function findByRdoId(rdoId: string): Promise<RDOWeatherCondition[]> {
    return db.getAllAsync<RDOWeatherCondition>(
      "SELECT * FROM rdo_weather_conditions WHERE rdo_id = ? ORDER BY CASE period WHEN 'morning' THEN 1 WHEN 'afternoon' THEN 2 WHEN 'night' THEN 3 END",
      [rdoId]
    );
  }

  async function upsert(
    rdoId: string,
    period: WeatherPeriod,
    condition: WeatherCondition | null,
    notes: string | null
  ): Promise<RDOWeatherCondition> {
    const existing = await db.getFirstAsync<RDOWeatherCondition>(
      "SELECT * FROM rdo_weather_conditions WHERE rdo_id = ? AND period = ?",
      [rdoId, period]
    );

    if (existing) {
      const now = new Date().toISOString();
      await db.runAsync(
        `UPDATE rdo_weather_conditions SET condition = ?, notes = ?, updated_at = ? WHERE id = ?`,
        [condition, notes, now, existing.id]
      );
      const updated = await db.getFirstAsync<RDOWeatherCondition>(
        "SELECT * FROM rdo_weather_conditions WHERE id = ?",
        [existing.id]
      );
      if (!updated) throw new Error("Erro ao atualizar condição climática");
      return updated;
    }

    const id = generateId();
    const now = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO rdo_weather_conditions (id, rdo_id, period, condition, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, rdoId, period, condition, notes, now, now]
    );
    const created = await db.getFirstAsync<RDOWeatherCondition>(
      "SELECT * FROM rdo_weather_conditions WHERE id = ?",
      [id]
    );
    if (!created) throw new Error("Erro ao criar condição climática");
    return created;
  }

  async function remove(id: string): Promise<void> {
    await db.runAsync("DELETE FROM rdo_weather_conditions WHERE id = ?", [id]);
  }

  async function removeByRdoId(rdoId: string): Promise<void> {
    await db.runAsync("DELETE FROM rdo_weather_conditions WHERE rdo_id = ?", [rdoId]);
  }

  async function removeByPeriod(rdoId: string, period: WeatherPeriod): Promise<void> {
    await db.runAsync("DELETE FROM rdo_weather_conditions WHERE rdo_id = ? AND period = ?", [rdoId, period]);
  }

  return {
    findByRdoId,
    upsert,
    remove,
    removeByRdoId,
    removeByPeriod,
  };
}
