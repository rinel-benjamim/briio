import { View, StyleSheet, Text, TextInput, type TextInputProps } from "react-native";
import { colors, typography } from "@/constants";

interface TextAreaProps extends TextInputProps {
  label: string;
  height?: number;
}

export function TextArea({ label, height = 88, style, ...props }: TextAreaProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, { height }, style]}
        placeholderTextColor={colors.textSecondary}
        multiline
        textAlignVertical="top"
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
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    ...typography.presets.body,
    color: colors.textPrimary,
  },
});
