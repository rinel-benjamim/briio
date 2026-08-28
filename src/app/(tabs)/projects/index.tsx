import { useState, useMemo, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import {
  Search,
  SlidersHorizontal,
  Plus,
  ArrowUpDown,
  X,
  Building2,
} from "lucide-react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography, borderRadius } from "@/constants";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useProjects } from "@/hooks/useProjects";
import { useDataChangeListener } from "@/hooks/useDataChangeListener";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { FadeInView } from "@/components/ui/FadeInView";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ProjectCard, type ProjectStatus } from "@/components/projects/ProjectCard";

type FilterType = "all" | "active" | "completed" | "archived";

export default function ProjectsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { projects, loading, refresh } = useProjects();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  useDataChangeListener(refresh);

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
  }));

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        if (activeFilter === "all") return true;
        return project.status === activeFilter;
      })
      .filter((project) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
          project.name.toLowerCase().includes(query) ||
          (project.location && project.location.toLowerCase().includes(query))
        );
      })
      .map((project) => ({
        id: project.id,
        name: project.name,
        location: project.location ?? "",
        lastRdo: project.start_date
          ? `Início · ${new Date(project.start_date).toLocaleDateString("pt-AO", { day: "2-digit", month: "short" })}`
          : "",
        status: project.status as ProjectStatus,
      }));
  }, [projects, activeFilter, searchQuery]);

  if (loading) return <LoadingScreen />;

  function renderProjectCard({ item }: { item: typeof filteredProjects[0] }) {
    return (
      <ProjectCard
        id={item.id}
        name={item.name}
        location={item.location}
        lastRdo={item.lastRdo}
        status={item.status}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.navTitle}>Obras</Text>
          <Text style={styles.navSubtitle}>Gerir suas obras de trabalho</Text>
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
              placeholder="Pesquisar obras..."
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
            Todas
          </Text>
        </PressableOpacity>
        <PressableOpacity
          style={[styles.filterPill, activeFilter === "active" && styles.filterPillActive]}
          onPress={() => setActiveFilter("active")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "active" && styles.filterTextActive,
            ]}
          >
            Ativas
          </Text>
        </PressableOpacity>
        <PressableOpacity
          style={[styles.filterPill, activeFilter === "completed" && styles.filterPillActive]}
          onPress={() => setActiveFilter("completed")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "completed" && styles.filterTextActive,
            ]}
          >
            Concluídas
          </Text>
        </PressableOpacity>
        <PressableOpacity
          style={[styles.filterPill, activeFilter === "archived" && styles.filterPillActive]}
          onPress={() => setActiveFilter("archived")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "archived" && styles.filterTextActive,
            ]}
          >
            Arquivadas
          </Text>
        </PressableOpacity>
      </View>

      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>{filteredProjects.length} obras</Text>
        <PressableOpacity style={styles.sortControl}>
          <ArrowUpDown size={14} color={colors.textMuted} />
          <Text style={styles.sortValue}>Mais recentes</Text>
        </PressableOpacity>
      </View>

      <FlatList
        data={filteredProjects}
        renderItem={renderProjectCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Building2 size={40} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Nenhuma obra encontrada</Text>
            <Text style={styles.emptyDescription}>
              Tente alterar os filtros ou criar uma nova obra.
            </Text>
          </View>
        }
      />

      <PressableOpacity
        style={[styles.fab, { bottom: insets.bottom + 24 }]}
        onPress={() => router.push("/(tabs)/projects/create")}
      >
        <Plus size={18} color={colors.textOnBrand} />
      </PressableOpacity>
    </View>
  );
}
