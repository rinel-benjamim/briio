import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, typography, spacing } from "@/constants";
import { figma } from "@/constants/figma";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
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

export function CustomTabBar({ state, navigation, descriptors }: TabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {state.routes.map((route: any, index: number) => {
          const isActive = state.index === index;
          const options = descriptors[route.key]?.options;
          const label = options?.title ?? route.name;
          const iconColor = isActive ? figma.primary : figma.inactiveIcon;
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
    paddingBottom: spacing.sm,
    backgroundColor: colors.bgSurface,
    borderTopWidth: 1,
    borderTopColor: figma.border,
  },
  bar: {
    flexDirection: "row",
    backgroundColor: colors.bgSurface,
    gap: 4,
  },
  tab: {
    flex: 1,
    borderRadius: 16,
    height: 58,
  },
  activeTab: {
    backgroundColor: figma.activeTabBg,
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
    color: figma.inactiveIcon,
  },
  activeLabel: {
    color: figma.primary,
    fontWeight: typography.fontWeight.bold,
  },
});
