import type { SQLiteDatabase } from "expo-sqlite";
import { migration001InitialSchema } from "./001_initial_schema";
import { migration002AddSkippedSections } from "./002_add_skipped_sections";

export interface Migration {
  version: number;
  up: (db: SQLiteDatabase) => Promise<void>;
}

export const allMigrations: Migration[] = [
  migration001InitialSchema,
  migration002AddSkippedSections,
];

export async function runMigrations(db: SQLiteDatabase, migrations: Migration[]) {
  await db.withTransactionAsync(async () => {
    const result = await db.getFirstAsync<{ user_version: number }>(
      "PRAGMA user_version",
    );
    const currentVersion = result?.user_version ?? 0;

    const pending = migrations
      .filter((m) => m.version > currentVersion)
      .sort((a, b) => a.version - b.version);

    for (const migration of pending) {
      await migration.up(db);
    }

    if (pending.length > 0) {
      const latestVersion = pending[pending.length - 1].version;
      await db.execAsync(`PRAGMA user_version = ${latestVersion}`);
    }
  });
}
