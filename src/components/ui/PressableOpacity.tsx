import { Pressable, type PressableProps, type Style } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface PressableOpacityProps extends PressableProps {
  children: React.ReactNode;
  style?: Style;
  pressedOpacity?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableOpacity({
  children,
  style,
  pressedOpacity = 0.7,
  ...rest
}: PressableOpacityProps) {
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    opacity.value = withTiming(pressedOpacity, { duration: 100 });
  };

  const handlePressOut = () => {
    opacity.value = withTiming(1, { duration: 200 });
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
