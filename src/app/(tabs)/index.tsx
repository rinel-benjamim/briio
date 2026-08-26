import { View, ScrollView, StyleSheet, Text, Modal, Pressable, FlatList } from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Plus, X, Check, Building2, Camera, Users, AlertTriangle } from "lucide-react-native";
import { colors, typography, borderRadius, shadows } from "@/constants";
import { figma } from "@/constants/figma";
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

const QUICK_ACTIONS = [
  { id: "photo", label: "Fotografia", icon: Camera },
  { id: "workforce", label: "Mão de obra", icon: Users },
  { id: "occurrence", label: "Ocorrência", icon: AlertTriangle },
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Bom dia, Ana</Text>
            <Text style={styles.subtitle}>Vamos registar o progresso de hoje?</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AR</Text>
          </View>
        </View>

        {/* Project Selector */}
        <ProjectSelector
          projects={PROJECTS}
          selectedId={selectedProject.id}
          onSelect={setSelectedProject}
        />

        {/* Hero RDO Card */}
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
            <Text style={styles.newReportLabel}>RDO de hoje</Text>
            <PressableOpacity
              style={styles.newReportButton}
              onPress={() => router.push("/(tabs)/reports/new")}
            >
              <Plus size={20} color={colors.textOnBrand} />
              <Text style={styles.newReportButtonText}>Criar novo relatório</Text>
            </PressableOpacity>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.quickActionsLabel}>Ações rápidas</Text>
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <PressableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => {
                  if (action.id === "photo") router.push(`/(tabs)/reports/${rdoId}/photos`);
                  else if (action.id === "workforce") router.push(`/(tabs)/reports/${rdoId}/workforce`);
                  else router.push(`/(tabs)/reports/${rdoId}/occurrences`);
                }}
              >
                <View style={styles.quickActionIcon}>
                  <action.icon size={18} color={figma.primary} />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </PressableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Reports */}
        <RecentReports reports={MOCK_REPORTS} />
      </ScrollView>

      {/* FAB */}
      <PressableOpacity
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => setProjectModalVisible(true)}
      >
        <Plus size={24} color={colors.textOnBrand} />
      </PressableOpacity>

      {/* Project Modal */}
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
                      <Building2 size={20} color={isSelected ? figma.primary : colors.textMuted} />
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
                      <Check size={18} color={figma.primary} />
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
    backgroundColor: figma.canvas,
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
    gap: 2,
  },
  greeting: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "400",
    fontFamily: typography.fontFamily,
    color: figma.textMain,
  },
  subtitle: {
    ...typography.presets.body,
    color: figma.textMuted,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 100,
    backgroundColor: "#0D4937",
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
    fontWeight: typography.fontWeight.bold,
    color: figma.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  newReportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: figma.primary,
    borderRadius: 16,
    height: 56,
    gap: 8,
  },
  newReportButtonText: {
    ...typography.presets.h3,
    color: colors.textOnBrand,
  },
  quickActionsSection: {
    gap: 12,
  },
  quickActionsLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.bold,
    color: figma.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  quickActionsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: figma.primaryLight,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 8,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: figma.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.bold,
    color: figma.primary,
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: figma.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: figma.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.24,
    shadowRadius: 12,
    elevation: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: figma.primaryLight,
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
    color: figma.textMain,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: figma.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sheetSubtitle: {
    ...typography.presets.body,
    color: figma.textMuted,
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
    borderRadius: 16,
  },
  projectOptionSelected: {
    backgroundColor: figma.primary,
  },
  projectOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: figma.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  projectOptionInfo: {
    flex: 1,
    gap: 2,
  },
  projectOptionName: {
    ...typography.presets.bodyMedium,
    color: figma.textMain,
  },
  projectOptionNameSelected: {
    color: figma.primary,
  },
  projectOptionLocation: {
    ...typography.presets.caption,
    color: figma.textMuted,
  },
});
