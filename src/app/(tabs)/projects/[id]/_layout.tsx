import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function ProjectDetailLayout() {
  const scheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: scheme === "dark" ? "#0F172A" : "#F4F6F4" },
      }}
    >
      <Stack.Screen name="index" options={{ animation: "default" }} />
      <Stack.Screen name="info" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="edit" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="configure-rdo" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="created" options={{ animation: "slide_from_bottom" }} />
    </Stack>
  );
}
