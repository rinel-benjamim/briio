import { Platform } from "react-native";

const fontFamily = Platform.select({
  ios: "Inter",
  android: "Inter",
  default: "Inter",
});

export const typography = {
  fontFamily,

  // Font sizes
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    "2xl": 20,
    "3xl": 24,
    "4xl": 30,
  },

  // Line heights
  lineHeight: {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    "2xl": 32,
    "3xl": 36,
    "4xl": 42,
  },

  // Font weights
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },

  // Preset styles
  presets: {
    h1: {
      fontSize: 30 as const,
      lineHeight: 42 as const,
      fontWeight: "700" as const,
    },
    h2: {
      fontSize: 24 as const,
      lineHeight: 36 as const,
      fontWeight: "700" as const,
    },
    h3: {
      fontSize: 20 as const,
      lineHeight: 32 as const,
      fontWeight: "600" as const,
    },
    h4: {
      fontSize: 18 as const,
      lineHeight: 28 as const,
      fontWeight: "600" as const,
    },
    body: {
      fontSize: 16 as const,
      lineHeight: 24 as const,
      fontWeight: "400" as const,
    },
    bodySmall: {
      fontSize: 14 as const,
      lineHeight: 20 as const,
      fontWeight: "400" as const,
    },
    label: {
      fontSize: 12 as const,
      lineHeight: 16 as const,
      fontWeight: "500" as const,
    },
    caption: {
      fontSize: 10 as const,
      lineHeight: 14 as const,
      fontWeight: "400" as const,
    },
  },
} as const;

export type TypographyPreset = keyof typeof typography.presets;
