import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { DatabaseProvider } from "@/database";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function RootLayout() {
  const scheme = useColorScheme();

  return (
    <DatabaseProvider>
      <ThemeProvider>
        <StatusBar style={scheme === "dark" ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: scheme === "dark" ? "#0B0E0C" : "#F5F7F6" },
          }}
        />
      </ThemeProvider>
    </DatabaseProvider>
  );
}
