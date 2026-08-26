import type { Migration } from "./index";

export const migration001InitialSchema: Migration = {
  version: 1,
  up: async (db) => {
    await db.execAsync(`
      -- Profile
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        role TEXT,
        company TEXT,
        phone TEXT,
        email TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      -- Projects
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        reference TEXT,
        location TEXT,
        province TEXT,
        start_date TEXT,
        expected_end_date TEXT,
        responsible_name TEXT,
        client_name TEXT,
        contractor_name TEXT,
        inspector_name TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        archived_at TEXT
      );

      -- RDO
      CREATE TABLE IF NOT EXISTS rdos (
        id TEXT PRIMARY KEY NOT NULL,
        project_id TEXT NOT NULL,
        number INTEGER NOT NULL,
        report_date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        progress_percentage INTEGER DEFAULT 0,
        generated_pdf_uri TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        completed_at TEXT,
        generated_at TEXT,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_rdos_project_date ON rdos(project_id, report_date);
      CREATE UNIQUE INDEX IF NOT EXISTS idx_rdos_unique_date ON rdos(project_id, report_date);

      -- RDO Configurations
      CREATE TABLE IF NOT EXISTS rdo_configurations (
        id TEXT PRIMARY KEY NOT NULL,
        project_id TEXT NOT NULL,
        default_responsible TEXT,
        signature_person TEXT,
        signature_type TEXT,
        template TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );

      -- RDO Weather Conditions
      CREATE TABLE IF NOT EXISTS rdo_weather_conditions (
        id TEXT PRIMARY KEY NOT NULL,
        rdo_id TEXT NOT NULL,
        period TEXT NOT NULL,
        condition TEXT,
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (rdo_id) REFERENCES rdos(id) ON DELETE CASCADE
      );

      -- Workforce Entries
      CREATE TABLE IF NOT EXISTS workforce_entries (
        id TEXT PRIMARY KEY NOT NULL,
        rdo_id TEXT NOT NULL,
        function TEXT NOT NULL,
        people_count INTEGER NOT NULL DEFAULT 0,
        hours_per_person REAL NOT NULL DEFAULT 0,
        total_hours REAL NOT NULL DEFAULT 0,
        observation TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (rdo_id) REFERENCES rdos(id) ON DELETE CASCADE
      );

      -- Material Entries
      CREATE TABLE IF NOT EXISTS material_entries (
        id TEXT PRIMARY KEY NOT NULL,
        rdo_id TEXT NOT NULL,
        material TEXT NOT NULL,
        quantity REAL NOT NULL DEFAULT 0,
        unit TEXT,
        status TEXT NOT NULL DEFAULT 'received',
        observation TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (rdo_id) REFERENCES rdos(id) ON DELETE CASCADE
      );

      -- Equipment Entries
      CREATE TABLE IF NOT EXISTS equipment_entries (
        id TEXT PRIMARY KEY NOT NULL,
        rdo_id TEXT NOT NULL,
        equipment TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        hours_used REAL NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'operational',
        observation TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (rdo_id) REFERENCES rdos(id) ON DELETE CASCADE
      );

      -- Tasks
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY NOT NULL,
        rdo_id TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT,
        quantity REAL,
        unit TEXT,
        progress_percentage INTEGER DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'in_progress',
        observation TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (rdo_id) REFERENCES rdos(id) ON DELETE CASCADE
      );

      -- Occurrences
      CREATE TABLE IF NOT EXISTS occurrences (
        id TEXT PRIMARY KEY NOT NULL,
        rdo_id TEXT NOT NULL,
        title TEXT NOT NULL,
        occurred_at TEXT,
        location TEXT,
        description TEXT,
        impact TEXT NOT NULL DEFAULT 'none',
        action_taken TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (rdo_id) REFERENCES rdos(id) ON DELETE CASCADE
      );

      -- Observations
      CREATE TABLE IF NOT EXISTS rdo_observations (
        id TEXT PRIMARY KEY NOT NULL,
        rdo_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (rdo_id) REFERENCES rdos(id) ON DELETE CASCADE
      );

      -- Photographs
      CREATE TABLE IF NOT EXISTS photographs (
        id TEXT PRIMARY KEY NOT NULL,
        rdo_id TEXT NOT NULL,
        file_uri TEXT NOT NULL,
        thumbnail_uri TEXT,
        caption TEXT,
        location TEXT,
        type TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (rdo_id) REFERENCES rdos(id) ON DELETE CASCADE
      );

      -- App Settings
      CREATE TABLE IF NOT EXISTS app_settings (
        id TEXT PRIMARY KEY NOT NULL,
        key TEXT NOT NULL UNIQUE,
        value TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);
  },
};
