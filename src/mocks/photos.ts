export interface PhotoItem {
  id: string;
  caption: string;
}

export const MOCK_PHOTOS: PhotoItem[] = [
  { id: "1", caption: "Frente — Bloco A" },
  { id: "2", caption: "Alvenaria — Piso 2" },
  { id: "3", caption: "Revestimento — Piso 1" },
  { id: "4", caption: "Área comum" },
  { id: "5", caption: "Equipamentos no local" },
  { id: "6", caption: "Estado geral da obra" },
];

export type PhotoType = "execucao" | "material" | "equipamento" | "estado_obra" | "outro";

export const PHOTO_TYPES: { value: PhotoType; label: string }[] = [
  { value: "execucao", label: "Execução" },
  { value: "material", label: "Material" },
  { value: "equipamento", label: "Equipamento" },
  { value: "estado_obra", label: "Estado da obra" },
  { value: "outro", label: "Outro" },
];

export interface PhotoData {
  caption: string;
  type: PhotoType;
}

export const MOCK_PHOTOS_DATA: Record<string, PhotoData> = {};
