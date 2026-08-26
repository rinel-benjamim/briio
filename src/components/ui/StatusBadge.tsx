import { View, Text, StyleSheet } from "react-native";
import { colors, typography, borderRadius } from "@/constants";

type BadgeVariant = "success" | "warning" | "info" | "default";

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  uppercase?: boolean;
}

const VARIANT_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: "rgba(16, 185, 129, 0.12)", text: "#10B981" },
  warning: { bg: "rgba(245, 158, 11, 0.12)", text: "#F59E0B" },
  info: { bg: "rgba(99, 102, 241, 0.15)", text: colors.brandPrimary },
  default: { bg: "rgba(148, 163, 184, 0.12)", text: colors.textSecondary },
};

export function StatusBadge({
  label,
  variant = "default",
  uppercase = false,
}: StatusBadgeProps) {
  const colors_ = VARIANT_COLORS[variant];
  return (
    <View style={[styles.badge, { backgroundColor: colors_.bg }]}>
      <Text
        style={[
          styles.badgeText,
          { color: colors_.text },
          uppercase && styles.badgeTextUppercase,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
  },
  badgeText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    fontSize: 11,
  },
  badgeTextUppercase: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
