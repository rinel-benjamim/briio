import { View, Text, StyleSheet } from "react-native";
import { colors, typography } from "@/constants";

interface ProgressBadgeProps {
  current: number;
  total: number;
}

export function ProgressBadge({ current, total }: ProgressBadgeProps) {
  return (
    <View style={styles.progressBadge}>
      <Text style={styles.progressText}>
        {current} de {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  progressText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
});
