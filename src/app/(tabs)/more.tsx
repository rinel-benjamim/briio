import { View, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography } from "@/constants";

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8, backgroundColor: colors.bgMain }]}>
      <Text style={[styles.title, { color: colors.textMain }]}>Mais</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    ...typography.presets.h2,
  },
});
