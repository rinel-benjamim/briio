import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useThemeColors, type ThemeColors } from "@/contexts/ThemeContext";

export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (colors: ThemeColors) => T
): T {
  const colors = useThemeColors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => StyleSheet.create(factory(colors)), [colors]);
}
