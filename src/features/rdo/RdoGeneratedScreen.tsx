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
import {
  CheckCircle,
  Share2,
  Printer,
  FileSearch,
} from "lucide-react-native";
import { typography } from "@/constants/typography";
import { colors, borderRadius } from "@/constants";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
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
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [pdfHtml, setPdfHtml] = useState<string>("");
  const [pdfSize, setPdfSize] = useState<string>("...");
  const [isGenerating, setIsGenerating] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

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

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="RDO Gerado"
        onBack={() => router.replace(`/(tabs)/reports/${id}`)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successCard}>
          <View style={styles.successIconContainer}>
            <CheckCircle size={20} color="#FFFFFF" />
          </View>
          <View style={styles.successInfo}>
            <Text style={styles.successTitle}>Relatório concluído</Text>
            <Text style={styles.successSubtitle}>
              O seu RDO está pronto para partilhar.
            </Text>
          </View>
        </View>

        <View style={styles.reportIdentity}>
          <Text style={styles.reportNumber}>RDO #032</Text>
          <Text style={styles.reportDate}>12 Agosto 2026</Text>
          <Text style={styles.reportProject}>Reabilitação Pedrinhas</Text>
          <Text style={styles.reportLocation}>Zango 1 — Icolo e Bengo</Text>
          <View style={styles.reportFile}>
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

        <PrimaryButton
          label={isSharing ? "A partilhar..." : "Partilhar PDF"}
          onPress={handleShare}
          disabled={isGenerating || isSharing}
          loading={isSharing}
          icon={!isSharing ? <Share2 size={18} color={colors.textOnBrand} /> : undefined}
        />

        <View style={styles.buttonRow}>
          <PressableOpacity
            style={styles.secondaryButton}
            onPress={handleOpenPdf}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color={colors.textMuted} />
            ) : (
              <FileSearch size={16} color={colors.textMuted} />
            )}
            <Text style={styles.secondaryButtonText}>Abrir PDF</Text>
          </PressableOpacity>

          <PressableOpacity
            style={styles.secondaryButton}
            onPress={handlePrint}
            disabled={isGenerating || isPrinting}
          >
            {isPrinting ? (
              <ActivityIndicator size="small" color={colors.textMuted} />
            ) : (
              <Printer size={16} color={colors.textMuted} />
            )}
            <Text style={styles.secondaryButtonText}>Imprimir</Text>
          </PressableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 14,
  },
  successCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successBg,
    borderRadius: borderRadius["2xl"],
    padding: 18,
    gap: 12,
  },
  successIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.success,
    justifyContent: "center",
    alignItems: "center",
  },
  successInfo: {
    gap: 2,
    flex: 1,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: typography.fontWeight.semibold,
    color: colors.success,
  },
  successSubtitle: {
    ...typography.presets.caption,
    color: colors.textMuted,
  },
  reportIdentity: {
    backgroundColor: colors.bgSurface,
    borderRadius: borderRadius["2xl"],
    padding: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reportNumber: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.textMain,
  },
  reportDate: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  reportProject: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMain,
  },
  reportLocation: {
    ...typography.presets.caption,
    color: colors.textMuted,
  },
  reportFile: {
    alignSelf: "flex-start",
    backgroundColor: colors.warningBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginTop: 8,
  },
  fileText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.warning,
  },
  pdfPreview: {
    backgroundColor: colors.progressTrack,
    borderRadius: borderRadius["2xl"],
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  pdfPage: {
    width: 180,
    height: 190,
    backgroundColor: colors.bgSurface,
    borderRadius: borderRadius.lg,
    padding: 10,
    gap: 4,
  },
  pdfHeader: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  pdfLine: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
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
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pdfPhotos: {
    flexDirection: "row",
    gap: 3,
  },
  pdfPhoto: {
    width: 40,
    height: 40,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  pdfSignature: {
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgSurface,
    borderRadius: borderRadius["2xl"],
    height: 56,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
});
