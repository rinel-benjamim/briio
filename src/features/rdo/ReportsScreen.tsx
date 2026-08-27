import { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  Modal,
  Pressable,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Search,
  SlidersHorizontal,
  Plus,
  ArrowUpDown,
  X,
  Check,
  Building2,
  FileText,
} from "lucide-react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography, borderRadius, shadows } from "@/constants";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { FadeInView } from "@/components/ui/FadeInView";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useRdo } from "@/contexts/RdoContext";
import { useRdoList } from "@/hooks/useRdoData";
import { useProjectRepository } from "@/repositories/project.repository";
import type { Project, RDO } from "@/types";

type FilterType = "all" | "draft" | "generated";

function formatReportDate(isoDate: string): string {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const d = new Date(isoDate + "T00:00:00");
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { rdoId } = useRdo();
  const projectRepo = useProjectRepository();
  const { rdos, loading: rdosLoading, refresh } = useRdoList();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    projectRepo.findAll().then(setProjects);
  }, []);

  const projectMap = useCallback(() => {
    const map: Record<string, Project> = {};
    projects.forEach((p) => { map[p.id] = p; });
    return map;
  }, [projects])();

  const styles = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      backgroundColor: colors.bgMain,
    },
    topNav: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingBottom: 12,
      backgroundColor: colors.bgSurface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flex: 1,
      gap: 2,
    },
    navTitle: {
      ...typography.presets.h1,
      color: colors.textMain,
    },
    navSubtitle: {
      ...typography.presets.body,
      color: colors.textMuted,
    },
    topActions: {
      flexDirection: "row",
      gap: 8,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.bgMain,
      justifyContent: "center",
      alignItems: "center",
    },
    filters: {
      flexDirection: "row",
      paddingHorizontal: 20,
      gap: 8,
      marginBottom: 8,
      paddingTop: 12,
    },
    filterPill: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: borderRadius.full,
      height: 32,
      justifyContent: "center",
      backgroundColor: colors.bgMain,
    },
    filterPillActive: {
      backgroundColor: colors.primary,
    },
    filterText: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
    filterTextActive: {
      color: colors.textOnBrand,
      fontWeight: typography.fontWeight.semibold,
    },
    sortRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 8,
    },
    sortLabel: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    sortControl: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    sortValue: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    searchContainer: {
      paddingHorizontal: 20,
      marginBottom: 8,
    },
    searchInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.lg,
      paddingHorizontal: 14,
      height: 48,
      gap: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      ...typography.presets.body,
      color: colors.textMain,
      padding: 0,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 100,
      gap: 12,
      flexGrow: 1,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
      gap: 12,
    },
    emptyTitle: {
      ...typography.presets.bodyMedium,
      color: colors.textMain,
    },
    emptyDescription: {
      ...typography.presets.caption,
      color: colors.textMuted,
      textAlign: "center",
    },
    reportCard: {
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.xl,
      padding: 16,
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.sm,
    },
    cardTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    reportNumber: {
      ...typography.presets.bodyMedium,
      color: colors.textMain,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: borderRadius.md,
    },
    statusGenerated: {
      backgroundColor: colors.successBg,
    },
    statusDraft: {
      backgroundColor: colors.warningBg,
    },
    statusText: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.semibold,
      fontSize: 11,
    },
    statusTextGenerated: {
      color: colors.success,
    },
    statusTextDraft: {
      color: colors.warning,
    },
    projectName: {
      ...typography.presets.bodyMedium,
      color: colors.textMain,
    },
    reportDate: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    reportSummary: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    fab: {
      position: "absolute",
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.24,
      shadowRadius: 12,
      elevation: 8,
    },
    overlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: colors.primaryLight,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: "60%",
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
      ...typography.presets.h2,
      color: colors.textMain,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.bgMain,
      justifyContent: "center",
      alignItems: "center",
    },
    sheetSubtitle: {
      ...typography.presets.body,
      color: colors.textMuted,
      paddingHorizontal: 20,
      marginBottom: 8,
    },
    projectList: {
      paddingHorizontal: 20,
    },
    projectOption: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      gap: 12,
      borderRadius: borderRadius.lg,
    },
    projectOptionSelected: {
      backgroundColor: colors.primaryLight,
    },
    projectOptionIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.bgMain,
      justifyContent: "center",
      alignItems: "center",
    },
    projectOptionInfo: {
      flex: 1,
      gap: 2,
    },
    projectOptionName: {
      ...typography.presets.bodyMedium,
      color: colors.textMain,
    },
    projectOptionNameSelected: {
      color: colors.primary,
    },
    projectOptionLocation: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
  }));

  if (rdosLoading) return <LoadingScreen />;

  const filteredReports = rdos
    .filter((rdo) => {
      if (activeFilter === "all") return true;
      return rdo.status === activeFilter;
    })
    .filter((rdo) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      const project = projectMap[rdo.project_id];
      const projectName = project?.name ?? "";
      return (
        `RDO #${String(rdo.number).padStart(3, "0")}`.toLowerCase().includes(query) ||
        projectName.toLowerCase().includes(query)
      );
    });

  function handleReportPress(rdo: RDO) {
    if (rdo.status === "generated") {
      router.push(`/(tabs)/reports/${rdo.id}/detail`);
    } else {
      router.push(`/(tabs)/reports/${rdo.id}`);
    }
  }

  function renderReportCard({ item }: { item: RDO }) {
    const isGenerated = item.status === "generated";
    const project = projectMap[item.project_id];
    return (
      <PressableOpacity
        style={styles.reportCard}
        onPress={() => handleReportPress(item)}
      >
        <View style={styles.cardTop}>
          <Text style={styles.reportNumber}>RDO #{String(item.number).padStart(3, "0")}</Text>
          <View
            style={[
              styles.statusBadge,
              isGenerated ? styles.statusGenerated : styles.statusDraft,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isGenerated ? styles.statusTextGenerated : styles.statusTextDraft,
              ]}
            >
              {isGenerated ? "Gerado" : "Rascunho"}
            </Text>
          </View>
        </View>
        <Text style={styles.projectName} numberOfLines={1}>
          {project?.name ?? "Sem obra"}
        </Text>
        <Text style={styles.reportDate}>{formatReportDate(item.report_date)}</Text>
      </PressableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.navTitle}>Relatórios</Text>
          <Text style={styles.navSubtitle}>Acompanhe os relatórios diários</Text>
        </View>
        <View style={styles.topActions}>
          <PressableOpacity
            style={styles.iconButton}
            onPress={() => {
              setSearchVisible(!searchVisible);
              if (searchVisible) setSearchQuery("");
            }}
          >
            {searchVisible ? (
              <X size={20} color={colors.textMuted} />
            ) : (
              <Search size={20} color={colors.textMuted} />
            )}
          </PressableOpacity>
          <PressableOpacity style={styles.iconButton}>
            <SlidersHorizontal size={20} color={colors.textMuted} />
          </PressableOpacity>
        </View>
      </View>

      {searchVisible && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={18} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar relatórios..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <PressableOpacity onPress={() => setSearchQuery("")}>
                <X size={16} color={colors.textMuted} />
              </PressableOpacity>
            )}
          </View>
        </View>
      )}

      <View style={styles.filters}>
        <PressableOpacity
          style={[styles.filterPill, activeFilter === "all" && styles.filterPillActive]}
          onPress={() => setActiveFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "all" && styles.filterTextActive,
            ]}
          >
            Todos
          </Text>
        </PressableOpacity>
        <PressableOpacity
          style={[styles.filterPill, activeFilter === "draft" && styles.filterPillActive]}
          onPress={() => setActiveFilter("draft")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "draft" && styles.filterTextActive,
            ]}
          >
            Rascunhos
          </Text>
        </PressableOpacity>
        <PressableOpacity
          style={[styles.filterPill, activeFilter === "generated" && styles.filterPillActive]}
          onPress={() => setActiveFilter("generated")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "generated" && styles.filterTextActive,
            ]}
          >
            Gerados
          </Text>
        </PressableOpacity>
      </View>

      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>{filteredReports.length} relatórios</Text>
        <PressableOpacity style={styles.sortControl}>
          <ArrowUpDown size={14} color={colors.textMuted} />
          <Text style={styles.sortValue}>Mais recentes</Text>
        </PressableOpacity>
      </View>

      <FlatList
        data={filteredReports}
        renderItem={renderReportCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <FileText size={40} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Nenhum relatório encontrado</Text>
            <Text style={styles.emptyDescription}>
              Tente alterar os filtros ou criar um novo relatório.
            </Text>
          </View>
        }
      />

      <PressableOpacity
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => setProjectModalVisible(true)}
      >
        <Plus size={18} color={colors.textOnBrand} />
      </PressableOpacity>

      <Modal
        visible={projectModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setProjectModalVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setProjectModalVisible(false)}
        >
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Selecionar obra</Text>
              <PressableOpacity
                style={styles.closeButton}
                onPress={() => setProjectModalVisible(false)}
              >
                <X size={20} color={colors.textMuted} />
              </PressableOpacity>
            </View>

            <Text style={styles.sheetSubtitle}>
              Selecione a obra para criar o novo relatório diário.
            </Text>

            <FlatList
              data={projects}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.projectList}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedProject?.id;
                return (
                  <PressableOpacity
                    style={[
                      styles.projectOption,
                      isSelected && styles.projectOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedProject(item);
                      setProjectModalVisible(false);
                      router.push(`/(tabs)/reports/new?projectId=${item.id}&projectName=${encodeURIComponent(item.name)}`);
                    }}
                  >
                    <View style={styles.projectOptionIcon}>
                      <Building2 size={20} color={isSelected ? colors.primary : colors.textMuted} />
                    </View>
                    <View style={styles.projectOptionInfo}>
                      <Text
                        style={[
                          styles.projectOptionName,
                          isSelected && styles.projectOptionNameSelected,
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text style={styles.projectOptionLocation}>
                        {item.location ?? ""}
                      </Text>
                    </View>
                    {isSelected && (
                      <Check size={18} color={colors.primary} />
                    )}
                  </PressableOpacity>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
