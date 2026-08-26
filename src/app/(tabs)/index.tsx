import { View, ScrollView, StyleSheet, Text, Modal, Pressable, FlatList } from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Plus, X, Check, Building2 } from "lucide-react-native";
import { colors, spacing, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import {
  ProjectSelector,
  type ProjectOption,
} from "@/components/rdo/ProjectSelector";
import { RDOCard } from "@/components/rdo/RDOCard";
import { RecentReports } from "@/components/rdo/RecentReports";

type Project = {
  id: string;
  name: string;
  location: string;
};

const PROJECTS: ProjectOption[] = [
  {
    id: "1",
    name: "Reabilitação Pedrinhas",
    location: "Zango 1 — Icolo e Bengo",
  },
  {
    id: "2",
    name: "Reestruturação Predial",
    location: "Luanda — Petrangol",
  },
];

const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "Reabilitação Pedrinhas", location: "Zango 1 — Icolo e Bengo" },
  { id: "2", name: "Construção Residencial Kilamba", location: "Kilamba — Luanda" },
  { id: "3", name: "Edifício Comercial Talatona", location: "Talatona — Luanda" },
  { id: "4", name: "Ponte sobre o Rio Kwanza", location: "Viana — Luanda" },
];

const MOCK_REPORTS = [
  {
    id: "1",
    number: 31,
    date: "11 Ago 2026",
    day: "11",
    month: "Ago",
    projectName: "Reabilitação Pedrinhas",
    status: "generated" as const,
  },
  {
    id: "2",
    number: 30,
    date: "10 Ago 2026",
    day: "10",
    month: "Ago",
    projectName: "Reabilitação Pedrinhas",
    status: "generated" as const,
  },
];

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);
  const [hasActiveReport] = useState(true);
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [selectedProjectForNew, setSelectedProjectForNew] = useState<Project | null>(null);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Bom dia, Ana</Text>
            <Text style={styles.subtitle}>Pronta para registrar o dia?</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AR</Text>
          </View>
        </View>

        <ProjectSelector
          projects={PROJECTS}
          selectedId={selectedProject.id}
          onSelect={setSelectedProject}
        />

        {hasActiveReport ? (
          <RDOCard
            date="12 Agosto 2026"
            projectName={selectedProject.name}
            progressPercentage={65}
            completedSteps={6}
            totalSteps={9}
            onContinue={() => router.push("/(tabs)/reports/1")}
          />
        ) : (
          <View style={styles.newReportSection}>
            <Text style={styles.newReportLabel}>RDO DE HOJE</Text>
            <PressableOpacity
              style={styles.newReportButton}
              onPress={() => router.push("/(tabs)/reports/new")}
            >
              <Plus size={20} color={colors.textOnBrand} />
              <Text style={styles.newReportButtonText}>Novo Relatório</Text>
            </PressableOpacity>
          </View>
        )}

        <RecentReports reports={MOCK_REPORTS} />
      </ScrollView>

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
                const isSelected = item.id === selectedProjectForNew?.id;
                return (
                  <PressableOpacity
                    style={[
                      styles.projectOption,
                      isSelected && styles.projectOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedProjectForNew(item);
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
    gap: 4,
  },
  greeting: {
    ...typography.presets.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.presets.body,
    color: colors.textSecondary,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.brandPrimary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textOnBrand,
  },
  newReportSection: {
    gap: 12,
  },
  newReportLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  newReportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandPrimary,
    borderRadius: borderRadius.xl,
    height: 56,
    gap: 8,
  },
  newReportButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textOnBrand,
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
