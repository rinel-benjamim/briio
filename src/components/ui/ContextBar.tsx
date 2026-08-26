import { View, Text, StyleSheet } from "react-native";
import { colors, typography } from "@/constants";

interface ContextBarProps {
  date: string;
  projectName: string;
}

export function ContextBar({ date, projectName }: ContextBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.project}>{projectName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  date: {
    ...typography.presets.caption,
    color: colors.textMuted,
  },
  project: {
    ...typography.presets.bodyMedium,
    color: colors.textMain,
  },
});
