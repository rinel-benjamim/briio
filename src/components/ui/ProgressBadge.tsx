import { View, Text, StyleSheet } from "react-native";
import { colors, typography, borderRadius } from "@/constants";

interface ProgressBadgeProps {
  current: number;
  total: number;
}

export function ProgressBadge({ current, total }: ProgressBadgeProps) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>
        {current} de {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  text: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
});
