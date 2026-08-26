import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function ProjectsLayout() {
  const scheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: scheme === "dark" ? "#0F172A" : "#F4F6F4" },
      }}
    >
      <Stack.Screen name="index" options={{ animation: "default" }} />
      <Stack.Screen name="create" options={{ animation: "slide_from_right" }} />
    </Stack>
  );
}
