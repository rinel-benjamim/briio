import { View, ScrollView, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Sun, Moon, Smartphone, Check } from "lucide-react-native";
import { useThemeColors, useThemeMode, type ThemeMode } from "@/contexts/ThemeContext";
import { typography, borderRadius } from "@/constants";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

const OPTIONS: { key: ThemeMode; label: string; description: string; icon: React.ReactNode }[] = [
  { key: "light", label: "Claro", description: "Tema claro sempre ativo", icon: <Sun size={20} /> },
  { key: "dark", label: "Escuro", description: "Tema escuro sempre ativo", icon: <Moon size={20} /> },
  { key: "system", label: "Sistema", description: "Seguir definições do dispositivo", icon: <Smartphone size={20} /> },
];

export default function AppearanceScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { themeMode, setThemeMode } = useThemeMode();

  const styles = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      backgroundColor: colors.bgMain,
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 24,
      paddingTop: 8,
      gap: 24,
    },
    section: {
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    sectionLabel: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.bold,
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      gap: 14,
    },
    optionIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    optionText: {
      flex: 1,
      gap: 2,
    },
    optionLabel: {
      ...typography.presets.body,
      color: colors.textMain,
    },
    optionDescription: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <ScreenHeader title="Aparência" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.sectionLabel}>Tema</Text>
          <View style={styles.section}>
            {OPTIONS.map((opt, i) => {
              const active = themeMode === opt.key;
              const iconColor = active ? colors.primary : colors.textMuted;
              return (
                <PressableOpacity
                  key={opt.key}
                  style={styles.option}
                  onPress={() => setThemeMode(opt.key)}
                >
                  <View style={[styles.optionIcon, { backgroundColor: active ? `${colors.primary}18` : colors.bgMain }]}>
                    <Text style={{ color: iconColor }}>{opt.icon}</Text>
                  </View>
                  <View style={styles.optionText}>
                    <Text style={styles.optionLabel}>{opt.label}</Text>
                    <Text style={styles.optionDescription}>{opt.description}</Text>
                  </View>
                  {active && <Check size={20} color={colors.primary} />}
                </PressableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
