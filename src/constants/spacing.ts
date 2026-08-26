export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
} as const;

export type SpacingToken = keyof typeof spacing;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 10,
  xl: 12,
  "2xl": 16,
  "3xl": 20,
  "4xl": 24,
  full: 9999,
} as const;

export type BorderRadiusToken = keyof typeof borderRadius;

export const padding = {
  screen: {
    horizontal: spacing.xl,
    vertical: spacing.lg,
  },
  card: {
    horizontal: spacing.lg,
    vertical: spacing.lg,
  },
  button: {
    horizontal: spacing.xl,
    vertical: spacing.lg,
  },
  input: {
    horizontal: 14,
    vertical: spacing.sm,
  },
} as const;
