import { useState } from "react";
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
  Ellipsis,
  CircleCheck,
  CloudSun,
  Users,
  Package,
  Wrench,
  ClipboardCheck,
  TriangleAlert,
  MessageSquare,
  ChevronRight,
  ArrowRight,
  FileText,
  Share2,
  Download,
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import {
  generateRdoPdf,
  shareRdoPdf,
  openRdoPdf,
  getMockRdoData,
} from "@/services/pdf-generator";

type SectionItem = {
  id: string;
  name: string;
  summary: string;
  icon: typeof CloudSun;
  iconColor: string;
  route: string;
};

const RDO_SECTIONS: SectionItem[] = [
  { id: "1", name: "Condições do dia", summary: "Manhã · Tarde · Noite", icon: CloudSun, iconColor: colors.brandPrimary, route: "weather" },
  { id: "2", name: "Mão de obra", summary: "7 trabalhadores", icon: Users, iconColor: colors.brandPrimary, route: "workforce" },
  { id: "3", name: "Materiais", summary: "3 registos", icon: Package, iconColor: colors.brandPrimary, route: "materials" },
  { id: "4", name: "Equipamentos", summary: "3 equipamentos", icon: Wrench, iconColor: colors.brandPrimary, route: "equipment" },
  { id: "5", name: "Tarefas", summary: "2 atividades", icon: ClipboardCheck, iconColor: colors.brandPrimary, route: "tasks" },
  { id: "6", name: "Ocorrências", summary: "2 ocorrências", icon: TriangleAlert, iconColor: "#B45309", route: "occurrences" },
  { id: "7", name: "Observações", summary: "Preenchido", icon: MessageSquare, iconColor: colors.brandPrimary, route: "observations" },
];

const MOCK_PHOTOS = [
  { id: "1", caption: "Vista geral" },
  { id: "2", caption: "Fundação" },
  { id: "3", caption: "Tubulação" },
  { id: "4", caption: "Equipe" },
];

export default function RdoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [pdfLoading, setPdfLoading] = useState(false);

  async function handleOpenPdf() {
    try {
      setPdfLoading(true);
      const data = getMockRdoData();
      const pdfUri = await generateRdoPdf(data);
      await openRdoPdf(pdfUri);
    } catch (error: any) {
      Alert.alert("Erro", `Não foi possível abrir o PDF.\n\n${error.message || "Erro desconhecido"}`);
    } finally {
      setPdfLoading(false);
    }
  }

  async function handleShare() {
    try {
      setPdfLoading(true);
      const data = getMockRdoData();
      const pdfUri = await generateRdoPdf(data);
      await shareRdoPdf(pdfUri);
    } catch (error: any) {
      Alert.alert("Erro", `Não foi possível partilhar.\n\n${error.message || "Erro desconhecido"}`);
    } finally {
      setPdfLoading(false);
    }
  }

  async function handleSave() {
    try {
      setPdfLoading(true);
      const data = getMockRdoData();
      const pdfUri = await generateRdoPdf(data);
      Alert.alert("Guardado", `PDF guardado em:\n${pdfUri}`);
    } catch (error: any) {
      Alert.alert("Erro", `Não foi possível guardar o PDF.\n\n${error.message || "Erro desconhecido"}`);
    } finally {
      setPdfLoading(false);
    }
  }

  function handleSectionPress(section: SectionItem) {
    router.push(`/(tabs)/reports/${id}/${section.route}`);
  }

  function handleViewAllPhotos() {
    router.push(`/(tabs)/reports/${id}/photos`);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity
          style={styles.navButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.textPrimary} />
        </PressableOpacity>
        <Text style={styles.navTitle}>RDO #032</Text>
        <PressableOpacity style={styles.navButton}>
          <Ellipsis size={20} color={colors.textPrimary} />
        </PressableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.reportHeader}>
          <View style={styles.rhTop}>
            <Text style={styles.rhNumber}>RDO #032</Text>
            <View style={styles.rhStatus}>
              <CircleCheck size={14} color="#15803D" />
              <Text style={styles.rhStatusText}>Gerado</Text>
            </View>
          </View>
          <Text style={styles.rhDate}>12 de Agosto de 2026</Text>
          <Text style={styles.rhProject}>Reabilitação Pedrinhas</Text>
          <Text style={styles.rhLocation}>Zango 1 — Icolo e Bengo</Text>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>7</Text>
              <Text style={styles.summaryLabel}>trabalhadores</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>2</Text>
              <Text style={styles.summaryLabel}>atividades</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>3</Text>
              <Text style={styles.summaryLabel}>materiais</Text>
            </View>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>3</Text>
              <Text style={styles.summaryLabel}>equipamentos</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>2</Text>
              <Text style={styles.summaryLabel}>ocorrências</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>6</Text>
              <Text style={styles.summaryLabel}>fotografias</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionList}>
          {RDO_SECTIONS.map((section, index) => (
            <View key={section.id}>
              <PressableOpacity
                style={styles.sectionItem}
                onPress={() => handleSectionPress(section)}
              >
                <View style={styles.sectionLeft}>
                  <section.icon size={18} color={section.iconColor} />
                  <View style={styles.sectionInfo}>
                    <Text style={styles.sectionName}>{section.name}</Text>
                    <Text style={styles.sectionSummary}>{section.summary}</Text>
                  </View>
                </View>
                <ChevronRight size={18} color={colors.textTertiary} />
              </PressableOpacity>
              {index < RDO_SECTIONS.length - 1 && <View style={styles.sectionDivider} />}
            </View>
          ))}
        </View>

        <View style={styles.photos}>
          <View style={styles.photoHeader}>
            <Text style={styles.photoTitle}>Fotografias</Text>
            <Text style={styles.photoCount}>6 fotografias</Text>
          </View>
          <View style={styles.photoStrip}>
            {MOCK_PHOTOS.map((photo) => (
              <View key={photo.id} style={styles.photoThumb} />
            ))}
          </View>
          <PressableOpacity style={styles.viewAllLink} onPress={handleViewAllPhotos}>
            <Text style={styles.viewAllText}>Ver todas</Text>
            <ArrowRight size={14} color={colors.brandPrimary} />
          </PressableOpacity>
        </View>

        <PressableOpacity
          style={styles.primaryButton}
          onPress={handleOpenPdf}
          disabled={pdfLoading}
        >
          {pdfLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Abrir PDF</Text>
              <FileText size={18} color="#FFFFFF" />
            </>
          )}
        </PressableOpacity>

        <View style={styles.secondaryActions}>
          <PressableOpacity
            style={styles.secondaryButton}
            onPress={handleShare}
            disabled={pdfLoading}
          >
            {pdfLoading ? (
              <ActivityIndicator size="small" color={colors.textSecondary} />
            ) : (
              <>
                <Share2 size={16} color={colors.textSecondary} />
                <Text style={styles.secondaryButtonText}>Partilhar</Text>
              </>
            )}
          </PressableOpacity>
          <PressableOpacity
            style={styles.secondaryButton}
            onPress={handleSave}
            disabled={pdfLoading}
          >
            {pdfLoading ? (
              <ActivityIndicator size="small" color={colors.textSecondary} />
            ) : (
              <>
                <Download size={16} color={colors.textSecondary} />
                <Text style={styles.secondaryButtonText}>Guardar</Text>
              </>
            )}
          </PressableOpacity>
        </View>
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
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 12,
  },
  reportHeader: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    padding: 16,
    gap: 2,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  rhTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rhNumber: {
    ...typography.presets.h3,
    color: colors.textPrimary,
  },
  rhStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rhStatusText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: "#15803D",
    fontSize: 12,
  },
  rhDate: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  rhProject: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  rhLocation: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  summary: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 4,
  },
  summaryItem: {
    alignItems: "center",
    gap: 2,
  },
  summaryValue: {
    ...typography.presets.h3,
    color: colors.textPrimary,
  },
  summaryLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },
  sectionList: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
    overflow: "hidden",
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    paddingHorizontal: 14,
  },
  sectionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  sectionInfo: {
    gap: 1,
  },
  sectionName: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  sectionSummary: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  photos: {
    gap: 4,
  },
  photoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  photoTitle: {
    ...typography.presets.label,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  photoCount: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  photoStrip: {
    flexDirection: "row",
    gap: 5,
  },
  photoThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
  },
  viewAllLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 32,
    justifyContent: "center",
  },
  viewAllText: {
    ...typography.presets.label,
    fontWeight: typography.fontWeight.medium,
    color: "#1B3A5C",
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
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 12,
    height: 34,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  secondaryButtonText: {
    ...typography.presets.label,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
});
