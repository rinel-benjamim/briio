import { Platform } from "react-native";

const fontFamily = Platform.select({
  ios: "Inter",
  android: "Inter",
  default: "Inter",
});

export const typography = {
  fontFamily,

  // Font sizes — Master Design System scale
  fontSize: {
    xs: 12,
    sm: 12,
    md: 14,
    lg: 15,
    xl: 18,
    "2xl": 20,
    "3xl": 24,
    "4xl": 30,
  },

  // Line heights
  lineHeight: {
    xs: 16,
    sm: 16,
    md: 20,
    lg: 18,
    xl: 22,
    "2xl": 28,
    "3xl": 28,
    "4xl": 42,
  },

  // Font weights
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },

  // Preset styles — Master Design System
  presets: {
    h1: {
      fontSize: 24 as const,
      lineHeight: 28 as const,
      fontWeight: "700" as const,
    },
    h2: {
      fontSize: 18 as const,
      lineHeight: 22 as const,
      fontWeight: "600" as const,
    },
    h3: {
      fontSize: 15 as const,
      lineHeight: 18 as const,
      fontWeight: "600" as const,
    },
    h4: {
      fontSize: 18 as const,
      lineHeight: 22 as const,
      fontWeight: "600" as const,
    },
    body: {
      fontSize: 14 as const,
      lineHeight: 20 as const,
      fontWeight: "400" as const,
    },
    bodyMedium: {
      fontSize: 14 as const,
      lineHeight: 20 as const,
      fontWeight: "500" as const,
    },
    bodySmall: {
      fontSize: 14 as const,
      lineHeight: 20 as const,
      fontWeight: "400" as const,
    },
    label: {
      fontSize: 13 as const,
      lineHeight: 18 as const,
      fontWeight: "600" as const,
    },
    caption: {
      fontSize: 12 as const,
      lineHeight: 16 as const,
      fontWeight: "500" as const,
    },
  },
} as const;

export type TypographyPreset = keyof typeof typography.presets;
