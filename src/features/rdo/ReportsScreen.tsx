import { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
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
} from "lucide-react-native";
import { colors, typography, borderRadius, shadows } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { useRdo } from "@/contexts/RdoContext";

type FilterType = "all" | "draft" | "generated";

type Project = {
  id: string;
  name: string;
  location: string;
};

type Report = {
  id: string;
  number: string;
  projectName: string;
  date: string;
  status: "draft" | "generated";
  summary: string;
};

const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "Reabilitação Pedrinhas", location: "Zango 1 — Icolo e Bengo" },
  { id: "2", name: "Construção Residencial Kilamba", location: "Kilamba — Luanda" },
  { id: "3", name: "Edifício Comercial Talatona", location: "Talatona — Luanda" },
  { id: "4", name: "Ponte sobre o Rio Kwanza", location: "Viana — Luanda" },
];

const MOCK_REPORTS: Report[] = [
  {
    id: "1",
    number: "RDO #024",
    projectName: "Construção Residencial Kilamba",
    date: "20 Ago 2026",
    status: "generated",
    summary: "12 trabalhadores · 4 atividades · 6 fotografias",
  },
  {
    id: "2",
    number: "RDO #023",
    projectName: "Construção Residencial Kilamba",
    date: "19 Ago 2026",
    status: "generated",
    summary: "11 trabalhadores · 5 atividades · 8 fotografias",
  },
  {
    id: "3",
    number: "RDO #022",
    projectName: "Edifício Comercial Talatona",
    date: "18 Ago 2026",
    status: "draft",
    summary: "9 trabalhadores · 3 atividades · 4 fotografias",
  },
  {
    id: "4",
    number: "RDO #021",
    projectName: "Edifício Comercial Talatona",
    date: "17 Ago 2026",
    status: "generated",
    summary: "10 trabalhadores · 5 atividades · 7 fotografias",
  },
  {
    id: "5",
    number: "RDO #020",
    projectName: "Reabilitação Pedrinhas",
    date: "16 Ago 2026",
    status: "generated",
    summary: "8 trabalhadores · 4 atividades · 5 fotografias",
  },
];

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const { rdoId } = useRdo();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = MOCK_REPORTS.filter((report) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "draft") return report.status === "draft";
    if (activeFilter === "generated") return report.status === "generated";
    return true;
  }).filter((report) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      report.number.toLowerCase().includes(query) ||
      report.projectName.toLowerCase().includes(query)
    );
  });

  function handleReportPress(report: Report) {
    if (report.status === "generated") {
      router.push(`/(tabs)/reports/${rdoId}/detail`);
    } else {
      router.push(`/(tabs)/reports/${rdoId}`);
    }
  }

  function renderReportCard({ item }: { item: Report }) {
    const isGenerated = item.status === "generated";
    return (
      <PressableOpacity
        style={styles.reportCard}
        onPress={() => handleReportPress(item)}
      >
        <View style={styles.cardTop}>
          <Text style={styles.reportNumber}>{item.number}</Text>
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
          {item.projectName}
        </Text>
        <Text style={styles.reportDate}>{item.date}</Text>
        <Text style={styles.reportSummary} numberOfLines={1}>
          {item.summary}
        </Text>
      </PressableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.navTitle}>Relatórios</Text>
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
              data={MOCK_PROJECTS}
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
                        {item.location}
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

const styles = StyleSheet.create({
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
  navTitle: {
    ...typography.presets.h1,
    color: colors.textMain,
  },
  topActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F4F6F4",
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
    backgroundColor: "#F4F6F4",
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
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
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
    backgroundColor: "#F4F6F4",
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
    backgroundColor: "#F4F6F4",
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
});
