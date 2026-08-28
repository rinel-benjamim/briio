import { View, Text, Switch, StyleSheet } from "react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography } from "@/constants";

interface SwitchSettingProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function SwitchSetting({ label, description, value, onValueChange }: SwitchSettingProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={styles.textGroup}>
        <Text style={[styles.label, { color: colors.textMain }]}>{label}</Text>
        {description && (
          <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
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
