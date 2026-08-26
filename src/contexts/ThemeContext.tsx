import { createContext, useContext, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import { colors as lightColors } from "@/constants/colors";
import { darkColors } from "@/constants/colors-dark";

type ThemeColors = Record<keyof typeof lightColors, string>;

const ThemeContext = createContext<ThemeColors>(lightColors as ThemeColors);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const themeColors = (scheme === "dark" ? darkColors : lightColors) as ThemeColors;

  return (
    <ThemeContext.Provider value={themeColors}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeColors(): ThemeColors {
  return useContext(ThemeContext);
}
