import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import { colors as lightColors } from "@/constants/colors";
import { darkColors } from "@/constants/colors-dark";
import { useSettingsRepository } from "@/repositories/settings.repository";

export type ThemeColors = Record<keyof typeof lightColors, string>;
export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextData {
  colors: ThemeColors;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextData>({
  colors: lightColors as ThemeColors,
  themeMode: "system",
  setThemeMode: () => {},
  isDark: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const settingsRepo = useSettingsRepository();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    settingsRepo.get("theme_mode").then((value) => {
      if (value === "light" || value === "dark" || value === "system") {
        setThemeModeState(value);
      }
      setLoaded(true);
    });
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    settingsRepo.set("theme_mode", mode);
  };

  const isDark =
    themeMode === "system" ? scheme === "dark" : themeMode === "dark";

  const colors = (isDark ? darkColors : lightColors) as ThemeColors;

  if (!loaded) {
    const fallbackColors = (scheme === "dark" ? darkColors : lightColors) as ThemeColors;
    return (
      <ThemeContext.Provider value={{ colors: fallbackColors, themeMode: "system", setThemeMode, isDark: scheme === "dark" }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ colors, themeMode, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeColors(): ThemeColors {
  const { colors } = useContext(ThemeContext);
  return colors;
}

export function useThemeMode(): { themeMode: ThemeMode; setThemeMode: (mode: ThemeMode) => void; isDark: boolean } {
  const { themeMode, setThemeMode, isDark } = useContext(ThemeContext);
  return { themeMode, setThemeMode, isDark };
}
