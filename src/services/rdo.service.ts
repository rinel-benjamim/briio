import { useSQLiteContext } from "expo-sqlite";
import { useRdoRepository, type CreateRdoInput } from "@/repositories/rdo.repository";
import { useWeatherRepository } from "@/repositories/weather.repository";
import { useWorkforceRepository } from "@/repositories/workforce.repository";
import { useMaterialRepository } from "@/repositories/material.repository";
import { useEquipmentRepository } from "@/repositories/equipment.repository";
import { useTaskRepository } from "@/repositories/task.repository";
import { useOccurrenceRepository } from "@/repositories/occurrence.repository";
import { useObservationRepository } from "@/repositories/observation.repository";
import { usePhotographRepository } from "@/repositories/photograph.repository";
import type { RDO, RdoStatus } from "@/types";

export type RdoSectionStatus = "empty" | "partial" | "complete";

export interface RdoOverview {
  rdo: RDO;
  sectionStatuses: {
    weather: RdoSectionStatus;
    workforce: RdoSectionStatus;
    materials: RdoSectionStatus;
    equipment: RdoSectionStatus;
    tasks: RdoSectionStatus;
    occurrences: RdoSectionStatus;
    observations: RdoSectionStatus;
    photographs: RdoSectionStatus;
  };
  completedSections: number;
  totalSections: number;
  progressPercentage: number;
}

export function useRdoService() {
  const db = useSQLiteContext();
  const rdoRepo = useRdoRepository();
  const weatherRepo = useWeatherRepository();
  const workforceRepo = useWorkforceRepository();
  const materialRepo = useMaterialRepository();
  const equipmentRepo = useEquipmentRepository();
  const taskRepo = useTaskRepository();
  const occurrenceRepo = useOccurrenceRepository();
  const observationRepo = useObservationRepository();
  const photographRepo = usePhotographRepository();

  async function getAll(): Promise<RDO[]> {
    return rdoRepo.findAll();
  }

  async function getById(id: string): Promise<RDO | null> {
    return rdoRepo.findById(id);
  }

  async function getByProjectId(projectId: string): Promise<RDO[]> {
    return rdoRepo.findByProjectId(projectId);
  }

  async function create(input: CreateRdoInput): Promise<RDO> {
    const existing = await rdoRepo.existsForDate(input.project_id, input.report_date);
    if (existing) {
      throw new Error("Já existe um RDO para esta data nesta obra");
    }
    return rdoRepo.create(input);
  }

  async function update(id: string, input: { status?: RdoStatus; progress_percentage?: number }): Promise<RDO> {
    return rdoRepo.update(id, input);
  }

  async function remove(id: string): Promise<void> {
    await db.withTransactionAsync(async () => {
      await weatherRepo.removeByRdoId(id);
      await workforceRepo.removeByRdoId(id);
      await materialRepo.removeByRdoId(id);
      await equipmentRepo.removeByRdoId(id);
      await taskRepo.removeByRdoId(id);
      await occurrenceRepo.removeByRdoId(id);
      await observationRepo.removeByRdoId(id);
      await photographRepo.removeByRdoId(id);
      await rdoRepo.remove(id);
    });
  }

  async function getOverview(id: string): Promise<RdoOverview | null> {
    const rdo = await rdoRepo.findById(id);
    if (!rdo) return null;

    const [weather, workforce, materials, equipment, tasks, occurrences, observations, photos] = await Promise.all([
      weatherRepo.findByRdoId(id),
      workforceRepo.findByRdoId(id),
      materialRepo.findByRdoId(id),
      equipmentRepo.findByRdoId(id),
      taskRepo.findByRdoId(id),
      occurrenceRepo.findByRdoId(id),
      observationRepo.findByRdoId(id),
      photographRepo.findByRdoId(id),
    ]);

    function sectionStatus(hasData: boolean, count: number): RdoSectionStatus {
      if (!hasData || count === 0) return "empty";
      return "complete";
    }

    const sectionStatuses = {
      weather: sectionStatus(weather.length > 0, weather.length),
      workforce: sectionStatus(workforce.length > 0, workforce.length),
      materials: sectionStatus(materials.length > 0, materials.length),
      equipment: sectionStatus(equipment.length > 0, equipment.length),
      tasks: sectionStatus(tasks.length > 0, tasks.length),
      occurrences: sectionStatus(occurrences.length > 0, occurrences.length),
      observations: (observations?.content ? "complete" : "empty") as RdoSectionStatus,
      photographs: sectionStatus(photos.length > 0, photos.length),
    };

    const sections = Object.values(sectionStatuses);
    const completedSections = sections.filter((s) => s === "complete").length;
    const totalSections = sections.length;
    const progressPercentage = Math.round((completedSections / totalSections) * 100);

    return {
      rdo,
      sectionStatuses,
      completedSections,
      totalSections,
      progressPercentage,
    };
  }

  async function markAsCompleted(id: string): Promise<RDO> {
    return rdoRepo.update(id, {
      status: "completed",
      completed_at: new Date().toISOString(),
    });
  }

  async function markAsGenerated(id: string, pdfUri: string): Promise<RDO> {
    return rdoRepo.update(id, {
      status: "generated",
      generated_pdf_uri: pdfUri,
      generated_at: new Date().toISOString(),
    });
  }

  return {
    getAll,
    getById,
    getByProjectId,
    create,
    update,
    remove,
    getOverview,
    markAsCompleted,
    markAsGenerated,
  };
}
