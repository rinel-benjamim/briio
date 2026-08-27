export type ValidationRule<T = any> = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
  message?: string;
};

export type ValidationSchema = Record<string, ValidationRule>;

export type ValidationErrors = Record<string, string>;

export function validate(schema: ValidationSchema, data: Record<string, any>): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    if (rules.required && (value === undefined || value === null || value === "")) {
      errors[field] = rules.message || "Campo obrigatório";
      continue;
    }

    if (value === undefined || value === null || value === "") continue;

    if (rules.minLength && typeof value === "string" && value.length < rules.minLength) {
      errors[field] = rules.message || `Mínimo de ${rules.minLength} caracteres`;
      continue;
    }

    if (rules.maxLength && typeof value === "string" && value.length > rules.maxLength) {
      errors[field] = rules.message || `Máximo de ${rules.maxLength} caracteres`;
      continue;
    }

    if (rules.min !== undefined && typeof value === "number" && value < rules.min) {
      errors[field] = rules.message || `Valor mínimo: ${rules.min}`;
      continue;
    }

    if (rules.max !== undefined && typeof value === "number" && value > rules.max) {
      errors[field] = rules.message || `Valor máximo: ${rules.max}`;
      continue;
    }

    if (rules.pattern && typeof value === "string" && !rules.pattern.test(value)) {
      errors[field] = rules.message || "Formato inválido";
      continue;
    }

    if (rules.custom) {
      const error = rules.custom(value);
      if (error) {
        errors[field] = error;
      }
    }
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function getFirstError(errors: ValidationErrors): string | null {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
}

export const projectValidation: ValidationSchema = {
  name: { required: true, message: "Nome da obra é obrigatório" },
  reference: { maxLength: 100 },
  location: { maxLength: 200 },
  province: { maxLength: 100 },
  responsible_name: { maxLength: 100 },
  client_name: { maxLength: 100 },
  contractor_name: { maxLength: 100 },
  inspector_name: { maxLength: 100 },
};

export const workforceValidation: ValidationSchema = {
  role: { required: true, message: "Função é obrigatória" },
  worker_name: { required: true, message: "Nome do trabalhador é obrigatório" },
  worker_count: { required: true, min: 1, message: "Quantidade mínima: 1" },
};

export const materialValidation: ValidationSchema = {
  material_name: { required: true, message: "Nome do material é obrigatório" },
  quantity: { required: true, min: 0, message: "Quantidade é obrigatória" },
  unit: { required: true, message: "Unidade é obrigatória" },
};

export const equipmentValidation: ValidationSchema = {
  equipment_name: { required: true, message: "Nome do equipamento é obrigatório" },
  equipment_count: { required: true, min: 1, message: "Quantidade mínima: 1" },
};

export const taskValidation: ValidationSchema = {
  activity_name: { required: true, message: "Nome da tarefa é obrigatório" },
  status: { required: true, message: "Estado é obrigatório" },
};

export const occurrenceValidation: ValidationSchema = {
  occurrence_type: { required: true, message: "Tipo de ocorrência é obrigatório" },
  description: { required: true, message: "Descrição é obrigatória" },
};
