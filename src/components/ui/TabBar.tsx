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
    <Animated.View
      style={[styles.tab, isActive && styles.activeTab, animatedStyle]}
    >
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
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const isActive = state.index === index;
          const options = descriptors[route.key]?.options;
          const label = options?.title ?? route.name;
          const iconColor = isActive ? colors.textOnBrand : colors.textTertiary;
          const Icon = options?.tabBarIcon;

          return (
            <TabItem
              key={route.key}
              label={label}
              icon={Icon ? <Icon color={iconColor} focused={isActive} size={18} /> : null}
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
    paddingBottom: spacing.lg,
    backgroundColor: "transparent",
  },
  pill: {
    flexDirection: "row",
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 28,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  tab: {
    flex: 1,
    borderRadius: 26,
  },
  activeTab: {
    backgroundColor: colors.brandPrimary,
  },
  tabInner: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 4,
  },
  label: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  activeLabel: {
    color: colors.textOnBrand,
    fontWeight: typography.fontWeight.semibold,
  },
});
