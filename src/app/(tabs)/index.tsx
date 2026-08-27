import { View, ScrollView, StyleSheet, Text, Modal, Pressable, FlatList } from "react-native";
import { useState, useEffect, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Plus, X, Check, Building2, Camera, Users, AlertTriangle } from "lucide-react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography } from "@/constants";
import { useProjects } from "@/hooks/useProjects";
import { useRdoList } from "@/hooks/useRdoData";

import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { AnimatedFAB } from "@/components/ui/AnimatedFAB";
import { FadeInView } from "@/components/ui/FadeInView";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import {
  ProjectSelector,
  type ProjectOption,
} from "@/components/rdo/ProjectSelector";
import { RDOCard } from "@/components/rdo/RDOCard";
import { RecentReports } from "@/components/rdo/RecentReports";
import { useRdo } from "@/contexts/RdoContext";

const QUICK_ACTIONS = [
  { id: "photo", label: "Fotografia", icon: Camera },
  { id: "workforce", label: "Mão de obra", icon: Users },
  { id: "occurrence", label: "Ocorrência", icon: AlertTriangle },
];

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { rdoId } = useRdo();
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [selectedProjectForNew, setSelectedProjectForNew] = useState<ProjectOption | null>(null);

  const { projects, loading: projectsLoading } = useProjects();
  const { rdos, loading: rdosLoading } = useRdoList();

  const loading = projectsLoading || rdosLoading;

  const projectOptions: ProjectOption[] = useMemo(
    () =>
      projects.map((p) => ({
        id: p.id,
        name: p.name,
        location: p.location ?? "",
      })),
    [projects]
  );

  const [selectedProject, setSelectedProject] = useState<ProjectOption | null>(null);

  useEffect(() => {
    if (projectOptions.length > 0 && !selectedProject) {
      setSelectedProject(projectOptions[0]);
    }
  }, [projectOptions, selectedProject]);

  const latestRdo = useMemo(() => {
    if (rdos.length === 0) return null;
    return rdos[0];
  }, [rdos]);

  const recentReports = useMemo(() => {
    return rdos.slice(0, 5).map((r) => {
      const date = new Date(r.report_date);
      const day = String(date.getDate()).padStart(2, "0");
      const month = date.toLocaleDateString("pt-AO", { month: "short" });
      const projectName = projects.find((p) => p.id === r.project_id)?.name ?? "";
      return {
        id: r.id,
        number: r.number,
        date: `${day} ${month} ${date.getFullYear()}`,
        day,
        month,
        projectName,
        status: r.status as "draft" | "completed" | "generated",
      };
    });
  }, [rdos, projects]);

  if (loading) return <LoadingScreen />;

  return (
    <View style={[styles.container, { backgroundColor: colors.bgMain }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <FadeInView delay={0}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={[styles.greeting, { color: colors.textMain }]}>Bom dia, Ana</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>Vamos registar o progresso de hoje?</Text>
            </View>
            <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.avatarText, { color: colors.primary }]}>AR</Text>
            </View>
          </View>
        </FadeInView>

        {/* Project Selector */}
        {projectOptions.length > 0 && (
          <ProjectSelector
            projects={projectOptions}
            selectedId={selectedProject?.id}
            onSelect={setSelectedProject}
          />
        )}

        {/* Hero RDO Card */}
        {latestRdo ? (
          <RDOCard
            date={new Date(latestRdo.report_date).toLocaleDateString("pt-AO", { day: "numeric", month: "long", year: "numeric" })}
            projectName={selectedProject?.name ?? ""}
            progressPercentage={latestRdo.progress_percentage}
            onContinue={() => router.push(`/(tabs)/reports/${latestRdo.id}`)}
          />
        ) : (
          <FadeInView delay={100}>
            <View style={styles.newReportSection}>
              <Text style={[styles.newReportLabel, { color: colors.textMuted }]}>RDO de hoje</Text>
              <PressableOpacity
                style={[styles.newReportButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push("/(tabs)/reports/new")}
              >
                <Plus size={20} color={colors.textOnBrand} />
                <Text style={[styles.newReportButtonText, { color: colors.textOnBrand }]}>Criar novo relatório</Text>
              </PressableOpacity>
            </View>
          </FadeInView>
        )}

        {/* Quick Actions */}
        <FadeInView delay={200}>
          <View style={styles.quickActionsSection}>
            <Text style={[styles.quickActionsLabel, { color: colors.textMuted }]}>Ações rápidas</Text>
            <View style={styles.quickActionsGrid}>
              {QUICK_ACTIONS.map((action) => (
                <PressableOpacity
                  key={action.id}
                  style={[styles.quickActionCard, { backgroundColor: colors.bgSurface, borderColor: colors.border }]}
                  onPress={() => {
                    if (action.id === "photo") router.push(`/(tabs)/reports/${rdoId}/photos`);
                    else if (action.id === "workforce") router.push(`/(tabs)/reports/${rdoId}/workforce`);
                    else router.push(`/(tabs)/reports/${rdoId}/occurrences`);
                  }}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: colors.primaryLight }]}>
                    <action.icon size={20} color={colors.primary} />
                  </View>
                  <Text style={[styles.quickActionLabel, { color: colors.textMain }]}>{action.label}</Text>
                </PressableOpacity>
              ))}
            </View>
          </View>
        </FadeInView>

        {/* Recent Reports */}
        {recentReports.length > 0 && (
          <RecentReports
            reports={recentReports}
            onReportPress={(id) => router.push(`/(tabs)/reports/${id}`)}
          />
        )}
      </ScrollView>

      {/* FAB */}
      <AnimatedFAB
        onPress={() => setProjectModalVisible(true)}
        bottomOffset={insets.bottom + 24}
      />

      {/* Project Modal */}
      <Modal
        visible={projectModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setProjectModalVisible(false)}
      >
        <Pressable
          style={[styles.overlay, { backgroundColor: colors.overlay }]}
          onPress={() => setProjectModalVisible(false)}
        >
          <View style={[styles.sheet, { backgroundColor: colors.bgSurface, paddingBottom: insets.bottom + 16 }]}>
            <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.sheetTitle, { color: colors.textMain }]}>Selecionar obra</Text>
              <PressableOpacity
                style={[styles.closeButton, { backgroundColor: colors.bgMain }]}
                onPress={() => setProjectModalVisible(false)}
              >
                <X size={20} color={colors.textMuted} />
              </PressableOpacity>
            </View>

            <Text style={[styles.sheetSubtitle, { color: colors.textMuted }]}>
              Selecione a obra para criar o novo relatório diário.
            </Text>

            <FlatList
              data={projectOptions}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.projectList}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedProjectForNew?.id;
                return (
                  <PressableOpacity
                    style={[
                      styles.projectOption,
                      { borderBottomColor: colors.border },
                      isSelected && { backgroundColor: colors.primaryLight },
                    ]}
                    onPress={() => {
                      setSelectedProjectForNew(item);
                      setProjectModalVisible(false);
                      router.push(`/(tabs)/reports/new?projectId=${item.id}&projectName=${encodeURIComponent(item.name)}`);
                    }}
                  >
                    <View style={[styles.projectOptionIcon, { backgroundColor: colors.bgMain }]}>
                      <Building2 size={20} color={isSelected ? colors.primary : colors.textMuted} />
                    </View>
                    <View style={styles.projectOptionInfo}>
                      <Text
                        style={[
                          styles.projectOptionName,
                          { color: colors.textMain },
                          isSelected && { fontWeight: typography.fontWeight.semibold, color: colors.primary },
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text style={[styles.projectOptionLocation, { color: colors.textMuted }]}>
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
  },
  subtitle: {
    ...typography.presets.body,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    ...typography.presets.bodyMedium,
  },
  newReportSection: {
    gap: 12,
  },
  newReportLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  newReportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    height: 56,
    gap: 8,
  },
  newReportButtonText: {
    ...typography.presets.h3,
  },
  quickActionsSection: {
    gap: 10,
  },
  quickActionsLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily,
  },
  quickActionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    height: 94,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: typography.fontWeight.regular,
    fontFamily: typography.fontFamily,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  sheetTitle: {
    ...typography.presets.h2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  sheetSubtitle: {
    ...typography.presets.body,
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
    borderBottomWidth: 1,
  },
  projectOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  projectOptionInfo: {
    flex: 1,
    gap: 2,
  },
  projectOptionName: {
    ...typography.presets.bodyMedium,
  },
  projectOptionLocation: {
    ...typography.presets.caption,
  },
});
