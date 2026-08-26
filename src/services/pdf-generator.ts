import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { getPdfsDir } from "@/storage/filesystem";

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

  const { base64, numberOfPages } = await Print.printToFileAsync({
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

export function getMockRdoData(): RdoData {
  return {
    number: "RDO #032",
    date: "12 Agosto 2026",
    projectName: "Reabilitação Pedrinhas",
    projectLocation: "Zango 1 — Icolo e Bengo",
    author: "Kiali Rodrigues",
    weather: {
      morning: "Ensolarado, 28°C",
      afternoon: "Parcialmente nublado, 32°C",
      night: "Limpo, 22°C",
    },
    workforce: {
      totalWorkers: 7,
      totalHours: 56,
    },
    materials: [
      { name: "Cimento CP II", quantity: "50", unit: "sacos" },
      { name: "Areia média", quantity: "10", unit: "m³" },
      { name: "Brita 1", quantity: "8", unit: "m³" },
    ],
    equipment: [
      { name: "Betoneira 400L", quantity: 1, state: "Bom" },
      { name: "Retroescavadeira", quantity: 1, state: "Bom" },
    ],
    tasks: [
      {
        description: "Fundação da laje de estacionamento",
        location: "Bloco A — Setor 1",
        progress: 75,
        state: "Em execução",
      },
      {
        description: "Instalação de tubulação sanitária",
        location: "Bloco B — Setor 2",
        progress: 40,
        state: "Em execução",
      },
    ],
    occurrences: [
      {
        title: "Atraso no fornecimento de Areia",
        time: "08:30",
        location: "Entrada do canteiro",
        description:
          "O fornecedor de areia indicou atraso de 2h devido a trânsito na EN100.",
        impact: "Leve",
      },
      {
        title: "Chuva intensa no período da tarde",
        time: "14:00",
        location: "Canteiro geral",
        description:
          "Chuva forte durou 1h30, interrompendo trabalhos no exterior.",
        impact: "Moderado",
      },
    ],
    observations:
      "Canteiro de obras em pleno funcionamento. Nenhuma ocorrência de segurança registada. Previsão de conclusão da fundação da laje até sexta-feira.",
    photos: [
      { caption: "Vista geral do canteiro", type: "Geral" },
      { caption: "Fundação Bloco A", type: "Progresso" },
      { caption: "Tubulação Bloco B", type: "Progresso" },
      { caption: "Equipe de trabalhadores", type: "Equipe" },
    ],
  };
}
