import { View, Text, StyleSheet } from "react-native";
import { colors, typography } from "@/constants";
import type { ProjectStatus } from "@/components/projects/ProjectCard";

interface ProjectHeaderProps {
  name: string;
  location?: string;
  status: ProjectStatus;
}

const statusConfig: Record<
  ProjectStatus,
  { label: string; dotColor: string; bgColor: string; textColor: string }
> = {
  active: {
    label: "ATIVA",
    dotColor: "#16A34A",
    bgColor: "#DCFCE7",
    textColor: "#15803D",
  },
  completed: {
    label: "CONCLUÍDA",
    dotColor: colors.textTertiary,
    bgColor: "#F3F4F6",
    textColor: colors.textSecondary,
  },
  paused: {
    label: "PAUSADA",
    dotColor: colors.warning,
    bgColor: colors.warningBg,
    textColor: colors.warning,
  },
};

export function ProjectHeader({ name, location, status }: ProjectHeaderProps) {
  const config = statusConfig[status];

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
        <View style={[styles.dot, { backgroundColor: config.dotColor }]} />
        <Text style={[styles.badgeText, { color: config.textColor }]}>
          {config.label}
        </Text>
      </View>
      <Text style={styles.name}>{name}</Text>
      {location && <Text style={styles.location}>{location}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0.5,
  },
  name: {
    ...typography.presets.h2,
    color: colors.textPrimary,
  },
  location: {
    ...typography.presets.body,
    color: colors.textSecondary,
  },
});
