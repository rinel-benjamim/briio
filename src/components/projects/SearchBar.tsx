import { View, TextInput, StyleSheet } from "react-native";
import { Search } from "lucide-react-native";
import { colors, typography, borderRadius } from "@/constants";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export function SearchBar({
  placeholder = "Procurar obra...",
  value,
  onChangeText,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Search size={18} color={colors.textTertiary} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: borderRadius.lg,
    paddingHorizontal: 16,
    gap: 10,
    borderWidth: 1.5,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  input: {
    flex: 1,
    ...typography.presets.bodySmall,
    color: colors.textPrimary,
  },
});
