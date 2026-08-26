import { type ReactNode } from "react";
import Animated, { FadeInUp } from "react-native-reanimated";

interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeInView({ children, delay = 0, duration = 400 }: FadeInViewProps) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(duration)}>
      {children}
    </Animated.View>
  );
}
