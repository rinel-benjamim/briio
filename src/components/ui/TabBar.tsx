import { useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography } from "@/constants";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

type TabBarProps = {
  state: any;
  navigation: any;
  descriptors: any;
};

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
  const colors = useThemeColors();
  const bgProgress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    bgProgress.value = withTiming(isActive ? 1 : 0, { duration: 150 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      bgProgress.value,
      [0, 1],
      ["transparent", colors.activeTabBg]
    ),
  }));

  return (
    <Animated.View style={[styles.tab, animatedStyle]}>
      <Pressable style={styles.tabInner} onPress={onPress}>
        {icon}
        <Text style={[styles.label, { color: isActive ? colors.primary : colors.inactiveIcon, fontWeight: isActive ? typography.fontWeight.bold : typography.fontWeight.medium }]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function CustomTabBar({ state, navigation, descriptors }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8, backgroundColor: colors.bgSurface, borderTopColor: colors.border }]}>
      <View style={styles.bar}>
        {state.routes.map((route: any, index: number) => {
          const isActive = state.index === index;
          const options = descriptors[route.key]?.options;
          const label = options?.title ?? route.name;
          const iconColor = isActive ? colors.primary : colors.inactiveIcon;
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
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  bar: {
    flexDirection: "row",
    gap: 4,
  },
  tab: {
    flex: 1,
    borderRadius: 16,
    height: 58,
  },
  tabInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  label: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
  },
});
