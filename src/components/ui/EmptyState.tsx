import { View, Text, StyleSheet } from "react-native";
import { colors, typography } from "@/constants";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    gap: 12,
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  description: {
    ...typography.presets.bodySmall,
    color: colors.textSecondary,
    textAlign: "center",
  },
  action: {
    marginTop: 8,
  },
});
