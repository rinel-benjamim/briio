export const colors = {
  // Brand / Primary (Indigo)
  brandPrimary: "#6366F1",
  brandPrimaryHover: "#4F46E5",
  brandPrimaryLight: "#818CF8",
  brandPrimaryGlow: "rgba(99, 102, 241, 0.15)",

  // Surfaces (Dark mode)
  surfaceBg: "#0F172A",
  surfaceCard: "rgba(30, 41, 59, 0.7)",
  surfaceCardSolid: "#1E293B",
  surfaceElevated: "#1E293B",
  surfaceWhite: "#FFFFFF",

  // Glass
  glassBg: "rgba(30, 41, 59, 0.6)",
  glassBorder: "rgba(148, 163, 184, 0.1)",

  // Text
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  textTertiary: "#64748B",
  textOnBrand: "#FFFFFF",

  // Borders
  borderLight: "rgba(148, 163, 184, 0.12)",
  borderSubtle: "rgba(148, 163, 184, 0.08)",
  borderFocus: "#6366F1",

  // Status
  success: "#10B981",
  successBg: "rgba(16, 185, 129, 0.12)",
  warning: "#F59E0B",
  warningBg: "rgba(245, 158, 11, 0.12)",
  danger: "#EF4444",
  dangerBg: "rgba(239, 68, 68, 0.12)",

  // Shadows (for reference)
  shadowCard: "0 10px 25px -5px rgba(0,0,0,0.3)",
  shadowElevated: "0 20px 40px -10px rgba(0,0,0,0.4)",
} as const;

export type ColorToken = keyof typeof colors;
