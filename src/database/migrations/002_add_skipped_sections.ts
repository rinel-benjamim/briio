import type { Migration } from "./index";

export const migration002AddSkippedSections: Migration = {
  version: 2,
  up: async (db) => {
    await db.execAsync(`
      ALTER TABLE rdos ADD COLUMN skipped_sections TEXT DEFAULT NULL;
    `);
  },
};
