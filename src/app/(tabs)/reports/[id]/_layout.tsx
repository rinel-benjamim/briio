import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function ReportDetailLayout() {
  const scheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: scheme === "dark" ? "#0F172A" : "#F4F6F4" },
      }}
    >
      <Stack.Screen name="index" options={{ animation: "default" }} />
      <Stack.Screen name="weather" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="workforce" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="materials" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="equipment" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="tasks" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="occurrences" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="observations" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="photos" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="review" options={{ animation: "fade" }} />
      <Stack.Screen name="generated" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="add-workforce" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="edit-workforce" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="add-material" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="edit-material" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="add-equipment" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="edit-equipment" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="add-task" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="edit-task" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="add-occurrence" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="edit-occurrence" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="add-photo" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="edit-photo" options={{ animation: "slide_from_bottom" }} />
    </Stack>
  );
}
