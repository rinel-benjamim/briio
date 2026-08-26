import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useThemeColors } from "@/contexts/ThemeContext";

export function LoadingScreen() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.bgMain }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
