import { View, Text, StyleSheet } from "react-native";
import { colors, typography, borderRadius, shadows } from "@/constants";

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
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.label}>{leftLabel}</Text>
        <Text style={styles.value}>{leftValue}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.label}>{rightLabel}</Text>
        <Text style={styles.value}>{rightValue}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.bgSurface,
    borderRadius: borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.textMuted,
  },
  value: {
    ...typography.presets.h2,
    color: colors.textMain,
  },
});
