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
import { colors } from "@/constants/colors";
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
          <ArrowLeft size={20} color={colors.textPrimary} />
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
          <CircleCheck size={22} color="#15803D" />
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
            <FileText size={14} color={colors.textTertiary} />
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
          <FileSearch size={16} color="#FFFFFF" />
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
              <ActivityIndicator size="small" color={colors.textSecondary} />
            ) : (
              <Printer size={16} color={colors.textSecondary} />
            )}
            <Text style={styles.secondaryButtonText}>Imprimir</Text>
          </PressableOpacity>
        </View>

        <View style={styles.reportStatus}>
          <View style={styles.statusRow}>
            <Clock size={14} color={colors.textTertiary} />
            <Text style={styles.statusText}>Gerado hoje às {generationTime}</Text>
          </View>
          <View style={styles.statusRow}>
            <PenLine size={14} color="#B45309" />
            <Text style={styles.statusWarning}>Assinatura física pendente</Text>
          </View>
        </View>

        <PressableOpacity
          style={styles.historyLink}
          onPress={handleViewHistory}
        >
          <Text style={styles.historyText}>Ver RDOs da obra</Text>
          <ArrowRight size={16} color={colors.brandPrimary} />
        </PressableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceBg,
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
    color: colors.textPrimary,
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
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  successInfo: {
    gap: 2,
    flex: 1,
  },
  successTitle: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: "#15803D",
  },
  successSubtitle: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  reportIdentity: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  reportNumber: {
    ...typography.presets.h2,
    color: colors.textPrimary,
  },
  reportDate: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  reportProject: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  reportLocation: {
    ...typography.presets.caption,
    color: colors.textSecondary,
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
    color: colors.textSecondary,
  },
  pdfPreview: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
    overflow: "hidden",
  },
  pdfPage: {
    width: 180,
    height: 190,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    padding: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  pdfHeader: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brandPrimary,
  },
  pdfLine: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  pdfPhotos: {
    flexDirection: "row",
    gap: 3,
  },
  pdfPhoto: {
    width: 40,
    height: 40,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
  },
  pdfSignature: {
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  openButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    height: 56,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  openButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: "#FFFFFF",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandPrimary,
    borderRadius: 16,
    height: 56,
    gap: 8,
  },
  primaryButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: "#FFFFFF",
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
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 12,
    height: 44,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  secondaryButtonText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  reportStatus: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusText: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  statusWarning: {
    ...typography.presets.caption,
    color: "#B45309",
  },
  historyLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    height: 56,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  historyText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: "#1B3A5C",
  },
});
