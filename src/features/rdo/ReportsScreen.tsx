import { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
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
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { borderRadius } from "@/constants/spacing";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

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
      router.push(`/(tabs)/reports/1/detail`);
    } else {
      router.push(`/(tabs)/reports/1`);
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
              <X size={20} color={colors.textSecondary} />
            ) : (
              <Search size={20} color={colors.textSecondary} />
            )}
          </PressableOpacity>
          <PressableOpacity style={styles.iconButton}>
            <SlidersHorizontal size={20} color={colors.textSecondary} />
          </PressableOpacity>
        </View>
      </View>

      {searchVisible && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={18} color={colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar relatórios..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <PressableOpacity onPress={() => setSearchQuery("")}>
                <X size={16} color={colors.textTertiary} />
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
          <ArrowUpDown size={14} color={colors.textTertiary} />
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
        style={styles.fab}
        onPress={() => setProjectModalVisible(true)}
      >
        <Plus size={24} color="#FFFFFF" />
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
                <X size={20} color={colors.textSecondary} />
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
                      <Building2 size={20} color={isSelected ? colors.brandPrimary : colors.textSecondary} />
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
                      <Check size={18} color={colors.brandPrimary} />
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
    backgroundColor: colors.surfaceBg,
  },
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  navTitle: {
    ...typography.presets.h2,
    color: colors.textPrimary,
  },
  topActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  filters: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    height: 32,
    justifyContent: "center",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  filterPillActive: {
    backgroundColor: colors.brandPrimary,
    borderWidth: 0,
  },
  filterText: {
    ...typography.presets.label,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: "#FFFFFF",
    fontWeight: typography.fontWeight.medium,
  },
  sortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sortLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textTertiary,
  },
  sortControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortValue: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textTertiary,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
    borderWidth: 1.5,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  searchInput: {
    flex: 1,
    ...typography.presets.body,
    color: colors.textPrimary,
    padding: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 12,
  },
  reportCard: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportNumber: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusGenerated: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
  },
  statusDraft: {
    backgroundColor: "rgba(245, 158, 11, 0.12)",
  },
  statusText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    fontSize: 11,
  },
  statusTextGenerated: {
    color: "#10B981",
  },
  statusTextDraft: {
    color: "#F59E0B",
  },
  projectName: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  reportDate: {
    ...typography.presets.bodySmall,
    color: colors.textSecondary,
  },
  reportSummary: {
    ...typography.presets.caption,
    color: colors.textTertiary,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 120,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brandPrimary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.brandPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#1E293B",
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
  sheetSubtitle: {
    ...typography.presets.bodySmall,
    color: colors.textSecondary,
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
    paddingHorizontal: 16,
    gap: 12,
    borderRadius: 12,
  },
  projectOptionSelected: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
  },
  projectOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  projectOptionInfo: {
    flex: 1,
    gap: 2,
  },
  projectOptionName: {
    ...typography.presets.body,
    color: colors.textPrimary,
  },
  projectOptionNameSelected: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.brandPrimary,
  },
  projectOptionLocation: {
    ...typography.presets.bodySmall,
    color: colors.textSecondary,
  },
});
