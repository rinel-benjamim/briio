import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeftCircle } from "lucide-react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
}

export function ScreenHeader({ title, onBack, rightSlot }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {onBack ? (
        <PressableOpacity onPress={onBack} accessibilityRole="button" accessibilityLabel="Voltar">
          <ArrowLeftCircle size={22} color={colors.textMain} />
        </PressableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}
      <Text style={[styles.title, { color: colors.textMain }]} numberOfLines={1}>
        {title}
      </Text>
      {rightSlot ?? <View style={styles.spacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },

  title: {
    flex: 1,
    ...typography.presets.h2,
  },
  spacer: {
    width: 40,
    height: 40,
  },
});
