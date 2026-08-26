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
    <PressableOpacity style={styles.addButton} onPress={onPress}>
      <Plus size={18} color={colors.brandPrimary} />
      <Text style={styles.addButtonText}>{label}</Text>
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: borderRadius.lg,
    height: 56,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  addButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.brandPrimary,
  },
});
