import { View, ScrollView, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Palette, Database, Info } from "lucide-react-native";
import { useThemeColors, useThemeMode, type ThemeMode } from "@/contexts/ThemeContext";
import { typography, borderRadius } from "@/constants";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useProfile } from "@/hooks/useProfile";
import { SettingRow } from "@/components/ui/SettingRow";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

const THEME_LABELS: Record<ThemeMode, string> = {
  light: "Claro",
  dark: "Escuro",
  system: "Sistema",
};

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { themeMode } = useThemeMode();
  const { profile } = useProfile();

  const styles = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      backgroundColor: colors.bgMain,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 24,
      paddingTop: 8,
      gap: 24,
    },
    header: {
      gap: 2,
    },
    title: {
      ...typography.presets.h2,
      color: colors.textMain,
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
    profileCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      gap: 14,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      ...typography.presets.bodyMedium,
      color: colors.primary,
    },
    profileInfo: {
      flex: 1,
      gap: 2,
    },
    profileName: {
      ...typography.presets.bodyMedium,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
    profileRole: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
  }));

  const initials = profile
    ? profile.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Mais</Text>
        </View>

        <View>
          <Text style={styles.sectionLabel}>Perfil</Text>
          <View style={styles.section}>
            <PressableOpacity style={styles.profileCard} onPress={() => router.push("/(tabs)/more/profile")}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile?.name ?? "Definir perfil"}</Text>
                <Text style={styles.profileRole}>{profile?.role ?? "Engenheiro(a) civil"}</Text>
              </View>
            </PressableOpacity>
          </View>
        </View>

        <View>
          <Text style={styles.sectionLabel}>Aparência</Text>
          <View style={styles.section}>
            <SettingRow
              label="Tema"
              description={THEME_LABELS[themeMode]}
              icon={<Palette size={20} color={colors.primary} />}
              onPress={() => router.push("/(tabs)/more/appearance")}
            />
          </View>
        </View>

        <View>
          <Text style={styles.sectionLabel}>Dados</Text>
          <View style={styles.section}>
            <SettingRow
              label="Exportar / Importar"
              description="Backup e restauração de dados"
              icon={<Database size={20} color={colors.primary} />}
              onPress={() => router.push("/(tabs)/more/data")}
            />
          </View>
        </View>

        <View>
          <Text style={styles.sectionLabel}>Sobre</Text>
          <View style={styles.section}>
            <SettingRow
              label="Briio"
              description="Versão 1.0.0"
              icon={<Info size={20} color={colors.primary} />}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
