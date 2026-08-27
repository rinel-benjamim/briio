import { StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Pressable } from "react-native";

interface AnimatedFABProps {
  onPress: () => void;
  bottomOffset?: number;
}

export function AnimatedFAB({ onPress, bottomOffset = 24 }: AnimatedFABProps) {
  const colors = useThemeColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 20, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  };

  return (
    <Animated.View style={[styles.fab, { bottom: bottomOffset, backgroundColor: colors.primary, shadowColor: colors.primary }, animatedStyle]}>
      <Pressable
        style={styles.fabInner}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Plus size={24} color={colors.textOnBrand} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.24,
    shadowRadius: 12,
    elevation: 6,
  },
  fabInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});
