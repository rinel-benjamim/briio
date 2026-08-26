import { type ReactNode } from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColors } from "@/contexts/ThemeContext";

interface GradientCardProps {
  children: ReactNode;
  colors?: [string, string, ...string[]];
  style?: object;
}

export function GradientCard({
  children,
  colors: gradientColors,
  style,
}: GradientCardProps) {
  const themeColors = useThemeColors();

  const defaultColors: [string, string, ...string[]] = [themeColors.heroBg, themeColors.bgElevated];

  return (
    <LinearGradient
      colors={gradientColors || defaultColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 20,
  },
});
