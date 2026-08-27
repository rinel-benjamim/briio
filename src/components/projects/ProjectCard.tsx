import { View, Text, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import { typography, borderRadius, shadows } from "@/constants";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/contexts/ThemeContext";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import type { ProjectStatus } from "@/types";

export type { ProjectStatus };

interface ProjectCardProps {
  id: string;
  name: string;
  location?: string;
  lastRdo?: string;
  status: ProjectStatus;
  onPress?: () => void;
}

export function ProjectCard({
  id,
  name,
  location,
  lastRdo,
  status,
  onPress,
}: ProjectCardProps) {
  const colors = useThemeColors();

  const statusConfig: Record<ProjectStatus, { label: string; dotColor: string; bgColor: string; textColor: string }> = {
    active: {
      label: "Em andamento",
      dotColor: colors.success,
      bgColor: colors.successBg,
      textColor: colors.success,
    },
    completed: {
      label: "Concluído",
      dotColor: colors.textMuted,
      bgColor: colors.bgMain,
      textColor: colors.textMuted,
    },
    archived: {
      label: "Arquivada",
      dotColor: colors.warning,
      bgColor: colors.warningBg,
      textColor: colors.warning,
    },
  };

  const config = statusConfig[status];

  const styles = useThemedStyles((colors) => ({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.sm,
    },
    left: {
      flex: 1,
    },
    info: {
      gap: 4,
    },
    name: {
      ...typography.presets.bodyMedium,
      color: colors.textMain,
    },
    location: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    meta: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    right: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    badge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
      gap: 4,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    badgeText: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
    },
  }));

  return (
    <PressableOpacity
      style={styles.container}
      onPress={onPress ?? (() => router.push(`/(tabs)/projects/${id}`))}
    >
      <View style={styles.left}>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {location && (
            <Text style={styles.location} numberOfLines={1}>
              {location}
            </Text>
          )}
          {lastRdo && <Text style={styles.meta}>{lastRdo}</Text>}
        </View>
      </View>
      <View style={styles.right}>
        <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
          <View style={[styles.dot, { backgroundColor: config.dotColor }]} />
          <Text style={[styles.badgeText, { color: config.textColor }]}>
            {config.label}
          </Text>
        </View>
        <ChevronRight size={16} color={colors.textMuted} />
      </View>
    </PressableOpacity>
  );
}
