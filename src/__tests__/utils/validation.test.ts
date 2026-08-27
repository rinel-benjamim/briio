import {
  validate,
  hasErrors,
  getFirstError,
  projectValidation,
  workforceValidation,
  materialValidation,
  equipmentValidation,
  taskValidation,
  occurrenceValidation,
} from "@/utils/validation";

describe("validate", () => {
  it("returns no errors for valid data", () => {
    const errors = validate(projectValidation, { name: "Obra Teste" });
    expect(hasErrors(errors)).toBe(false);
  });

  it("returns error for missing required field", () => {
    const errors = validate(projectValidation, { name: "" });
    expect(hasErrors(errors)).toBe(true);
    expect(errors.name).toBe("Nome da obra é obrigatório");
  });

  it("returns error for string exceeding maxLength", () => {
    const errors = validate(projectValidation, { name: "Obra", reference: "a".repeat(101) });
    expect(hasErrors(errors)).toBe(true);
    expect(errors.reference).toBe("Máximo de 100 caracteres");
  });

  it("returns no errors for optional empty fields", () => {
    const errors = validate(projectValidation, { name: "Obra", reference: "" });
    expect(hasErrors(errors)).toBe(false);
  });
});

describe("workforceValidation", () => {
  it("returns errors for missing role", () => {
    const errors = validate(workforceValidation, { role: "", worker_name: "João", worker_count: 5 });
    expect(errors.role).toBe("Função é obrigatória");
  });

  it("returns errors for missing worker_name", () => {
    const errors = validate(workforceValidation, { role: "Pedreiro", worker_name: "", worker_count: 5 });
    expect(errors.worker_name).toBe("Nome do trabalhador é obrigatório");
  });

  it("returns error for worker_count < 1", () => {
    const errors = validate(workforceValidation, { role: "Pedreiro", worker_name: "João", worker_count: 0 });
    expect(errors.worker_count).toBe("Quantidade mínima: 1");
  });

  it("returns no errors for valid data", () => {
    const errors = validate(workforceValidation, { role: "Pedreiro", worker_name: "João", worker_count: 5 });
    expect(hasErrors(errors)).toBe(false);
  });
});

describe("materialValidation", () => {
  it("returns errors for missing material_name", () => {
    const errors = validate(materialValidation, { material_name: "", quantity: 10, unit: "kg" });
    expect(errors.material_name).toBe("Nome do material é obrigatório");
  });

  it("returns errors for missing quantity", () => {
    const errors = validate(materialValidation, { material_name: "Cimento", quantity: undefined, unit: "kg" });
    expect(errors.quantity).toBe("Quantidade é obrigatória");
  });

  it("returns no errors for valid data", () => {
    const errors = validate(materialValidation, { material_name: "Cimento", quantity: 10, unit: "kg" });
    expect(hasErrors(errors)).toBe(false);
  });
});

describe("equipmentValidation", () => {
  it("returns errors for missing equipment_name", () => {
    const errors = validate(equipmentValidation, { equipment_name: "", equipment_count: 1 });
    expect(errors.equipment_name).toBe("Nome do equipamento é obrigatório");
  });

  it("returns error for equipment_count < 1", () => {
    const errors = validate(equipmentValidation, { equipment_name: "Betoneira", equipment_count: 0 });
    expect(errors.equipment_count).toBe("Quantidade mínima: 1");
  });

  it("returns no errors for valid data", () => {
    const errors = validate(equipmentValidation, { equipment_name: "Betoneira", equipment_count: 1 });
    expect(hasErrors(errors)).toBe(false);
  });
});

describe("taskValidation", () => {
  it("returns errors for missing activity_name", () => {
    const errors = validate(taskValidation, { activity_name: "", status: "in_progress" });
    expect(errors.activity_name).toBe("Nome da tarefa é obrigatório");
  });

  it("returns errors for missing status", () => {
    const errors = validate(taskValidation, { activity_name: "Fundação", status: "" });
    expect(errors.status).toBe("Estado é obrigatório");
  });

  it("returns no errors for valid data", () => {
    const errors = validate(taskValidation, { activity_name: "Fundação", status: "in_progress" });
    expect(hasErrors(errors)).toBe(false);
  });
});

describe("occurrenceValidation", () => {
  it("returns errors for missing occurrence_type", () => {
    const errors = validate(occurrenceValidation, { occurrence_type: "", description: "Chuva forte" });
    expect(errors.occurrence_type).toBe("Tipo de ocorrência é obrigatório");
  });

  it("returns errors for missing description", () => {
    const errors = validate(occurrenceValidation, { occurrence_type: "Weather", description: "" });
    expect(errors.description).toBe("Descrição é obrigatória");
  });

  it("returns no errors for valid data", () => {
    const errors = validate(occurrenceValidation, { occurrence_type: "Weather", description: "Chuva forte" });
    expect(hasErrors(errors)).toBe(false);
  });
});

describe("hasErrors", () => {
  it("returns false for empty object", () => {
    expect(hasErrors({})).toBe(false);
  });

  it("returns true for non-empty object", () => {
    expect(hasErrors({ name: "Error" })).toBe(true);
  });
});

describe("getFirstError", () => {
  it("returns null for empty errors", () => {
    expect(getFirstError({})).toBeNull();
  });

  it("returns first error message", () => {
    const errors = { name: "Required", email: "Invalid" };
    expect(getFirstError(errors)).toBe("Required");
  });
});
