import { useSQLiteContext } from "expo-sqlite";
import { useWorkforceRepository } from "@/repositories/workforce.repository";
import { useMaterialRepository } from "@/repositories/material.repository";
import { useEquipmentRepository } from "@/repositories/equipment.repository";
import { useTaskRepository } from "@/repositories/task.repository";

export interface ReusableDataSummary {
  workforceCount: number;
  totalHours: number;
  taskCount: number;
  materialCount: number;
  equipmentCount: number;
}

export interface ReuseOptions {
  workforce: boolean;
  tasks: boolean;
  materials: boolean;
  equipment: boolean;
}

export function useReuseService() {
  const db = useSQLiteContext();
  const workforceRepo = useWorkforceRepository();
  const materialRepo = useMaterialRepository();
  const equipmentRepo = useEquipmentRepository();
  const taskRepo = useTaskRepository();

  async function getReusableSummary(sourceRdoId: string): Promise<ReusableDataSummary> {
    const [workforce, tasks, materials, equipment] = await Promise.all([
      workforceRepo.findByRdoId(sourceRdoId),
      taskRepo.findByRdoId(sourceRdoId),
      materialRepo.findByRdoId(sourceRdoId),
      equipmentRepo.findByRdoId(sourceRdoId),
    ]);

    const totalHours = workforce.reduce((sum, w) => sum + (w.total_hours || 0), 0);

    return {
      workforceCount: workforce.length,
      totalHours,
      taskCount: tasks.length,
      materialCount: materials.length,
      equipmentCount: equipment.length,
    };
  }

  async function copyDataToNewRdo(
    sourceRdoId: string,
    targetRdoId: string,
    options: ReuseOptions
  ): Promise<void> {
    await db.withTransactionAsync(async () => {
      if (options.workforce) {
        const entries = await workforceRepo.findByRdoId(sourceRdoId);
        for (const entry of entries) {
          await workforceRepo.create(targetRdoId, {
            function: entry.function,
            people_count: entry.people_count,
            hours_per_person: entry.hours_per_person,
            observation: entry.observation ?? undefined,
          });
        }
      }

      if (options.tasks) {
        const entries = await taskRepo.findByRdoId(sourceRdoId);
        for (const entry of entries) {
          await taskRepo.create(targetRdoId, {
            description: entry.description,
            location: entry.location ?? undefined,
            quantity: entry.quantity ?? undefined,
            unit: entry.unit ?? undefined,
            progress_percentage: entry.progress_percentage,
            status: entry.status,
            observation: entry.observation ?? undefined,
          });
        }
      }

      if (options.materials) {
        const entries = await materialRepo.findByRdoId(sourceRdoId);
        for (const entry of entries) {
          await materialRepo.create(targetRdoId, {
            material: entry.material,
            quantity: entry.quantity,
            unit: entry.unit ?? undefined,
            status: entry.status,
            observation: entry.observation ?? undefined,
          });
        }
      }

      if (options.equipment) {
        const entries = await equipmentRepo.findByRdoId(sourceRdoId);
        for (const entry of entries) {
          await equipmentRepo.create(targetRdoId, {
            equipment: entry.equipment,
            quantity: entry.quantity,
            hours_used: entry.hours_used,
            status: entry.status,
            observation: entry.observation ?? undefined,
          });
        }
      }
    });
  }

  return {
    getReusableSummary,
    copyDataToNewRdo,
  };
}
