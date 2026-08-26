import { View, Text, StyleSheet } from "react-native";
import { colors, typography, borderRadius } from "@/constants";

type BadgeVariant = "success" | "warning" | "info" | "default";

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  uppercase?: boolean;
}

const VARIANT_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: colors.successBg, text: colors.success },
  warning: { bg: colors.warningBg, text: colors.warning },
  info: { bg: colors.primaryLight, text: colors.primary },
  default: { bg: "#F4F6F4", text: colors.textMuted },
};

export function StatusBadge({
  label,
  variant = "default",
  uppercase = false,
}: StatusBadgeProps) {
  const variantColors = VARIANT_COLORS[variant];
  return (
    <View style={[styles.badge, { backgroundColor: variantColors.bg }]}>
      <Text
        style={[
          styles.text,
          { color: variantColors.text },
          uppercase && styles.uppercase,
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
    borderRadius: borderRadius.md,
    alignSelf: "flex-start",
  },
  text: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    fontSize: 11,
  },
  uppercase: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
