import { useSQLiteContext } from "expo-sqlite";
import { generateId } from "@/utils/uuid";
import type { RDOObservation } from "@/types";

export function useObservationRepository() {
  const db = useSQLiteContext();

  async function findByRdoId(rdoId: string): Promise<RDOObservation | null> {
    return db.getFirstAsync<RDOObservation>(
      "SELECT * FROM rdo_observations WHERE rdo_id = ?",
      [rdoId]
    );
  }

  async function upsert(rdoId: string, content: string): Promise<RDOObservation> {
    const existing = await findByRdoId(rdoId);

    if (existing) {
      const now = new Date().toISOString();
      await db.runAsync(
        "UPDATE rdo_observations SET content = ?, updated_at = ? WHERE id = ?",
        [content, now, existing.id]
      );
      const updated = await db.getFirstAsync<RDOObservation>(
        "SELECT * FROM rdo_observations WHERE id = ?",
        [existing.id]
      );
      if (!updated) throw new Error("Erro ao atualizar observação");
      return updated;
    }

    const id = generateId();
    const now = new Date().toISOString();
    await db.runAsync(
      `INSERT INTO rdo_observations (id, rdo_id, content, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [id, rdoId, content, now, now]
    );
    const created = await db.getFirstAsync<RDOObservation>(
      "SELECT * FROM rdo_observations WHERE id = ?",
      [id]
    );
    if (!created) throw new Error("Erro ao criar observação");
    return created;
  }

  async function removeByRdoId(rdoId: string): Promise<void> {
    await db.runAsync("DELETE FROM rdo_observations WHERE rdo_id = ?", [rdoId]);
  }

  return {
    findByRdoId,
    upsert,
    removeByRdoId,
  };
}
