import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { type PropsWithChildren } from "react";
import { DATABASE_NAME } from "@/constants/database";
import { runMigrations } from "./migrations";
import { migration001InitialSchema } from "./migrations/001_initial_schema";

const migrations = [migration001InitialSchema];

async function onInit(db: SQLiteDatabase) {
  await runMigrations(db, migrations);
}

export function DatabaseProvider({ children }: PropsWithChildren) {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={onInit}>
      {children}
    </SQLiteProvider>
  );
}
