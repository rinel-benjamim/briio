import { View, Text, StyleSheet } from "react-native";
import { colors, typography, borderRadius, shadows } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

interface SegmentedControlProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export function SegmentedControl({
  options,
  selected,
  onSelect,
}: SegmentedControlProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <PressableOpacity
          key={option}
          style={[
            styles.segment,
            option === selected && styles.segmentActive,
          ]}
          onPress={() => onSelect(option)}
        >
          <Text
            style={[
              styles.text,
              option === selected && styles.textActive,
            ]}
          >
            {option}
          </Text>
        </PressableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.bgMain,
    borderRadius: borderRadius.lg,
    padding: 3,
    gap: 3,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  segmentActive: {
    backgroundColor: colors.bgSurface,
    ...shadows.sm,
  },
  text: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  textActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
});
