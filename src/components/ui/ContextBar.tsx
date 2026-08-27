import { View, Text, StyleSheet } from "react-native";
import { typography } from "@/constants";
import { useThemedStyles } from "@/hooks/useThemedStyles";

interface ContextBarProps {
  date: string;
  projectName: string;
}

export function ContextBar({ date, projectName }: ContextBarProps) {
  const styles = useThemedStyles((colors) => ({
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
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.project}>{projectName}</Text>
    </View>
  );
}
