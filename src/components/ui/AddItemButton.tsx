import { Text, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

interface AddItemButtonProps {
  label: string;
  onPress: () => void;
}

export function AddItemButton({ label, onPress }: AddItemButtonProps) {
  const colors = useThemeColors();

  return (
    <PressableOpacity style={[styles.button, { backgroundColor: colors.bgSurface, borderColor: colors.border }]} onPress={onPress}>
      <Plus size={18} color={colors.primary} />
      <Text style={[styles.label, { color: colors.primary }]}>{label}</Text>
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius["2xl"],
    height: 56,
    gap: 8,
    borderWidth: 1,
  },
  label: {
    ...typography.presets.h3,
  },
});
