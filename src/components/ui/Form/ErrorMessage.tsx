import React from "react";
import { Text } from "react-native";
import { useThemeColors } from "@/contexts/ThemeContext";

interface ErrorMessageProps {
  message?: string;
  visible?: boolean;
}

export function ErrorMessage({ message, visible }: ErrorMessageProps) {
  const colors = useThemeColors();
  if (!visible || !message) return null;
  return (
    <Text style={{ color: colors.error, fontSize: 12, marginTop: 4 }}>
      {message}
    </Text>
  );
}
