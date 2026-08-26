import { View, Text, StyleSheet } from "react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography, borderRadius, shadows } from "@/constants";

interface SummaryCardProps {
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
}

export function SummaryCard({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}: SummaryCardProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.bgSurface, borderColor: colors.border }]}>
      <View style={styles.left}>
        <Text style={[styles.label, { color: colors.textMuted }]}>{leftLabel}</Text>
        <Text style={[styles.value, { color: colors.textMain }]}>{leftValue}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.label, { color: colors.textMuted }]}>{rightLabel}</Text>
        <Text style={[styles.value, { color: colors.textMain }]}>{rightValue}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    ...shadows.sm,
  },
  left: {
    gap: 4,
  },
  right: {
    alignItems: "flex-end",
    gap: 4,
  },
  label: {
    ...typography.presets.caption,
  },
  value: {
    ...typography.presets.h2,
  },
});
