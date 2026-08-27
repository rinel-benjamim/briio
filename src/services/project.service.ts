import { useSQLiteContext } from "expo-sqlite";
import { useProjectRepository, type CreateProjectInput, type UpdateProjectInput } from "@/repositories/project.repository";
import type { Project, ProjectStatus } from "@/types";

export function useProjectService() {
  const db = useSQLiteContext();
  const repo = useProjectRepository();

  async function getAll(): Promise<Project[]> {
    return repo.findAll();
  }

  async function getById(id: string): Promise<Project | null> {
    return repo.findById(id);
  }

  async function getByStatus(status: ProjectStatus): Promise<Project[]> {
    return repo.findByStatus(status);
  }

  async function searchProjects(query: string): Promise<Project[]> {
    if (!query.trim()) return repo.findAll();
    return repo.search(query.trim());
  }

  async function createProject(input: CreateProjectInput): Promise<Project> {
    if (!input.name.trim()) {
      throw new Error("Nome da obra é obrigatório");
    }
    return repo.create(input);
  }

  async function updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
    const existing = await repo.findById(id);
    if (!existing) throw new Error("Obra não encontrada");
    return repo.update(id, input);
  }

  async function deleteProject(id: string): Promise<void> {
    const existing = await repo.findById(id);
    if (!existing) throw new Error("Obra não encontrada");
    return repo.remove(id);
  }

  async function archiveProject(id: string): Promise<Project> {
    return repo.update(id, {
      status: "archived",
      archived_at: new Date().toISOString(),
    });
  }

  async function getStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    archived: number;
  }> {
    const counts = await repo.countByStatus();
    return {
      total: counts.active + counts.completed + counts.archived,
      ...counts,
    };
  }

  return {
    getAll,
    getById,
    getByStatus,
    searchProjects,
    createProject,
    updateProject,
    deleteProject,
    archiveProject,
    getStats,
  };
}
