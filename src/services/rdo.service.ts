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
  counts: {
    weather: number;
    workforce: number;
    workforceHours: number;
    materials: number;
    equipment: number;
    tasks: number;
    occurrences: number;
    observations: number;
    photographs: number;
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

    const skippedSections: string[] = rdo.skipped_sections
      ? JSON.parse(rdo.skipped_sections)
      : [];

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

    function sectionStatus(key: string, hasData: boolean, count: number): RdoSectionStatus {
      if (skippedSections.includes(key)) return "complete";
      if (!hasData || count === 0) return "empty";
      return "complete";
    }

    const sectionStatuses = {
      weather: sectionStatus("weather", weather.length > 0, weather.length),
      workforce: sectionStatus("workforce", workforce.length > 0, workforce.length),
      materials: sectionStatus("materials", materials.length > 0, materials.length),
      equipment: sectionStatus("equipment", equipment.length > 0, equipment.length),
      tasks: sectionStatus("tasks", tasks.length > 0, tasks.length),
      occurrences: sectionStatus("occurrences", occurrences.length > 0, occurrences.length),
      observations: (skippedSections.includes("observations") || observations?.content) ? "complete" as RdoSectionStatus : "empty" as RdoSectionStatus,
      photographs: sectionStatus("photographs", photos.length > 0, photos.length),
    };

    const sections = Object.values(sectionStatuses);
    const completedSections = sections.filter((s) => s === "complete").length;
    const totalSections = sections.length;
    const progressPercentage = Math.round((completedSections / totalSections) * 100);

    const counts = {
      weather: weather.length,
      workforce: workforce.length,
      workforceHours: workforce.reduce((sum, w) => sum + (w.total_hours || 0), 0),
      materials: materials.length,
      equipment: equipment.length,
      tasks: tasks.length,
      occurrences: occurrences.length,
      observations: observations?.content ? 1 : 0,
      photographs: photos.length,
    };

    return {
      rdo,
      sectionStatuses,
      counts,
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

  async function toggleSkippedSection(id: string, section: string): Promise<RDO> {
    const rdo = await rdoRepo.findById(id);
    if (!rdo) throw new Error("RDO não encontrado");

    const current: string[] = rdo.skipped_sections ? JSON.parse(rdo.skipped_sections) : [];
    const updated = current.includes(section)
      ? current.filter((s) => s !== section)
      : [...current, section];

    return rdoRepo.update(id, {
      skipped_sections: updated.length > 0 ? JSON.stringify(updated) : null,
    });
  }

  async function isSectionSkipped(id: string, section: string): Promise<boolean> {
    const rdo = await rdoRepo.findById(id);
    if (!rdo || !rdo.skipped_sections) return false;
    const skipped: string[] = JSON.parse(rdo.skipped_sections);
    return skipped.includes(section);
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
    toggleSkippedSection,
    isSectionSkipped,
  };
}
