import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { colors, typography } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, onBack, right }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
      {onBack ? (
        <PressableOpacity style={styles.navButton} onPress={onBack}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </PressableOpacity>
      ) : (
        <View style={styles.navSpacer} />
      )}
      <Text style={styles.navTitle}>{title}</Text>
      {right ?? <View style={styles.navSpacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 12,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  navTitle: {
    flex: 1,
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  navSpacer: {
    width: 48,
    height: 48,
  },
});
