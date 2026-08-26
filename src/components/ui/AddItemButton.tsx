import { Text, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

interface AddItemButtonProps {
  label: string;
  onPress: () => void;
}

export function AddItemButton({ label, onPress }: AddItemButtonProps) {
  return (
    <PressableOpacity style={styles.button} onPress={onPress}>
      <Plus size={18} color={colors.primary} />
      <Text style={styles.label}>{label}</Text>
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgSurface,
    borderRadius: borderRadius.lg,
    height: 52,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    ...typography.presets.h3,
    color: colors.primary,
  },
});
