import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import { colors, typography, borderRadius, spacing } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { SearchBar } from "@/components/projects/SearchBar";
import { ProjectCard, type ProjectStatus } from "@/components/projects/ProjectCard";

const MOCK_PROJECTS = [
  {
    id: "1",
    name: "Reabilitação Pedrinhas",
    location: "Zango 1 — Icolo e Bengo",
    lastRdo: "Último RDO · Hoje",
    status: "active" as ProjectStatus,
  },
  {
    id: "2",
    name: "Construção Residencial Kilamba",
    location: "Kilamba — Luanda",
    lastRdo: "Último RDO · Ontem",
    status: "completed" as ProjectStatus,
  },
  {
    id: "3",
    name: "Reabilitação Escola 17 de Setembro",
    location: "Viana — Luanda",
    lastRdo: "Último RDO · 08 Ago",
    status: "active" as ProjectStatus,
  },
];

export default function ProjectsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Obras</Text>
          <Text style={styles.subtitle}>Suas obras de trabalho</Text>
        </View>
        <PressableOpacity
          style={styles.addButton}
          onPress={() => router.push("/(tabs)/projects/create")}
        >
          <Plus size={20} color={colors.textPrimary} />
        </PressableOpacity>
      </View>

      <SearchBar />

      <Text style={styles.sectionLabel}>Obras ativas</Text>

      <View style={styles.projectList}>
        {MOCK_PROJECTS.map((project, index) => (
          <View key={project.id}>
            <ProjectCard
              id={project.id}
              name={project.name}
              location={project.location}
              lastRdo={project.lastRdo}
              status={project.status}
            />
            {index < MOCK_PROJECTS.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceBg,
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
  title: {
    ...typography.presets.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.presets.body,
    color: colors.textSecondary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  sectionLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  projectList: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: "rgba(148, 163, 184, 0.08)",
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(229, 231, 235, 0.1)",
  },
});
