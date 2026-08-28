import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { type PropsWithChildren } from "react";
import { DATABASE_NAME } from "@/constants/database";
import { runMigrations, allMigrations } from "./migrations";

async function onInit(db: SQLiteDatabase) {
  await runMigrations(db, allMigrations);
}

export function DatabaseProvider({ children }: PropsWithChildren) {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={onInit}>
      {children}
    </SQLiteProvider>
  );
}
