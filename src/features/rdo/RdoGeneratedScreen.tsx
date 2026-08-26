import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CircleCheck,
  FileSearch,
  Share2,
  Download,
  Printer,
  ArrowRight,
  Clock,
  PenLine,
  FileText,
} from "lucide-react-native";
import { typography } from "@/constants/typography";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import {
  generateRdoPdf,
  generateHtml,
  shareRdoPdf,
  openRdoPdf,
  printRdoPdf,
  getRdoPdfSize,
  getMockRdoData,
  type RdoData,
} from "@/services/pdf-generator";

const tokens = {
  bgMain: "#F4F6F4",
  bgSurface: "#FFFFFF",
  primary: "#134E32",
  primaryLight: "#E6F4EA",
  textMain: "#1A2E22",
  textMuted: "#5B6E63",
  textOnBrand: "#FFFFFF",
  border: "#E0E6E1",
  success: "#137333",
  successBg: "#E6F4EA",
  warning: "#B96A00",
  warningBg: "#FFF8F0",
  overlay: "rgba(0, 0, 0, 0.3)",
};

export default function RdoGeneratedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [pdfHtml, setPdfHtml] = useState<string>("");
  const [pdfSize, setPdfSize] = useState<string>("...");
  const [isGenerating, setIsGenerating] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [generationTime] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  });

  useEffect(() => {
    generatePdf();
  }, []);

  async function generatePdf() {
    try {
      setIsGenerating(true);
      const data: RdoData = getMockRdoData();
      const html = generateHtml(data);
      setPdfHtml(html);
      const uri = await generateRdoPdf(data);
      setPdfUri(uri);
      const size = await getRdoPdfSize(uri);
      setPdfSize(size);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      Alert.alert(
        "Erro",
        `Não foi possível gerar o PDF.\n\n${message}`
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleShare() {
    if (!pdfUri) return;
    try {
      setIsSharing(true);
      await shareRdoPdf(pdfUri);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível partilhar o PDF.");
    } finally {
      setIsSharing(false);
    }
  }

  async function handlePrint() {
    if (!pdfHtml) return;
    try {
      setIsPrinting(true);
      await printRdoPdf(pdfHtml);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      Alert.alert("Erro", `Não foi possível imprimir o PDF.\n\n${message}`);
    } finally {
      setIsPrinting(false);
    }
  }

  async function handleOpenPdf() {
    if (!pdfUri) return;
    try {
      await openRdoPdf(pdfUri);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      Alert.alert("Erro", `Não foi possível abrir o PDF.\n\n${message}`);
    }
  }

  function handleViewHistory() {
    router.push(`/(tabs)/reports/${id}`);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity
          style={styles.navButton}
          onPress={() => router.replace(`/(tabs)/reports/${id}`)}
        >
          <ArrowLeft size={20} color={tokens.textMain} />
        </PressableOpacity>
        <Text style={styles.navTitle}>RDO Gerado</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successCard}>
          <CircleCheck size={22} color={tokens.success} />
          <View style={styles.successInfo}>
            <Text style={styles.successTitle}>RDO gerado com sucesso</Text>
            <Text style={styles.successSubtitle}>
              O relatório diário da obra está pronto.
            </Text>
          </View>
        </View>

        <View style={styles.reportIdentity}>
          <Text style={styles.reportNumber}>RDO #032</Text>
          <Text style={styles.reportDate}>12 Agosto 2026</Text>
          <Text style={styles.reportProject}>Reabilitação Pedrinhas</Text>
          <Text style={styles.reportLocation}>Zango 1 — Icolo e Bengo</Text>
          <View style={styles.reportFile}>
            <FileText size={14} color={tokens.textMuted} />
            <Text style={styles.fileText}>PDF · {pdfSize}</Text>
          </View>
        </View>

        <View style={styles.pdfPreview}>
          <View style={styles.pdfPage}>
            <View style={styles.pdfHeader} />
            <View style={[styles.pdfLine, { width: 192 }]} />
            <View style={[styles.pdfLine, { width: 144 }]} />
            <View style={styles.pdfSpacer} />
            <View style={styles.pdfTable}>
              <View style={styles.pdfTableRow} />
              <View style={styles.pdfTableRow} />
              <View style={styles.pdfTableRow} />
            </View>
            <View style={styles.pdfSpacer} />
            <View style={styles.pdfPhotos}>
              <View style={styles.pdfPhoto} />
              <View style={styles.pdfPhoto} />
              <View style={styles.pdfPhoto} />
              <View style={styles.pdfPhoto} />
            </View>
            <View style={styles.pdfSpacer} />
            <View style={styles.pdfSignature} />
          </View>
        </View>

        <PressableOpacity
          style={styles.openButton}
          onPress={handleOpenPdf}
          disabled={isGenerating}
        >
          <FileSearch size={16} color={tokens.textOnBrand} />
          <Text style={styles.openButtonText}>Abrir PDF</Text>
        </PressableOpacity>

        <PressableOpacity
          style={styles.primaryButton}
          onPress={handleShare}
          disabled={isGenerating || isSharing}
        >
          {isSharing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Share2 size={18} color="#FFFFFF" />
          )}
          <Text style={styles.primaryButtonText}>Partilhar PDF</Text>
        </PressableOpacity>

        <View style={styles.secondaryActions}>
          <PressableOpacity
            style={styles.secondaryButton}
            onPress={handlePrint}
            disabled={isGenerating || isPrinting}
          >
            {isPrinting ? (
              <ActivityIndicator size="small" color={tokens.textMuted} />
            ) : (
              <Printer size={16} color={tokens.textMuted} />
            )}
            <Text style={styles.secondaryButtonText}>Imprimir</Text>
          </PressableOpacity>
        </View>

        <View style={styles.reportStatus}>
          <View style={styles.statusRow}>
            <Clock size={14} color={tokens.textMuted} />
            <Text style={styles.statusText}>Gerado hoje às {generationTime}</Text>
          </View>
          <View style={styles.statusRow}>
            <PenLine size={14} color={tokens.warning} />
            <Text style={styles.statusWarning}>Assinatura física pendente</Text>
          </View>
        </View>

        <PressableOpacity
          style={styles.historyLink}
          onPress={handleViewHistory}
        >
          <Text style={styles.historyText}>Ver RDOs da obra</Text>
          <ArrowRight size={16} color={tokens.primary} />
        </PressableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.bgMain,
  },
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  navTitle: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: tokens.textMain,
    flex: 1,
  },
  spacer: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 10,
  },
  successCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: tokens.successBg,
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: tokens.success,
  },
  successInfo: {
    gap: 2,
    flex: 1,
  },
  successTitle: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: tokens.success,
  },
  successSubtitle: {
    ...typography.presets.caption,
    color: tokens.textMuted,
  },
  reportIdentity: {
    backgroundColor: tokens.bgSurface,
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: tokens.border,
  },
  reportNumber: {
    ...typography.presets.h2,
    color: tokens.textMain,
  },
  reportDate: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: tokens.textMuted,
  },
  reportProject: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: tokens.textMuted,
  },
  reportLocation: {
    ...typography.presets.caption,
    color: tokens.textMuted,
  },
  reportFile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  fileText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: tokens.textMuted,
  },
  pdfPreview: {
    backgroundColor: tokens.bgSurface,
    borderRadius: 16,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: tokens.border,
    overflow: "hidden",
  },
  pdfPage: {
    width: 180,
    height: 190,
    backgroundColor: tokens.bgSurface,
    borderRadius: 6,
    padding: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: tokens.border,
  },
  pdfHeader: {
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.primary,
  },
  pdfLine: {
    height: 6,
    borderRadius: 3,
    backgroundColor: tokens.border,
  },
  pdfSpacer: {
    height: 4,
  },
  pdfTable: {
    gap: 3,
  },
  pdfTableRow: {
    height: 10,
    borderRadius: 2,
    backgroundColor: tokens.bgSurface,
    borderWidth: 1,
    borderColor: tokens.border,
  },
  pdfPhotos: {
    flexDirection: "row",
    gap: 3,
  },
  pdfPhoto: {
    width: 40,
    height: 40,
    borderRadius: 3,
    backgroundColor: tokens.border,
  },
  pdfSignature: {
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: tokens.border,
  },
  openButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.primary,
    borderRadius: 16,
    height: 56,
    gap: 8,
  },
  openButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: tokens.textOnBrand,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.primary,
    borderRadius: 16,
    height: 56,
    gap: 8,
  },
  primaryButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: tokens.textOnBrand,
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.bgSurface,
    borderRadius: 12,
    height: 44,
    gap: 6,
    borderWidth: 1,
    borderColor: tokens.border,
  },
  secondaryButtonText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: tokens.textMuted,
  },
  reportStatus: {
    backgroundColor: tokens.bgSurface,
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: tokens.border,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusText: {
    ...typography.presets.caption,
    color: tokens.textMuted,
  },
  statusWarning: {
    ...typography.presets.caption,
    color: tokens.warning,
  },
  historyLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: tokens.bgSurface,
    borderRadius: 16,
    height: 56,
    gap: 6,
    borderWidth: 1,
    borderColor: tokens.border,
  },
  historyText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: tokens.primary,
  },
});
