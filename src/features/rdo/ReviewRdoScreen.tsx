import { useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeftCircle,
  CheckCircle,
  FileDown,
} from "lucide-react-native";
import { colors } from "@/constants";
import { typography } from "@/constants/typography";
import { useThemeColors } from "@/contexts/ThemeContext";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

const MOCK_RDO = {
  number: "RDO #032",
  date: "12 Agosto 2026",
  projectName: "Reabilitação Pedrinhas",
  location: "Zango 1 — Icolo e Bengo",
  author: "Kiali Rodrigues",
};

type SectionItem = {
  id: string;
  name: string;
  summary: string;
  route: string;
};

const RDO_SECTIONS: SectionItem[] = [
  { id: "1", name: "Condições do dia", summary: "Manhã · Tarde · Noite", route: "weather" },
  { id: "2", name: "Mão de obra", summary: "7 trabalhadores · 8h", route: "workforce" },
  { id: "3", name: "Materiais", summary: "3 registos", route: "materials" },
  { id: "4", name: "Equipamentos", summary: "2 registos", route: "equipment" },
  { id: "5", name: "Tarefas", summary: "2 tarefas", route: "tasks" },
  { id: "6", name: "Ocorrências", summary: "2 ocorrências", route: "occurrences" },
  { id: "7", name: "Observações", summary: "Preenchido", route: "observations" },
  { id: "8", name: "Fotografias", summary: "6 fotografias", route: "photos" },
];

export default function ReviewRdoScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [step] = useState(9);
  const totalSteps = 9;

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity
          style={styles.navButton}
          onPress={() => router.back()}
        >
          <ArrowLeftCircle size={22} color={colors.textMain} />
        </PressableOpacity>
        <Text style={styles.navTitle}>Revisar RDO</Text>
        <View style={styles.progressIndicator}>
          <Text style={styles.progressText}>
            {step} de {totalSteps}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.reportIdentity}>
          <Text style={styles.reportNumber}>{MOCK_RDO.number}</Text>
          <Text style={styles.reportDate}>{MOCK_RDO.date}</Text>
          <Text style={styles.reportProject}>{MOCK_RDO.projectName}</Text>
          <Text style={styles.reportLocation}>{MOCK_RDO.location}</Text>
        </View>

        <View style={styles.overallStatus}>
          <CheckCircle size={20} color={colors.success} />
          <View style={styles.overallInfo}>
            <Text style={styles.overallTitle}>Tudo preenchido</Text>
            <Text style={styles.overallSubtitle}>
              O RDO está pronto para ser gerado.
            </Text>
          </View>
        </View>

        <Text style={styles.checklistLabel}>SECÇÕES DO RELATÓRIO</Text>

        <View style={styles.checklist}>
          {RDO_SECTIONS.map((section, index) => (
            <View key={section.id}>
              <PressableOpacity
                style={styles.checklistItem}
                onPress={() =>
                  router.push(`/(tabs)/reports/${id}/${section.route}?from=review`)
                }
              >
                <View style={styles.checklistItemLeft}>
                  <CheckCircle size={20} color={colors.success} />
                  <View style={styles.checklistItemInfo}>
                    <Text style={styles.checklistItemName}>{section.name}</Text>
                    <Text style={styles.checklistItemSummary}>
                      {section.summary}
                    </Text>
                  </View>
                </View>
                <Text style={styles.editButton}>Editar</Text>
              </PressableOpacity>
              {index < RDO_SECTIONS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <View style={styles.signatureSection}>
          <Text style={styles.signatureLabel}>ASSINATURA</Text>
          <Text style={styles.signatureRole}>
            Responsável pelo preenchimento
          </Text>
          <Text style={styles.signatureName}>{MOCK_RDO.author}</Text>
          <Text style={styles.signatureNote}>
            Assinatura física após impressão
          </Text>
        </View>

        <PressableOpacity
          style={styles.primaryButton}
          onPress={() => router.push(`/(tabs)/reports/${id}/generated`)}
        >
          <Text style={styles.primaryButtonText}>Gerar RDO</Text>
          <FileDown size={18} color={colors.textOnBrand} />
        </PressableOpacity>

        <Text style={styles.primaryHint}>
          O relatório será gerado em PDF.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
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
    color: colors.textMain,
    flex: 1,
  },
  progressIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 16,
  },
  reportIdentity: {
    gap: 4,
  },
  reportNumber: {
    ...typography.presets.h2,
    color: colors.textMain,
  },
  reportDate: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  reportProject: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  reportLocation: {
    ...typography.presets.caption,
    color: colors.textMuted,
  },
  overallStatus: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successBg,
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.success,
  },
  overallInfo: {
    gap: 2,
  },
  overallTitle: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.success,
  },
  overallSubtitle: {
    ...typography.presets.caption,
    color: colors.textMuted,
  },
  checklistLabel: {
    ...typography.presets.caption,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  checklist: {
    backgroundColor: colors.bgSurface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    paddingHorizontal: 16,
  },
  checklistItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  checklistItemInfo: {
    gap: 1,
  },
  checklistItemName: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMain,
  },
  checklistItemSummary: {
    ...typography.presets.caption,
    color: colors.textMuted,
  },
  editButton: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  signatureSection: {
    backgroundColor: colors.bgSurface,
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  signatureLabel: {
    ...typography.presets.caption,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  signatureRole: {
    ...typography.presets.caption,
    color: colors.textMuted,
  },
  signatureName: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMain,
  },
  signatureNote: {
    ...typography.presets.caption,
    color: colors.textMuted,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 56,
    gap: 8,
  },
  primaryButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textOnBrand,
  },
  primaryHint: {
    ...typography.presets.caption,
    color: colors.textMuted,
    textAlign: "center",
  },
});
