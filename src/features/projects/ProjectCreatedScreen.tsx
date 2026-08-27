import { View, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeftCircle, CheckCircle } from "lucide-react-native";
import { typography, borderRadius } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

const MOCK_PROJECT = {
  name: "Reabilitação Pedrinhas",
  location: "Zango 1 — Icolo e Bengo",
  status: "Em execução",
};

export default function ProjectCreatedScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const styles = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      backgroundColor: colors.bgMain,
    },
    topNav: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 8,
      gap: 12,
    },
    navButton: {
      width: 48,
      height: 48,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    navTitle: {
      flex: 1,
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 24,
      gap: 28,
    },
    success: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    successIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.successBg,
      justifyContent: "center",
      alignItems: "center",
    },
    successInfo: {
      flex: 1,
      gap: 2,
    },
    successTitle: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
    successText: {
      ...typography.presets.bodySmall,
      color: colors.textMuted,
    },
    projectCard: {
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.xl,
      padding: 16,
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    badgeDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.success,
    },
    badgeText: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.semibold,
      color: colors.success,
    },
    projectName: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
    projectLocation: {
      ...typography.presets.bodySmall,
      color: colors.textMuted,
    },
    nextSection: {
      gap: 6,
    },
    nextLabel: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMuted,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    nextText: {
      ...typography.presets.bodySmall,
      color: colors.textMuted,
    },
    nextDate: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
    spacer: {
      flex: 1,
    },
    primaryButton: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderRadius: borderRadius["2xl"],
      height: 56,
    },
    primaryButtonText: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textOnBrand,
    },
    secondaryButton: {
      alignItems: "center",
      justifyContent: "center",
      height: 50,
    },
    secondaryButtonText: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeftCircle size={22} color={colors.textMain} />
        </PressableOpacity>
        <Text style={styles.navTitle}>{MOCK_PROJECT.name}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.success}>
          <View style={styles.successIcon}>
            <CheckCircle size={20} color={colors.success} />
          </View>
          <View style={styles.successInfo}>
            <Text style={styles.successTitle}>Obra criada com sucesso</Text>
            <Text style={styles.successText}>
              A obra está pronta para receber os seus primeiros RDOs.
            </Text>
          </View>
        </View>

        <View style={styles.projectCard}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>{MOCK_PROJECT.status}</Text>
          </View>
          <Text style={styles.projectName}>{MOCK_PROJECT.name}</Text>
          <Text style={styles.projectLocation}>{MOCK_PROJECT.location}</Text>
        </View>

        <View style={styles.nextSection}>
          <Text style={styles.nextLabel}>Próximo passo</Text>
          <Text style={styles.nextText}>Registe o que aconteceu hoje na obra.</Text>
          <Text style={styles.nextDate}>17 Agosto 2026</Text>
        </View>

        <View style={styles.spacer} />

        <PressableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.primaryButtonText}>Criar primeiro RDO</Text>
        </PressableOpacity>

        <PressableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace("/(tabs)/projects")}
        >
          <Text style={styles.secondaryButtonText}>Voltar para a obra</Text>
        </PressableOpacity>
      </View>
    </View>
  );
}
