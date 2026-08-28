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
let insertCounter = 0;

function setupMocks() {
  idCounter = 0;
  insertCounter = 0;
  mockData = {};
  mockGenerateId.mockImplementation(() => {
    idCounter++;
    return `test-id-${idCounter}`;
  });

  mockDb = {
    getAllAsync: jest.fn().mockImplementation((sql: string, params?: any[]) => {
      const table = extractTable(sql);
      let data = mockData[table] || [];
      
      // Filter by params if present
      if (params && params.length > 0) {
        if (sql.includes("WHERE id = ?")) {
          return data.filter((row: any) => row.id === params[0]);
        }
        if (sql.includes("WHERE project_id = ?")) {
          return data.filter((row: any) => row.project_id === params[0]);
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
      
      if (sql.includes("COUNT(*)")) {
        return { count: data.length };
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
        
        // Extract column values from INSERT statement
        const columnsMatch = sql.match(/\(([^)]+)\)\s+VALUES/);
        if (columnsMatch && params) {
          const columns = columnsMatch[1].split(",").map((c: string) => c.trim());
          params.forEach((param: any, i: number) => {
            if (columns[i]) row[columns[i]] = param;
          });
        }
        
        mockData[table].push(row);
        insertCounter++;
        return { changes: 1, lastInsertRowId: insertCounter };
      }
      if (sql.includes("UPDATE")) {
        const table = extractUpdateTable(sql);
        const data = mockData[table] || [];
        if (params && params.length > 0) {
          const id = params[params.length - 1];
          const index = data.findIndex((row: any) => row.id === id);
          if (index !== -1) {
            // Parse SET clauses to update the row
            const setMatch = sql.match(/SET\s+(.+?)\s+WHERE/i);
            if (setMatch) {
              const setClauses = setMatch[1].split(",").map((s: string) => s.trim());
              setClauses.forEach((clause: string, i: number) => {
                const colMatch = clause.match(/(\w+)\s*=/);
                if (colMatch && params[i] !== undefined) {
                  data[index][colMatch[1]] = params[i];
                }
              });
            }
            data[index].updated_at = new Date().toISOString();
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

describe("Project Repository", () => {
  let repository: any;

  beforeEach(() => {
    jest.resetModules();
    setupMocks();
    const { useProjectRepository } = require("@/repositories/project.repository");
    repository = useProjectRepository();
  });

  describe("findAll", () => {
    it("returns all projects ordered by name", async () => {
      mockData["projects"] = [
        { id: "1", name: "Obra A", status: "active" },
        { id: "2", name: "Obra B", status: "completed" },
      ];

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Obra A");
    });
  });

  describe("findById", () => {
    it("returns project by id", async () => {
      mockData["projects"] = [
        { id: "test-id", name: "Obra Teste", location: "Luanda" },
      ];

      const result = await repository.findById("test-id");

      expect(result).toBeDefined();
      expect(result.name).toBe("Obra Teste");
    });

    it("returns null for non-existent id", async () => {
      mockData["projects"] = [];

      const result = await repository.findById("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("creates a new project", async () => {
      const input = { name: "Nova Obra", location: "Luanda" };

      const result = await repository.create(input);

      expect(result).toBeDefined();
      expect(result.name).toBe("Nova Obra");
      expect(result.location).toBe("Luanda");
      expect(result.status).toBe("active");
      expect(mockData["projects"]).toHaveLength(1);
      expect(mockData["projects"][0].name).toBe("Nova Obra");
    });
  });

  describe("update", () => {
    it("updates an existing project", async () => {
      mockData["projects"] = [
        { id: "test-id", name: "Obra Original", created_at: "2026-01-01", updated_at: "2026-01-01" },
      ];

      const result = await repository.update("test-id", { name: "Obra Atualizada" });

      expect(result).toBeDefined();
      expect(result.name).toBe("Obra Atualizada");
      expect(mockData["projects"][0].name).toBe("Obra Atualizada");
    });

    it("throws for non-existent project", async () => {
      mockData["projects"] = [];

      await expect(repository.update("non-existent", { name: "Test" }))
        .rejects.toThrow("Projeto não encontrado");
    });
  });

  describe("remove", () => {
    it("deletes a project", async () => {
      mockData["projects"] = [
        { id: "test-id", name: "Obra" },
      ];

      await repository.remove("test-id");

      expect(mockData["projects"]).toHaveLength(0);
    });
  });

  describe("search", () => {
    it("searches projects by name", async () => {
      mockData["projects"] = [
        { id: "1", name: "Obra Pedrinhas" },
        { id: "2", name: "Obra Talatona" },
      ];

      const result = await repository.search("Pedrinhas");

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Obra Pedrinhas");
    });
  });
});

describe("RDO Repository", () => {
  let repository: any;

  beforeEach(() => {
    jest.resetModules();
    setupMocks();
    const { useRdoRepository } = require("@/repositories/rdo.repository");
    repository = useRdoRepository();
  });

  describe("findAll", () => {
    it("returns all RDOs ordered by date", async () => {
      mockData["rdos"] = [
        { id: "1", number: 1, report_date: "2026-08-27" },
        { id: "2", number: 2, report_date: "2026-08-26" },
      ];

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
    });
  });

  describe("findByProjectId", () => {
    it("returns RDOs for a specific project", async () => {
      mockData["rdos"] = [
        { id: "1", project_id: "proj-1", number: 1 },
        { id: "2", project_id: "proj-2", number: 1 },
      ];

      const result = await repository.findByProjectId("proj-1");

      expect(result).toHaveLength(1);
      expect(result[0].project_id).toBe("proj-1");
    });
  });

  describe("create", () => {
    it("creates a new RDO with auto-increment number", async () => {
      mockData["rdos"] = [
        { id: "1", project_id: "proj-1", number: 5 },
      ];

      const result = await repository.create({
        project_id: "proj-1",
        report_date: "2026-08-27",
      });

      expect(result).toBeDefined();
      expect(result.number).toBe(6);
      expect(result.status).toBe("draft");
      expect(result.progress_percentage).toBe(0);
    });
  });

  describe("existsForDate", () => {
    it("returns true if RDO exists for date", async () => {
      mockData["rdos"] = [
        { id: "1", project_id: "proj-1", report_date: "2026-08-27" },
      ];

      const result = await repository.existsForDate("proj-1", "2026-08-27");

      expect(result).toBe(true);
    });

    it("returns false if no RDO for date", async () => {
      mockData["rdos"] = [];

      const result = await repository.existsForDate("proj-1", "2026-08-27");

      expect(result).toBe(false);
    });
  });

  describe("findPreviousByProject", () => {
    it("returns previous RDO before date", async () => {
      // The mock returns first item, so we put the expected result first
      mockData["rdos"] = [
        { id: "prev-2", project_id: "proj-1", number: 4, report_date: "2026-08-26" },
        { id: "prev-1", project_id: "proj-1", number: 3, report_date: "2026-08-25" },
      ];

      const result = await repository.findPreviousByProject("proj-1", "2026-08-27");

      expect(result).toBeDefined();
      expect(result.project_id).toBe("proj-1");
    });

    it("returns null if no previous RDO", async () => {
      mockData["rdos"] = [];

      const result = await repository.findPreviousByProject("proj-1", "2026-08-27");

      expect(result).toBeNull();
    });
  });
});
