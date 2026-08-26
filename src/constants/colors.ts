export const colors = {
  // Canvas / Background
  bgMain: "#F4F6F4",
  bgSurface: "#FFFFFF",
  bgElevated: "#FAFAFA",

  // Primary / Brand (Forest Green)
  primary: "#134E32",
  primaryHover: "#0D3823",
  primaryLight: "#E6F4EA",

  // Text
  textMain: "#1A2E22",
  textMuted: "#5B6E63",
  textOnBrand: "#FFFFFF",

  // Status
  success: "#137333",
  successBg: "#E6F4EA",
  warning: "#B96A00",
  warningBg: "#FFF8F0",

  // Borders / Dividers
  border: "#E0E6E1",
  borderFocus: "#134E32",

  // Shadows
  shadowCard: "0px 2px 8px rgba(0, 0, 0, 0.04)",
  shadowHero: "0px 6px 20px rgba(19, 78, 50, 0.08)",
  shadowSheet: "0px -4px 24px rgba(0, 0, 0, 0.08)",

  // Overlay
  overlay: "rgba(0, 0, 0, 0.3)",

  // Legacy aliases (for gradual migration)
  brandPrimary: "#134E32",
  brandPrimaryHover: "#0D3823",
  brandPrimaryLight: "#E6F4EA",
  brandPrimaryGlow: "rgba(19, 78, 50, 0.1)",
  surfaceBg: "#F4F6F4",
  surfaceCard: "#FFFFFF",
  surfaceCardSolid: "#FFFFFF",
  surfaceElevated: "#FAFAFA",
  surfaceWhite: "#FFFFFF",
  glassBg: "#FFFFFF",
  glassBorder: "#E0E6E1",
  textPrimary: "#1A2E22",
  textSecondary: "#5B6E63",
  textTertiary: "#94A3B8",
  borderLight: "#E0E6E1",
  borderSubtle: "#E0E6E1",
} as const;

export type ColorToken = keyof typeof colors;
