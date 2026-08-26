import { View, Text, StyleSheet } from "react-native";
import { colors, typography, borderRadius } from "@/constants";

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
    <View style={styles.summaryCard}>
      <View style={styles.summaryLeft}>
        <Text style={styles.summaryLabel}>{leftLabel}</Text>
        <Text style={styles.summaryValue}>{leftValue}</Text>
      </View>
      <View style={styles.summaryRight}>
        <Text style={styles.summaryLabel}>{rightLabel}</Text>
        <Text style={styles.summaryValue}>{rightValue}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: borderRadius.lg,
    padding: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  summaryLeft: {
    gap: 4,
  },
  summaryRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  summaryLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.presets.h1,
    color: colors.brandPrimary,
  },
});
