import { useState } from "react";
import { View, ScrollView, StyleSheet, Text, Modal, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Ellipsis,
  ArrowRight,
  Pencil,
  Plus,
  Trash2,
  X,
  Info,
  ArrowRight as ArrowRightIcon,
} from "lucide-react-native";
import { colors, typography, spacing, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { InfoCard } from "@/components/projects/InfoCard";
import { RecentRdoList } from "@/components/projects/RecentRdoList";
import { useRdo } from "@/contexts/RdoContext";

const MOCK_PROJECT = {
  id: "1",
  name: "Reabilitação Pedrinhas",
  location: "Zango 1 — Icolo e Bengo",
  status: "active" as const,
  responsible: "Kiali Rodrigues",
  contractType: "Construção",
  startDate: "09 Fev 2026",
  deadline: "Maio 2026",
};

const MOCK_RDO = {
  date: "12 Agosto 2026",
  status: "Em andamento",
  progressPercentage: 65,
  completedSteps: 6,
  totalSteps: 9,
};

const MOCK_RECENT_RDOS = [
  { id: "1", date: "11 Ago", number: 31, status: "generated" as const },
  { id: "2", date: "10 Ago", number: 30, status: "generated" as const },
  { id: "3", date: "09 Ago", number: 29, status: "generated" as const },
];

const OVERFLOW_OPTIONS = [
  { key: "info", label: "Informações da obra", icon: Info, color: colors.textPrimary },
  { key: "new-rdo", label: "Novo RDO", icon: Plus, color: colors.textPrimary },
  { key: "edit", label: "Editar obra", icon: Pencil, color: colors.textPrimary },
  { key: "delete", label: "Excluir obra", icon: Trash2, color: colors.danger },
];

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { rdoId } = useRdo();
  const [overflowVisible, setOverflowVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </PressableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {MOCK_PROJECT.name}
        </Text>
        <PressableOpacity
          style={styles.navButton}
          onPress={() => setOverflowVisible(true)}
        >
          <Ellipsis size={20} color={colors.textPrimary} />
        </PressableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProjectHeader
          name={MOCK_PROJECT.name}
          location={MOCK_PROJECT.location}
          status={MOCK_PROJECT.status}
        />

        <View style={styles.rdoSection}>
          <Text style={styles.sectionLabel}>RDO DE HOJE</Text>
          <View style={styles.rdoCard}>
            <Text style={styles.rdoDate}>{MOCK_RDO.date}</Text>
            <Text style={styles.rdoStatus}>
              {MOCK_RDO.status} · {MOCK_RDO.progressPercentage}%
            </Text>

            <View style={styles.progressSection}>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${MOCK_RDO.progressPercentage}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressSteps}>
                {MOCK_RDO.completedSteps} de {MOCK_RDO.totalSteps} etapas concluídas
              </Text>
            </View>

            <PressableOpacity
              style={styles.ctaButton}
              onPress={() => router.push(`/(tabs)/reports/${rdoId}`)}
            >
              <Text style={styles.ctaText}>Continuar RDO</Text>
              <ArrowRight size={18} color={colors.textOnBrand} />
            </PressableOpacity>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Text style={styles.sectionLabel}>Informações da obra</Text>
            <PressableOpacity
              style={styles.viewMore}
              onPress={() => router.push(`/(tabs)/projects/${id}/info`)}
            >
              <Text style={styles.viewMoreText}>Ver mais</Text>
              <ArrowRightIcon size={14} color={colors.brandPrimary} />
            </PressableOpacity>
          </View>
          <InfoCard
            fields={[
              { label: "Responsável técnico", value: MOCK_PROJECT.responsible },
              { label: "Contrato", value: MOCK_PROJECT.contractType },
              { label: "Início", value: MOCK_PROJECT.startDate },
              { label: "Prazo", value: MOCK_PROJECT.deadline },
            ]}
          />
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionLabel}>RDOs recentes</Text>
          <RecentRdoList items={MOCK_RECENT_RDOS} />
        </View>

        <PressableOpacity
          style={styles.editAction}
          onPress={() => router.push(`/(tabs)/projects/${id}/edit`)}
        >
          <Pencil size={14} color={colors.textSecondary} />
          <Text style={styles.editText}>Editar informações da obra</Text>
        </PressableOpacity>
      </ScrollView>

      <Modal
        visible={overflowVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOverflowVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setOverflowVisible(false)}
        >
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Opções</Text>
              <PressableOpacity
                style={styles.closeButton}
                onPress={() => setOverflowVisible(false)}
              >
                <X size={20} color={colors.textSecondary} />
              </PressableOpacity>
            </View>

            {OVERFLOW_OPTIONS.map((option) => (
              <PressableOpacity
                key={option.key}
                style={styles.option}
                onPress={() => {
                  setOverflowVisible(false);
                  if (option.key === "info") {
                    router.push(`/(tabs)/projects/${id}/info`);
                  } else if (option.key === "new-rdo") {
                    router.push(`/(tabs)/reports/new`);
                  } else if (option.key === "edit") {
                    router.push(`/(tabs)/projects/${id}/edit`);
                  } else if (option.key === "delete") {
                    setDeleteConfirmVisible(true);
                  }
                }}
              >
                <option.icon size={18} color={option.color} />
                <Text style={[styles.optionLabel, { color: option.color }]}>
                  {option.label}
                </Text>
              </PressableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={deleteConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteConfirmVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setDeleteConfirmVisible(false)}
        >
          <View style={styles.confirmSheet}>
            <Text style={styles.confirmTitle}>Excluir obra</Text>
            <Text style={styles.confirmText}>
              Tem certeza que deseja excluir esta obra? Esta ação não pode ser desfeita.
            </Text>
            <View style={styles.confirmActions}>
              <PressableOpacity
                style={styles.cancelButton}
                onPress={() => setDeleteConfirmVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </PressableOpacity>
              <PressableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  setDeleteConfirmVisible(false);
                  router.back();
                }}
              >
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </PressableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
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
    paddingHorizontal: 20,
    paddingBottom: 8,
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
    flex: 1,
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 24,
  },
  rdoSection: {
    gap: 12,
  },
  sectionLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  rdoCard: {
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: borderRadius.lg,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  rdoDate: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  rdoStatus: {
    ...typography.presets.h4,
    color: colors.textPrimary,
  },
  progressSection: {
    gap: 8,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.brandPrimary,
    borderRadius: 4,
  },
  progressSteps: {
    ...typography.presets.bodySmall,
    color: colors.textSecondary,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandPrimary,
    borderRadius: borderRadius.lg,
    height: 50,
    gap: 8,
  },
  ctaText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textOnBrand,
  },
  infoSection: {
    gap: 12,
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewMore: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewMoreText: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.brandPrimary,
  },
  recentSection: {
    gap: 12,
  },
  editAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
  },
  editText: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surfaceCardSolid,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 12,
  },
  sheetTitle: {
    ...typography.presets.h4,
    color: colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(148, 163, 184, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    paddingHorizontal: 20,
  },
  optionLabel: {
    ...typography.presets.body,
  },
  confirmSheet: {
    backgroundColor: colors.surfaceCardSolid,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 34,
    gap: 12,
  },
  confirmTitle: {
    ...typography.presets.h4,
    color: colors.danger,
  },
  confirmText: {
    ...typography.presets.body,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  confirmActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(148, 163, 184, 0.15)",
  },
  cancelButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  deleteButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.danger,
  },
  deleteButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textOnBrand,
  },
});
