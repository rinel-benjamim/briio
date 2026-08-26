import { View, StyleSheet, Text, TextInput, type TextInputProps } from "react-native";
import { colors, typography } from "@/constants";

interface FieldProps extends TextInputProps {
  label: string;
}

export function Field({ label, style, ...props }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  input: {
    height: 48,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    ...typography.presets.body,
    color: colors.textPrimary,
  },
});
