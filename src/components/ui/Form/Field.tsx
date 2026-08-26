import { useState } from "react";
import { View, StyleSheet, Text, TextInput, type TextInputProps } from "react-native";
import { colors, typography, borderRadius } from "@/constants";

interface FieldProps extends TextInputProps {
  label: string;
}

export function Field({ label, style, onFocus, onBlur, ...props }: FieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused, style]}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={label}
        testID={`field-${label.toLowerCase().replace(/\s/g, "-")}`}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
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
    ...typography.presets.label,
    color: colors.textMain,
  },
  input: {
    height: 48,
    backgroundColor: colors.bgSurface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    ...typography.presets.body,
    color: colors.textMain,
  },
  inputFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 0,
  },
});
