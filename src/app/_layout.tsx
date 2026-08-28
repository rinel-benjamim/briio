import { Stack } from "expo-router";
import { StatusBar, Platform } from "react-native";
import * as SystemUI from "expo-system-ui";
import { DatabaseProvider } from "@/database";
import { ThemeProvider, useThemeMode } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import SplashScreen from "@/components/onboarding/SplashScreen";
import OnboardingGuard from "@/components/onboarding/OnboardingGuard";

function StatusBarBridge() {
  const { isDark } = useThemeMode();

  useEffect(() => {
    if (Platform.OS === "android") {
      SystemUI.setBackgroundColorAsync(isDark ? "#141A17" : "#15221D");
    }
  }, [isDark]);

  return <StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent={false} />;
}

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <>
        <StatusBar barStyle="light-content" translucent={false} />
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </>
    );
  }

  return (
    <DatabaseProvider>
      <ThemeProvider>
        <StatusBarBridge />
        <OnboardingGuard />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#F5F7F6" },
          }}
        />
      </ThemeProvider>
    </DatabaseProvider>
  );
}
