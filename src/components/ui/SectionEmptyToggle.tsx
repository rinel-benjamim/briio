import { useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { Ban } from "lucide-react-native";
import { typography } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useRdoService } from "@/services/rdo.service";

interface SectionEmptyToggleProps {
  rdoId: string;
  section: string;
  hasData: boolean;
  onToggle?: () => void;
}

export function SectionEmptyToggle({ rdoId, section, hasData, onToggle }: SectionEmptyToggleProps) {
  const colors = useThemeColors();
  const rdoService = useRdoService();
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    rdoService.isSectionSkipped(rdoId, section).then(setSkipped);
  }, [rdoId, section]);

  const handleToggle = async () => {
    const newValue = !skipped;
    setSkipped(newValue);
    await rdoService.toggleSkippedSection(rdoId, section);
    onToggle?.();
  };

  if (hasData) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.bgSurface, borderColor: colors.border }]}>
      <View style={styles.left}>
        <Ban size={16} color={colors.textMuted} />
        <Text style={[styles.label, { color: colors.textMuted }]}>
          Sem dados para hoje
        </Text>
      </View>
      <Switch
        value={skipped}
        onValueChange={handleToggle}
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
    padding: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    ...typography.presets.body,
  },
});
