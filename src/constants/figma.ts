import { colors, typography, borderRadius, shadows } from "@/constants";

export const figma = {
  // Figma exact colors
  canvas: "#F5F7F6",
  heroBg: "#15221D",
  primary: "#176B50",
  primaryHover: "#134E32",
  primaryLight: "#DDF5E9",
  textMain: "#13201C",
  textMuted: "#687770",
  border: "#DDE5E1",
  progressTrack: "#EDF2F0",
  warningBg: "#FFF2D8",
  warningText: "#E69B2D",
  activeTabBg: "#DDF5E9",
  inactiveIcon: "#687770",

  // Typography from Figma
  greeting: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "400" as const,
    fontFamily: typography.fontFamily,
  },
  heroPercent: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "400" as const,
    fontFamily: typography.fontFamily,
  },
  heroSteps: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
    fontFamily: typography.fontFamily,
  },
  weatherTitle: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "400" as const,
    fontFamily: typography.fontFamily,
  },
  sectionLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700" as const,
    fontFamily: typography.fontFamily,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
} as const;
