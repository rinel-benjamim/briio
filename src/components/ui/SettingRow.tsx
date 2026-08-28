import { View, Text, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

interface SettingRowProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  rightSlot?: React.ReactNode;
  destructive?: boolean;
}

export function SettingRow({ label, description, icon, onPress, rightSlot, destructive }: SettingRowProps) {
  const colors = useThemeColors();
  const labelColor = destructive ? colors.error : colors.textMain;

  return (
    <PressableOpacity style={styles.container} onPress={onPress} disabled={!onPress}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <View style={styles.textGroup}>
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
        {description && (
          <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text>
        )}
      </View>
      {rightSlot ?? (onPress && <ChevronRight size={18} color={colors.textMuted} />)}
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  textGroup: {
    flex: 1,
    gap: 2,
  },
  label: {
    ...typography.presets.body,
  },
  description: {
    ...typography.presets.caption,
  },
});
