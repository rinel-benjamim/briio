import { View, Text, StyleSheet } from "react-native";
import { colors, typography, borderRadius } from "@/constants";
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
    <View style={styles.segmentedControl}>
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
              styles.segmentText,
              option === selected && styles.segmentTextActive,
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
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: borderRadius.md,
    padding: 3,
    gap: 3,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
  },
  segmentActive: {
    backgroundColor: colors.brandPrimary,
  },
  segmentText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: "#FFFFFF",
    fontWeight: typography.fontWeight.semibold,
  },
});
