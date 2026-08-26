import { View, Text, StyleSheet } from "react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography, borderRadius } from "@/constants";

interface ProgressBadgeProps {
  current: number;
  total: number;
}

export function ProgressBadge({ current, total }: ProgressBadgeProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
      <Text style={[styles.text, { color: colors.primary }]}>
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
    borderWidth: 1,
  },
  text: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
  },
});
