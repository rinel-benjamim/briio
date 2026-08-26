export const colors = {
  // Canvas / Background
  bgMain: "#F5F7F6",
  bgSurface: "#FFFFFF",
  bgElevated: "#FAFAFA",

  // Primary / Brand
  primary: "#176B50",
  primaryHover: "#0D4937",
  primaryLight: "#DDF5E9",

  // Text
  textMain: "#13201C",
  textMuted: "#687770",
  textOnBrand: "#FFFFFF",

  // Status
  success: "#176B50",
  successBg: "#DDF5E9",
  warning: "#E69B2D",
  warningBg: "#FFF2D8",

  // Borders / Dividers
  border: "#DDE5E1",
  borderFocus: "#176B50",

  // Progress
  progressTrack: "#EDF2F0",

  // Hero card
  heroBg: "#15221D",

  // Tab bar
  activeTabBg: "#DDF5E9",
  inactiveIcon: "#687770",

  // Shadows
  shadowCard: "0px 2px 8px rgba(0, 0, 0, 0.04)",
  shadowHero: "0px 8px 24px rgba(16, 32, 25, 0.08)",
  shadowSheet: "0px -4px 24px rgba(0, 0, 0, 0.08)",

  // Overlay
  overlay: "rgba(0, 0, 0, 0.3)",

  // Legacy aliases
  brandPrimary: "#176B50",
  surfaceBg: "#F5F7F6",
  textPrimary: "#13201C",
  textSecondary: "#687770",
  textTertiary: "#94A3B8",
} as const;

export type ColorToken = keyof typeof colors;
