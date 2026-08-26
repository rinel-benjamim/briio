import { View, Text, Pressable, StyleSheet } from "react-native";
import type { BottomTabBarProps } from "expo-router";
import { colors, typography, spacing } from "@/constants";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

function TabItem({
  label,
  icon,
  isActive,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onPress: () => void;
}) {
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.tab, isActive && styles.activeTab, animatedStyle]}>
      <Pressable
        style={styles.tabInner}
        onPress={onPress}
        onPressIn={() => {
          opacity.value = withTiming(0.7, { duration: 100 });
        }}
        onPressOut={() => {
          opacity.value = withTiming(1, { duration: 200 });
        }}
      >
        {icon}
        <Text style={[styles.label, isActive && styles.activeLabel]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function CustomTabBar({ state, navigation, descriptors }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isActive = state.index === index;
          const options = descriptors[route.key]?.options;
          const label = options?.title ?? route.name;
          const iconColor = isActive ? colors.primary : "#7F8C83";
          const Icon = options?.tabBarIcon;

          return (
            <TabItem
              key={route.key}
              label={label}
              icon={Icon ? <Icon color={iconColor} focused={isActive} size={20} /> : null}
              isActive={isActive}
              onPress={() => navigation.navigate(route.name)}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    backgroundColor: colors.bgSurface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bar: {
    flexDirection: "row",
    backgroundColor: colors.bgSurface,
    borderRadius: 16,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: colors.primaryLight,
  },
  tabInner: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 4,
  },
  label: {
    ...typography.presets.caption,
    color: "#7F8C83",
    letterSpacing: 0.3,
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
});
