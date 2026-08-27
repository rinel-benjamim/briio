import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { getPdfsDir } from "@/storage/filesystem";
import { useRdoRepository } from "@/repositories/rdo.repository";
import { useProjectRepository } from "@/repositories/project.repository";
import { useWeatherRepository } from "@/repositories/weather.repository";
import { useWorkforceRepository } from "@/repositories/workforce.repository";
import { useMaterialRepository } from "@/repositories/material.repository";
import { useEquipmentRepository } from "@/repositories/equipment.repository";
import { useTaskRepository } from "@/repositories/task.repository";
import { useOccurrenceRepository } from "@/repositories/occurrence.repository";
import { useObservationRepository } from "@/repositories/observation.repository";
import { usePhotographRepository } from "@/repositories/photograph.repository";

export type RdoData = {
  number: string;
  date: string;
  projectName: string;
  projectLocation: string;
  author: string;
  weather?: {
    morning?: string;
    afternoon?: string;
    night?: string;
  };
  workforce?: {
    totalWorkers: number;
    totalHours: number;
  };
  materials?: {
    name: string;
    quantity: string;
    unit: string;
  }[];
  equipment?: {
    name: string;
    quantity: number;
    state: string;
  }[];
  tasks?: {
    description: string;
    location: string;
    progress: number;
    state: string;
  }[];
  occurrences?: {
    title: string;
    time: string;
    location: string;
    description: string;
    impact: string;
  }[];
  observations?: string;
  photos?: {
    caption: string;
    type: string;
  }[];
};

function formatReportDate(isoDate: string): string {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const d = new Date(isoDate + "T00:00:00");
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

const WEATHER_LABELS: Record<string, string> = {
  sunny: "Ensolarado",
  cloudy: "Nublado",
  rain: "Chuvoso",
};

const TASK_STATUS_LABELS: Record<string, string> = {
  in_progress: "Em execução",
  completed: "Concluída",
  paused: "Parada",
};

const OCCURRENCE_IMPACT_LABELS: Record<string, string> = {
  none: "Sem impacto",
  low: "Leve",
  relevant: "Relevante",
  stoppage: "Paragem",
};

export function useRdoDataFetcher() {
  const rdoRepo = useRdoRepository();
  const projectRepo = useProjectRepository();
  const weatherRepo = useWeatherRepository();
  const workforceRepo = useWorkforceRepository();
  const materialRepo = useMaterialRepository();
  const equipmentRepo = useEquipmentRepository();
  const taskRepo = useTaskRepository();
  const occurrenceRepo = useOccurrenceRepository();
  const observationRepo = useObservationRepository();
  const photographRepo = usePhotographRepository();

  async function fetchRdoData(rdoId: string): Promise<RdoData> {
    const rdo = await rdoRepo.findById(rdoId);
    if (!rdo) throw new Error("RDO não encontrado");

    const project = await projectRepo.findById(rdo.project_id);

    const [weather, workforce, materials, equipment, tasks, occurrences, observation, photos] = await Promise.all([
      weatherRepo.findByRdoId(rdoId),
      workforceRepo.findByRdoId(rdoId),
      materialRepo.findByRdoId(rdoId),
      equipmentRepo.findByRdoId(rdoId),
      taskRepo.findByRdoId(rdoId),
      occurrenceRepo.findByRdoId(rdoId),
      observationRepo.findByRdoId(rdoId),
      photographRepo.findByRdoId(rdoId),
    ]);

    const weatherData: RdoData["weather"] = {};
    for (const w of weather) {
      const label = w.condition ? (WEATHER_LABELS[w.condition] || w.condition) : "Não definido";
      if (w.period === "morning") weatherData.morning = label;
      if (w.period === "afternoon") weatherData.afternoon = label;
      if (w.period === "night") weatherData.night = label;
    }

    const totalWorkers = workforce.reduce((sum, w) => sum + w.people_count, 0);
    const totalHours = workforce.reduce((sum, w) => sum + w.total_hours, 0);

    return {
      number: `RDO #${String(rdo.number).padStart(3, "0")}`,
      date: formatReportDate(rdo.report_date),
      projectName: project?.name || "Obra",
      projectLocation: project?.location || "",
      author: project?.responsible_name || "",
      weather: Object.keys(weatherData).length > 0 ? weatherData : undefined,
      workforce: workforce.length > 0 ? { totalWorkers, totalHours } : undefined,
      materials: materials.map((m) => ({
        name: m.material,
        quantity: String(m.quantity),
        unit: m.unit || "",
      })),
      equipment: equipment.map((e) => ({
        name: e.equipment,
        quantity: e.quantity,
        state: e.status || "",
      })),
      tasks: tasks.map((t) => ({
        description: t.description,
        location: t.location || "",
        progress: t.progress_percentage,
        state: TASK_STATUS_LABELS[t.status] || t.status,
      })),
      occurrences: occurrences.map((o) => ({
        title: o.title,
        time: o.occurred_at ? new Date(o.occurred_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "",
        location: o.location || "",
        description: o.description || "",
        impact: OCCURRENCE_IMPACT_LABELS[o.impact] || o.impact,
      })),
      observations: observation?.content || undefined,
      photos: photos.map((p) => ({
        caption: p.caption || "",
        type: p.type || "",
      })),
    };
  }

  return { fetchRdoData };
}

export function generateHtml(data: RdoData): string {
  const weatherRows = data.weather
    ? `
      <tr>
        <td class="label">Manhã</td>
        <td>${data.weather.morning || "—"}</td>
      </tr>
      <tr>
        <td class="label">Tarde</td>
        <td>${data.weather.afternoon || "—"}</td>
      </tr>
      <tr>
        <td class="label">Noite</td>
        <td>${data.weather.night || "—"}</td>
      </tr>`
    : "";

  const workforceRow =
    data.workforce
      ? `
      <tr>
        <td class="label">Total de trabalhadores</td>
        <td>${data.workforce.totalWorkers}</td>
      </tr>
      <tr>
        <td class="label">Horas trabalhadas</td>
        <td>${data.workforce.totalHours}h</td>
      </tr>`
      : "";

  const materialsRows = data.materials
    ?.map(
      (m) => `
      <tr>
        <td>${m.name}</td>
        <td>${m.quantity} ${m.unit}</td>
      </tr>`
    )
    .join("") || "";

  const equipmentRows = data.equipment
    ?.map(
      (e) => `
      <tr>
        <td>${e.name}</td>
        <td>${e.quantity}</td>
        <td>${e.state}</td>
      </tr>`
    )
    .join("") || "";

  const tasksRows = data.tasks
    ?.map(
      (t) => `
      <tr>
        <td>${t.description}</td>
        <td>${t.location}</td>
        <td>${t.progress}%</td>
        <td>${t.state}</td>
      </tr>`
    )
    .join("") || "";

  const occurrencesRows = data.occurrences
    ?.map(
      (o) => `
      <tr>
        <td>${o.title}</td>
        <td>${o.time}</td>
        <td>${o.location}</td>
        <td>${o.description}</td>
        <td>${o.impact}</td>
      </tr>`
    )
    .join("") || "";

  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, Helvetica, Arial, sans-serif; font-size: 11px; color: #1A2E22; padding: 24px; }
    .header { margin-bottom: 24px; border-bottom: 2px solid #134E32; padding-bottom: 16px; }
    .header h1 { font-size: 20px; font-weight: 700; color: #134E32; margin-bottom: 4px; }
    .header p { font-size: 12px; color: #5B6E63; margin-bottom: 4px; }
    .header .info { font-size: 11px; color: #5B6E63; }
    .header .info strong { color: #1A2E22; }
    .section { margin-bottom: 16px; }
    .section-title { font-size: 12px; font-weight: 700; color: #134E32; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; border-bottom: 1px solid #E0E6E1; padding-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    th, td { padding: 6px 8px; text-align: left; border: 1px solid #E0E6E1; font-size: 10px; }
    th { background: #E6F4EA; font-weight: 600; color: #1A2E22; }
    td.label { font-weight: 600; color: #1A2E22; width: 40%; }
    .observations { background: #E6F4EA; border: 1px solid #E0E6E1; border-radius: 6px; padding: 10px; font-size: 11px; line-height: 1.5; }
    .footer { margin-top: 24px; border-top: 1px solid #E0E6E1; padding-top: 12px; }
    .signature { text-align: center; width: 45%; display: inline-block; vertical-align: top; }
    .signature .line { border-bottom: 1px solid #1A2E22; margin-bottom: 4px; height: 30px; }
    .signature p { font-size: 10px; color: #5B6E63; }
    .signature strong { font-size: 11px; color: #1A2E22; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Relatório Diário de Obra</h1>
    <p>${data.projectName}</p>
    <div class="info">
      <strong>${data.number}</strong><br>
      ${data.date}<br>
      ${data.projectLocation}
    </div>
  </div>

  ${
    data.weather
      ? `
  <div class="section">
    <div class="section-title">Condições do Dia</div>
    <table>
      <thead><tr><th>Período</th><th>Condição</th></tr></thead>
      <tbody>${weatherRows}</tbody>
    </table>
  </div>`
      : ""
  }

  ${
    data.workforce
      ? `
  <div class="section">
    <div class="section-title">Mão de Obra</div>
    <table>
      <tbody>${workforceRow}</tbody>
    </table>
  </div>`
      : ""
  }

  ${
    materialsRows
      ? `
  <div class="section">
    <div class="section-title">Materiais</div>
    <table>
      <thead><tr><th>Material</th><th>Quantidade</th></tr></thead>
      <tbody>${materialsRows}</tbody>
    </table>
  </div>`
      : ""
  }

  ${
    equipmentRows
      ? `
  <div class="section">
    <div class="section-title">Equipamentos</div>
    <table>
      <thead><tr><th>Equipamento</th><th>Qtd</th><th>Estado</th></tr></thead>
      <tbody>${equipmentRows}</tbody>
    </table>
  </div>`
      : ""
  }

  ${
    tasksRows
      ? `
  <div class="section">
    <div class="section-title">Tarefas</div>
    <table>
      <thead><tr><th>Descrição</th><th>Local</th><th>Progresso</th><th>Estado</th></tr></thead>
      <tbody>${tasksRows}</tbody>
    </table>
  </div>`
      : ""
  }

  ${
    occurrencesRows
      ? `
  <div class="section">
    <div class="section-title">Ocorrências</div>
    <table>
      <thead><tr><th>Título</th><th>Hora</th><th>Local</th><th>Descrição</th><th>Impacto</th></tr></thead>
      <tbody>${occurrencesRows}</tbody>
    </table>
  </div>`
      : ""
  }

  ${
    data.observations
      ? `
  <div class="section">
    <div class="section-title">Observações</div>
    <div class="observations">${data.observations}</div>
  </div>`
      : ""
  }

  <div class="footer">
    <div class="signature">
      <div class="line"></div>
      <strong>${data.author}</strong>
      <p>Responsável pelo preenchimento</p>
    </div>
    <div class="signature">
      <div class="line"></div>
      <strong>Contratante</strong>
      <p>Assinatura e carimbo</p>
    </div>
  </div>
</body>
</html>`;
}

export async function generateRdoPdf(data: RdoData): Promise<string> {
  const html = generateHtml(data);

  const { base64 } = await Print.printToFileAsync({
    html,
    base64: true,
  });

  if (!base64) {
    throw new Error("Não foi possível gerar o PDF");
  }

  const pdfsDir = await getPdfsDir();
  const filename = data.number.replace(/[^a-zA-Z0-9]/g, "_") + ".pdf";
  const destUri = pdfsDir.uri + filename;
  await FileSystem.writeAsStringAsync(destUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return destUri;
}

export async function shareRdoPdf(pdfUri: string): Promise<void> {
  await Sharing.shareAsync(pdfUri, {
    mimeType: "application/pdf",
    dialogTitle: "Partilhar RDO",
  });
}

export async function openRdoPdf(pdfUri: string): Promise<void> {
  await Sharing.shareAsync(pdfUri, {
    mimeType: "application/pdf",
    dialogTitle: "Abrir PDF com...",
  });
}

export async function printRdoPdf(html: string): Promise<void> {
  await Print.printAsync({
    html,
  });
}

export async function getRdoPdfSize(pdfUri: string): Promise<string> {
  try {
    const info = await FileSystem.getInfoAsync(pdfUri);
    if (info.exists && info.size) {
      const sizeMB = (info.size / (1024 * 1024)).toFixed(1);
      return `${sizeMB} MB`;
    }
    return "Desconhecido";
  } catch {
    return "Desconhecido";
  }
}
