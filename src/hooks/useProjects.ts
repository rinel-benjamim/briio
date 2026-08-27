import { useState, useEffect, useCallback } from "react";
import { useProjectService, type UpdateProjectInput } from "@/services/project.service";
import type { Project, ProjectStatus } from "@/types";

export function useProjects() {
  const service = useProjectService();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.getAll();
      setProjects(data);
    } catch (e: any) {
      setError(e.message || "Erro ao carregar obras");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (input: { name: string; reference?: string; location?: string; province?: string; start_date?: string; expected_end_date?: string; responsible_name?: string; client_name?: string; contractor_name?: string; inspector_name?: string }) => {
    const project = await service.createProject(input);
    await refresh();
    return project;
  }, [refresh]);

  const update = useCallback(async (id: string, input: UpdateProjectInput) => {
    const project = await service.updateProject(id, input);
    await refresh();
    return project;
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await service.deleteProject(id);
    await refresh();
  }, [refresh]);

  const archive = useCallback(async (id: string) => {
    const project = await service.archiveProject(id);
    await refresh();
    return project;
  }, [refresh]);

  return {
    projects,
    loading,
    error,
    refresh,
    create,
    update,
    remove,
    archive,
  };
}

export function useProject(id: string | null) {
  const service = useProjectService();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!id) {
      setProject(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await service.getById(id);
      setProject(data);
    } catch (e: any) {
      setError(e.message || "Erro ao carregar obra");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = useCallback(async (input: UpdateProjectInput) => {
    if (!id) throw new Error("ID não fornecido");
    const updated = await service.updateProject(id, input);
    setProject(updated);
    return updated;
  }, [id]);

  return {
    project,
    loading,
    error,
    refresh,
    update,
  };
}
