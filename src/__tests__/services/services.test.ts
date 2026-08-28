import { generateId } from "@/utils/uuid";

// Mock uuid module
jest.mock("@/utils/uuid", () => ({
  generateId: jest.fn(),
}));

// Mock expo-sqlite
jest.mock("expo-sqlite", () => ({
  useSQLiteContext: jest.fn(),
}));

const mockGenerateId = generateId as jest.Mock;
let idCounter = 0;
let mockDb: any;
let mockData: Record<string, any[]> = {};

function setupMocks() {
  idCounter = 0;
  mockData = {};
  mockGenerateId.mockImplementation(() => {
    idCounter++;
    return `test-id-${idCounter}`;
  });

  mockDb = {
    getAllAsync: jest.fn().mockImplementation((sql: string, params?: any[]) => {
      const table = extractTable(sql);
      let data = mockData[table] || [];
      
      if (params && params.length > 0) {
        if (sql.includes("WHERE id = ?")) {
          return data.filter((row: any) => row.id === params[0]);
        }
        if (sql.includes("WHERE project_id = ?")) {
          return data.filter((row: any) => row.project_id === params[0]);
        }
        if (sql.includes("WHERE rdo_id = ?")) {
          return data.filter((row: any) => row.rdo_id === params[0]);
        }
        if (sql.includes("LIKE")) {
          return data.filter((row: any) => 
            row.name && row.name.toLowerCase().includes(params[0].toLowerCase().replace(/%/g, ""))
          );
        }
      }
      return data;
    }),
    getFirstAsync: jest.fn().mockImplementation((sql: string, params?: any[]) => {
      const table = extractTable(sql);
      let data = mockData[table] || [];
      
      if (sql.includes("MAX(number)")) {
        const projectId = params?.[0];
        const projectRdos = data.filter((r: any) => r.project_id === projectId);
        const maxNum = projectRdos.reduce((max: number, r: any) => Math.max(max, r.number || 0), 0);
        return { max_num: maxNum };
      }
      
      if (sql.includes("COUNT(*) as count FROM projects")) {
        const statusMatch = sql.match(/WHERE status = '(\w+)'/);
        if (statusMatch) {
          const status = statusMatch[1];
          const count = data.filter((p: any) => p.status === status).length;
          return { count };
        }
        return { count: data.length };
      }
      
      if (sql.includes("COUNT(*)") && sql.includes("project_id") && sql.includes("report_date")) {
        const projectId = params?.[0];
        const reportDate = params?.[1];
        const count = data.filter((r: any) => 
          r.project_id === projectId && r.report_date === reportDate
        ).length;
        return { count };
      }
      
      if (params && params.length > 0 && sql.includes("WHERE id = ?")) {
        return data.find((row: any) => row.id === params[0]) || null;
      }
      
      return data[0] || null;
    }),
    runAsync: jest.fn().mockImplementation((sql: string, params?: any[]) => {
      if (sql.includes("INSERT")) {
        const table = extractInsertTable(sql);
        if (!mockData[table]) mockData[table] = [];
        const id = params?.[0] || `mock-id-${Date.now()}`;
        const now = new Date().toISOString();
        const row: any = { id, created_at: now, updated_at: now };
        
        const columnsMatch = sql.match(/\(([^)]+)\)\s+VALUES/);
        if (columnsMatch && params) {
          const columns = columnsMatch[1].split(",").map((c: string) => c.trim());
          params.forEach((param: any, i: number) => {
            if (columns[i]) row[columns[i]] = param;
          });
        }
        
        mockData[table].push(row);
        return { changes: 1 };
      }
      if (sql.includes("UPDATE")) {
        const table = extractUpdateTable(sql);
        const data = mockData[table] || [];
        
        // Extract SET clauses
        const setMatch = sql.match(/SET\s+(.+?)\s+WHERE/i);
        if (setMatch && params) {
          const setClauses = setMatch[1].split(",").map((s: string) => s.trim());
          const setValues: any[] = [];
          
          setClauses.forEach((clause: string) => {
            const placeholderMatch = clause.match(/\?\s*$/);
            if (placeholderMatch) {
              setValues.push(params[setValues.length]);
            }
          });
          
          // Find the record to update
          const whereIndex = sql.indexOf("WHERE");
          const whereClause = sql.substring(whereIndex);
          const idMatch = whereClause.match(/id\s*=\s*\?/);
          if (idMatch) {
            const idValue = params[params.length - 1];
            const index = data.findIndex((row: any) => row.id === idValue);
            if (index !== -1) {
              setClauses.forEach((clause: string, i: number) => {
                const colMatch = clause.match(/(\w+)\s*=/);
                if (colMatch && i < setValues.length) {
                  data[index][colMatch[1]] = setValues[i];
                }
              });
              data[index].updated_at = new Date().toISOString();
            }
          }
        }
        
        return { changes: 1 };
      }
      if (sql.includes("DELETE")) {
        const table = extractDeleteTable(sql);
        const data = mockData[table] || [];
        if (params && params.length > 0) {
          const id = params[0];
          const index = data.findIndex((row: any) => row.id === id);
          if (index !== -1) data.splice(index, 1);
        }
        return { changes: 1 };
      }
      return { changes: 0 };
    }),
    withTransactionAsync: jest.fn().mockImplementation(async (fn: () => Promise<void>) => {
      await fn();
    }),
  };

  const expoSqlite = require("expo-sqlite");
  expoSqlite.useSQLiteContext.mockReturnValue(mockDb);
}

function extractTable(sql: string): string {
  const match = sql.match(/FROM\s+(\w+)/i);
  return match ? match[1] : "";
}

function extractInsertTable(sql: string): string {
  const match = sql.match(/INTO\s+(\w+)/i);
  return match ? match[1] : "";
}

function extractUpdateTable(sql: string): string {
  const match = sql.match(/UPDATE\s+(\w+)/i);
  return match ? match[1] : "";
}

function extractDeleteTable(sql: string): string {
  const match = sql.match(/FROM\s+(\w+)/i);
  return match ? match[1] : "";
}

describe("Project Service", () => {
  let service: any;

  beforeEach(() => {
    jest.resetModules();
    setupMocks();
    const { useProjectService } = require("@/services/project.service");
    service = useProjectService();
  });

  describe("getAll", () => {
    it("returns all projects", async () => {
      mockData["projects"] = [
        { id: "1", name: "Obra A", status: "active" },
        { id: "2", name: "Obra B", status: "completed" },
      ];

      const result = await service.getAll();

      expect(result).toHaveLength(2);
    });
  });

  describe("getById", () => {
    it("returns project by id", async () => {
      mockData["projects"] = [
        { id: "test-id", name: "Obra Teste" },
      ];

      const result = await service.getById("test-id");

      expect(result).toBeDefined();
      expect(result.name).toBe("Obra Teste");
    });

    it("returns null for non-existent id", async () => {
      mockData["projects"] = [];

      const result = await service.getById("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("createProject", () => {
    it("creates a new project", async () => {
      const result = await service.createProject({ name: "Nova Obra" });

      expect(result).toBeDefined();
      expect(result.name).toBe("Nova Obra");
      expect(result.status).toBe("active");
    });

    it("throws for empty name", async () => {
      await expect(service.createProject({ name: "" }))
        .rejects.toThrow("Nome da obra é obrigatório");
    });
  });

  describe("updateProject", () => {
    it("updates an existing project", async () => {
      mockData["projects"] = [
        { id: "test-id", name: "Obra Original", created_at: "2026-01-01", updated_at: "2026-01-01" },
      ];

      const result = await service.updateProject("test-id", { name: "Obra Atualizada" });

      expect(result).toBeDefined();
      expect(result.name).toBe("Obra Atualizada");
    });

    it("throws for non-existent project", async () => {
      mockData["projects"] = [];

      await expect(service.updateProject("non-existent", { name: "Test" }))
        .rejects.toThrow("Obra não encontrada");
    });
  });

  describe("deleteProject", () => {
    it("deletes a project", async () => {
      mockData["projects"] = [
        { id: "test-id", name: "Obra" },
      ];

      await service.deleteProject("test-id");

      expect(mockData["projects"]).toHaveLength(0);
    });

    it("throws for non-existent project", async () => {
      mockData["projects"] = [];

      await expect(service.deleteProject("non-existent"))
        .rejects.toThrow("Obra não encontrada");
    });
  });

  describe("archiveProject", () => {
    it("archives a project", async () => {
      mockData["projects"] = [
        { id: "test-id", name: "Obra", status: "active" },
      ];

      const result = await service.archiveProject("test-id");

      expect(result).toBeDefined();
      expect(result.status).toBe("archived");
      expect(mockData["projects"][0].status).toBe("archived");
    });
  });
});

describe("RDO Service", () => {
  let service: any;

  beforeEach(() => {
    jest.resetModules();
    setupMocks();
    const { useRdoService } = require("@/services/rdo.service");
    service = useRdoService();
  });

  describe("getAll", () => {
    it("returns all RDOs", async () => {
      mockData["rdos"] = [
        { id: "1", number: 1, report_date: "2026-08-27" },
        { id: "2", number: 2, report_date: "2026-08-26" },
      ];

      const result = await service.getAll();

      expect(result).toHaveLength(2);
    });
  });

  describe("getById", () => {
    it("returns RDO by id", async () => {
      mockData["rdos"] = [
        { id: "test-id", number: 1 },
      ];

      const result = await service.getById("test-id");

      expect(result).toBeDefined();
      expect(result.number).toBe(1);
    });
  });

  describe("getByProjectId", () => {
    it("returns RDOs for a project", async () => {
      mockData["rdos"] = [
        { id: "1", project_id: "proj-1", number: 1 },
        { id: "2", project_id: "proj-2", number: 1 },
      ];

      const result = await service.getByProjectId("proj-1");

      expect(result).toHaveLength(1);
      expect(result[0].project_id).toBe("proj-1");
    });
  });

  describe("create", () => {
    it("creates a new RDO", async () => {
      mockData["rdos"] = [];

      const result = await service.create({
        project_id: "proj-1",
        report_date: "2026-08-27",
      });

      expect(result).toBeDefined();
      expect(result.status).toBe("draft");
    });

    it("throws for duplicate date", async () => {
      mockData["rdos"] = [
        { id: "1", project_id: "proj-1", report_date: "2026-08-27" },
      ];

      await expect(service.create({
        project_id: "proj-1",
        report_date: "2026-08-27",
      })).rejects.toThrow("Já existe um RDO para esta data nesta obra");
    });
  });

  describe("markAsCompleted", () => {
    it("marks RDO as completed", async () => {
      mockData["rdos"] = [
        { id: "rdo-1", status: "draft" },
      ];

      const result = await service.markAsCompleted("rdo-1");

      expect(result).toBeDefined();
      expect(result.status).toBe("completed");
      expect(mockData["rdos"][0].status).toBe("completed");
    });
  });
});
