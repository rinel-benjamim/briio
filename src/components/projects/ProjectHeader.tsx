import { View, Text, StyleSheet } from "react-native";
import { colors, typography, borderRadius } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import type { ProjectStatus } from "@/types";
import { PROJECT_STATUS_CONFIG_UPPERCASE } from "@/constants/statuses";

interface ProjectHeaderProps {
  name: string;
  location?: string;
  status: ProjectStatus;
}

export function ProjectHeader({ name, location, status }: ProjectHeaderProps) {
  const colors = useThemeColors();
  const config = PROJECT_STATUS_CONFIG_UPPERCASE[status];

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
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0.5,
  },
  name: {
    ...typography.presets.h1,
    color: colors.textMain,
  },
  location: {
    ...typography.presets.body,
    color: colors.textMuted,
  },
});
