import { useState, useEffect, useCallback } from "react";
import { useRdoService, type RdoOverview } from "@/services/rdo.service";
import type { RDO } from "@/types";

export function useRdoList(projectId?: string) {
  const service = useRdoService();
  const [rdos, setRdos] = useState<RDO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = projectId
        ? await service.getByProjectId(projectId)
        : await service.getAll();
      setRdos(data);
    } catch (e: any) {
      setError(e.message || "Erro ao carregar RDOs");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rdos, loading, error, refresh };
}

export function useRdo(id: string | null) {
  const service = useRdoService();
  const [rdo, setRdo] = useState<RDO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!id) {
      setRdo(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await service.getById(id);
      setRdo(data);
    } catch (e: any) {
      setError(e.message || "Erro ao carregar RDO");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rdo, loading, error, refresh };
}

export function useRdoOverview(id: string | null) {
  const service = useRdoService();
  const [overview, setOverview] = useState<RdoOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!id) {
      setOverview(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await service.getOverview(id);
      setOverview(data);
    } catch (e: any) {
      setError(e.message || "Erro ao carregar overview do RDO");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { overview, loading, error, refresh };
}

export function useCreateRdo() {
  const service = useRdoService();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (projectId: string, reportDate: string) => {
    try {
      setLoading(true);
      setError(null);
      const rdo = await service.create({
        project_id: projectId,
        report_date: reportDate,
      });
      return rdo;
    } catch (e: any) {
      setError(e.message || "Erro ao criar RDO");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}
