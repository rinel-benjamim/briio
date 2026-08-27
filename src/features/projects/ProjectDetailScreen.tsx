import { useState, useEffect, useMemo } from "react";
import { View, ScrollView, Text, Modal, Pressable, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeftCircle,
  MoreHorizontal,
  ArrowRight,
  Pencil,
  Plus,
  Trash2,
  X,
  Info,
  ArrowRight as ArrowRightIcon,
} from "lucide-react-native";
import { typography, borderRadius } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useProject, useProjects } from "@/hooks/useProjects";
import { useRdoList } from "@/hooks/useRdoData";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { InfoCard } from "@/components/projects/InfoCard";
import { RecentRdoList } from "@/components/projects/RecentRdoList";
import { useRdo } from "@/contexts/RdoContext";

export default function ProjectDetailScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { rdoId } = useRdo();
  const [overflowVisible, setOverflowVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const { project, loading: projectLoading } = useProject(id ?? null);
  const { remove } = useProjects();
  const { rdos, loading: rdosLoading } = useRdoList(id ?? undefined);

  const loading = projectLoading || rdosLoading;

  const latestRdo = useMemo(() => {
    if (rdos.length === 0) return null;
    return rdos[0];
  }, [rdos]);

  const recentRdos = useMemo(() => {
    return rdos.slice(0, 5).map((r) => {
      const date = new Date(r.report_date);
      const day = String(date.getDate()).padStart(2, "0");
      const month = date.toLocaleDateString("pt-AO", { month: "short" });
      return {
        id: r.id,
        date: `${day} ${month}`,
        number: r.number,
        status: r.status as "draft" | "completed" | "generated",
      };
    });
  }, [rdos]);

  const OVERFLOW_OPTIONS = [
    { key: "info", label: "Informações da obra", icon: Info, color: colors.textMain },
    { key: "new-rdo", label: "Novo RDO", icon: Plus, color: colors.textMain },
    { key: "edit", label: "Editar obra", icon: Pencil, color: colors.textMain },
    { key: "delete", label: "Excluir obra", icon: Trash2, color: colors.warning },
  ];

  const styles = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      backgroundColor: colors.bgMain,
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
      color: colors.textMain,
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
      color: colors.textMuted,
      letterSpacing: 1,
    },
    rdoCard: {
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.lg,
      padding: 20,
      gap: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    rdoDate: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
    rdoStatus: {
      ...typography.presets.h4,
      color: colors.textMain,
    },
    progressSection: {
      gap: 8,
    },
    progressTrack: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    progressSteps: {
      ...typography.presets.bodySmall,
      color: colors.textMuted,
    },
    ctaButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderRadius: borderRadius["2xl"],
      height: 56,
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
      color: colors.primary,
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
      color: colors.textMuted,
    },
    overlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: colors.bgSurface,
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
      color: colors.textMain,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.border,
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
      backgroundColor: colors.bgSurface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 24,
      paddingBottom: 34,
      gap: 12,
    },
    confirmTitle: {
      ...typography.presets.h4,
      color: colors.warning,
    },
    confirmText: {
      ...typography.presets.body,
      color: colors.textMuted,
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
      backgroundColor: colors.border,
    },
    cancelButtonText: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMain,
    },
    deleteButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.warning,
    },
    deleteButtonText: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.medium,
      color: colors.textOnBrand,
    },
  }));

  if (loading) return <LoadingScreen />;
  if (!project) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.textMuted, textAlign: "center", marginTop: 100 }}>
          Obra não encontrada.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeftCircle size={22} color={colors.textMain} />
        </PressableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {project.name}
        </Text>
        <PressableOpacity
          style={styles.navButton}
          onPress={() => setOverflowVisible(true)}
        >
          <MoreHorizontal size={22} color={colors.textMain} />
        </PressableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProjectHeader
          name={project.name}
          location={project.location ?? ""}
          status={project.status}
        />

        <View style={styles.rdoSection}>
          <Text style={styles.sectionLabel}>RDO DE HOJE</Text>
          <View style={styles.rdoCard}>
            <Text style={styles.rdoDate}>
              {latestRdo
                ? new Date(latestRdo.report_date).toLocaleDateString("pt-AO", { day: "numeric", month: "long", year: "numeric" })
                : "Sem RDO"}
            </Text>
            <Text style={styles.rdoStatus}>
              {latestRdo
                ? `${latestRdo.status === "draft" ? "Rascunho" : latestRdo.status === "completed" ? "Concluído" : "Gerado"} · ${latestRdo.progress_percentage}%`
                : "Nenhum RDO"}
            </Text>

            {latestRdo && (
              <View style={styles.progressSection}>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${latestRdo.progress_percentage}%` },
                    ]}
                  />
                </View>
              </View>
            )}

            <PressableOpacity
              style={styles.ctaButton}
              onPress={() => latestRdo && router.push(`/(tabs)/reports/${latestRdo.id}`)}
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
              <ArrowRightIcon size={14} color={colors.primary} />
            </PressableOpacity>
          </View>
          <InfoCard
            fields={[
              { label: "Responsável técnico", value: project.responsible_name ?? "—" },
              { label: "Contrato", value: project.contractor_name ?? "—" },
              { label: "Início", value: project.start_date ? new Date(project.start_date).toLocaleDateString("pt-AO", { day: "2-digit", month: "short", year: "numeric" }) : "—" },
              { label: "Prazo", value: project.expected_end_date ? new Date(project.expected_end_date).toLocaleDateString("pt-AO", { day: "2-digit", month: "short", year: "numeric" }) : "—" },
            ]}
          />
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionLabel}>RDOs recentes</Text>
          <RecentRdoList items={recentRdos} />
        </View>

        <PressableOpacity
          style={styles.editAction}
          onPress={() => router.push(`/(tabs)/projects/${id}/edit`)}
        >
          <Pencil size={14} color={colors.textMuted} />
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
                <X size={20} color={colors.textMuted} />
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
                onPress={async () => {
                  setDeleteConfirmVisible(false);
                  try {
                    await remove(id!);
                    router.replace("/(tabs)/projects");
                  } catch (e: any) {
                    Alert.alert("Erro", e.message || "Erro ao excluir obra");
                  }
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
