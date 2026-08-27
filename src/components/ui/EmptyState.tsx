import { View, Text, StyleSheet } from "react-native";
import { typography } from "@/constants";
import { useThemedStyles } from "@/hooks/useThemedStyles";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const styles = useThemedStyles((colors) => ({
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
      ...typography.presets.h3,
      color: colors.textMain,
      textAlign: "center",
    },
    description: {
      ...typography.presets.body,
      color: colors.textMuted,
      textAlign: "center",
    },
    action: {
      marginTop: 8,
    },
  }));

  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}
