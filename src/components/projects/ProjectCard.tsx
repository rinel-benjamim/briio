import { View, Text, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import type { ProjectStatus } from "@/types";
import { PROJECT_STATUS_CONFIG } from "@/constants/statuses";

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
  const config = PROJECT_STATUS_CONFIG[status];

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
        <ChevronRight size={16} color={colors.textTertiary} />
      </View>
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  left: {
    flex: 1,
  },
  info: {
    gap: 6,
  },
  name: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  location: {
    ...typography.presets.bodySmall,
    color: colors.textSecondary,
  },
  meta: {
    ...typography.presets.caption,
    color: colors.textSecondary,
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
});
