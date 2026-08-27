import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";

interface PressableOpacityProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  pressedOpacity?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableOpacity({
  children,
  style,
  pressedOpacity = 0.7,
  ...rest
}: PressableOpacityProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 20, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      style={[style, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
