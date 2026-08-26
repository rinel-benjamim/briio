import { View, Text, StyleSheet } from "react-native";
import { colors, typography } from "@/constants";

interface ContextBarProps {
  date: string;
  projectName: string;
}

export function ContextBar({ date, projectName }: ContextBarProps) {
  return (
    <View style={styles.context}>
      <Text style={styles.contextDate}>{date}</Text>
      <Text style={styles.contextProject}>{projectName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  context: {
    gap: 2,
  },
  contextDate: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  contextProject: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
});
