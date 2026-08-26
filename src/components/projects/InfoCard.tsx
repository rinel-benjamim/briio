import { View, Text, StyleSheet } from "react-native";
import { colors, typography, borderRadius } from "@/constants";

interface InfoField {
  label: string;
  value: string;
}

interface InfoCardProps {
  fields: InfoField[];
}

export function InfoCard({ fields }: InfoCardProps) {
  const rows: InfoField[][] = [];
  for (let i = 0; i < fields.length; i += 2) {
    rows.push(fields.slice(i, i + 2));
  }

  return (
    <View style={styles.card}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.label}>{row[0]?.label}</Text>
            <Text style={styles.value}>{row[0]?.value}</Text>
          </View>
          {row.length === 2 && <View style={styles.verticalDivider} />}
          {row.length === 2 && (
            <View style={styles.cell}>
              <Text style={styles.label}>{row[1]?.label}</Text>
              <Text style={styles.value}>{row[1]?.value}</Text>
            </View>
          )}
          {row.length === 1 && <View style={styles.cell} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  cell: {
    flex: 1,
    padding: 14,
    paddingHorizontal: 16,
    gap: 4,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: "rgba(229, 231, 235, 0.3)",
    marginVertical: 14,
  },
  label: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  value: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
});
