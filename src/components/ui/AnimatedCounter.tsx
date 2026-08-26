import { useEffect, useRef } from "react";
import { Text, type TextProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface AnimatedCounterProps extends TextProps {
  value: number;
  duration?: number;
}

export function AnimatedCounter({ value, duration = 500, ...rest }: AnimatedCounterProps) {
  const sharedValue = useSharedValue(0);
  const textRef = useRef<Text>(null);

  useEffect(() => {
    sharedValue.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, duration, sharedValue]);

  const animatedProps = useAnimatedProps(() => {
    return {
      text: `${Math.round(sharedValue.value)}`,
    } as any;
  });

  return <Animated.Text ref={textRef} animatedProps={animatedProps} {...rest} />;
}
