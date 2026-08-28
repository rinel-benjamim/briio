let mockDb: any = null;
let mockData: Record<string, any[]> = {};
let mockIdCounter = 0;

export function createMockDb() {
  mockData = {};
  mockIdCounter = 0;
  
  mockDb = {
    getAllAsync: async (sql: string, params?: any[]) => {
      const table = extractTable(sql);
      return mockData[table] || [];
    },
    getFirstAsync: async (sql: string, params?: any[]) => {
      const table = extractTable(sql);
      const data = mockData[table] || [];
      if (params && params.length > 0) {
        return data.find((row) => row.id === params[0]) || null;
      }
      return data[0] || null;
    },
    runAsync: async (sql: string, params?: any[]) => {
      if (sql.includes("INSERT")) {
        mockIdCounter++;
        const table = extractInsertTable(sql);
        if (!mockData[table]) mockData[table] = [];
        const id = `mock-id-${mockIdCounter}`;
        const now = new Date().toISOString();
        const row: any = { id, created_at: now, updated_at: now };
        if (params) {
          const columns = extractColumns(sql);
          params.forEach((param, i) => {
            if (columns[i]) row[columns[i]] = param;
          });
        }
        mockData[table].push(row);
        return { changes: 1, lastInsertRowId: mockIdCounter };
      }
      if (sql.includes("UPDATE")) {
        const table = extractUpdateTable(sql);
        const data = mockData[table] || [];
        if (params && params.length > 0) {
          const id = params[params.length - 1];
          const index = data.findIndex((row) => row.id === id);
          if (index !== -1) {
            data[index] = { ...data[index], updated_at: new Date().toISOString() };
          }
        }
        return { changes: 1 };
      }
      if (sql.includes("DELETE")) {
        const table = extractDeleteTable(sql);
        const data = mockData[table] || [];
        if (params && params.length > 0) {
          const id = params[0];
          const index = data.findIndex((row) => row.id === id);
          if (index !== -1) data.splice(index, 1);
        }
        return { changes: 1 };
      }
      return { changes: 0 };
    },
    withTransactionAsync: async (fn: () => Promise<void>) => {
      await fn();
    },
  };

  return mockDb;
}

export function getMockData() {
  return mockData;
}

export function clearMockData() {
  mockData = {};
  mockIdCounter = 0;
}

export function seedMockData(table: string, rows: any[]) {
  if (!mockData[table]) mockData[table] = [];
  mockData[table].push(...rows);
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

function extractColumns(sql: string): string[] {
  const match = sql.match(/\(([^)]+)\)\s+VALUES/);
  if (!match) return [];
  return match[1].split(",").map((col) => col.trim());
}
