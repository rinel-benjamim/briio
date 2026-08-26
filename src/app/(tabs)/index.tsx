import { View, ScrollView, StyleSheet, Text, Modal, Pressable, FlatList } from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Plus, X, Check, Building2 } from "lucide-react-native";
import { colors, typography, borderRadius, shadows } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import {
  ProjectSelector,
  type ProjectOption,
} from "@/components/rdo/ProjectSelector";
import { RDOCard } from "@/components/rdo/RDOCard";
import { RecentReports } from "@/components/rdo/RecentReports";
import { useRdo } from "@/contexts/RdoContext";

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
  const { rdoId } = useRdo();
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
            onContinue={() => router.push(`/(tabs)/reports/${rdoId}`)}
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
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => setProjectModalVisible(true)}
      >
        <Plus size={24} color={colors.textOnBrand} />
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
    ...typography.presets.h1,
    color: colors.textMain,
  },
  subtitle: {
    ...typography.presets.body,
    color: colors.textMuted,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    ...typography.presets.bodyMedium,
    color: colors.textOnBrand,
  },
  newReportSection: {
    gap: 12,
  },
  newReportLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  newReportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    height: 52,
    gap: 8,
  },
  newReportButtonText: {
    ...typography.presets.h3,
    color: colors.textOnBrand,
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
