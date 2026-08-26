import { Platform } from "react-native";

const fontFamily = Platform.select({
  ios: "Inter",
  android: "Inter",
  default: "Inter",
});

export const typography = {
  fontFamily,

  // Font sizes — Figma scale
  fontSize: {
    xs: 11,
    sm: 12,
    md: 13,
    lg: 14,
    xl: 15,
    "2xl": 17,
    "3xl": 23,
    "4xl": 24,
    "5xl": 26,
    "6xl": 28,
  },

  // Line heights
  lineHeight: {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22,
    "2xl": 28,
    "3xl": 28,
    "4xl": 30,
    "5xl": 32,
  },

  // Font weights
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },

  // Preset styles — Figma
  presets: {
    h1: {
      fontSize: 24 as const,
      lineHeight: 28 as const,
      fontWeight: "700" as const,
    },
    h2: {
      fontSize: 17 as const,
      lineHeight: 22 as const,
      fontWeight: "700" as const,
    },
    h3: {
      fontSize: 15 as const,
      lineHeight: 18 as const,
      fontWeight: "700" as const,
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
      fontSize: 13 as const,
      lineHeight: 18 as const,
      fontWeight: "400" as const,
    },
    label: {
      fontSize: 12 as const,
      lineHeight: 16 as const,
      fontWeight: "500" as const,
    },
    caption: {
      fontSize: 11 as const,
      lineHeight: 14 as const,
      fontWeight: "700" as const,
    },
    h4: {
      fontSize: 17 as const,
      lineHeight: 22 as const,
      fontWeight: "700" as const,
    },
  },
} as const;

export type TypographyPreset = keyof typeof typography.presets;
