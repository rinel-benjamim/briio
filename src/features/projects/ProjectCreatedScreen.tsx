import { View, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, CircleCheck } from "lucide-react-native";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

const MOCK_PROJECT = {
  name: "Reabilitação Pedrinhas",
  location: "Zango 1 — Icolo e Bengo",
  status: "Em execução",
};

export default function ProjectCreatedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </PressableOpacity>
        <Text style={styles.navTitle}>{MOCK_PROJECT.name}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.success}>
          <View style={styles.successIcon}>
            <CircleCheck size={22} color="#15803D" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceBg,
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
    color: colors.textPrimary,
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
    backgroundColor: "#DCFCE7",
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
    color: colors.textPrimary,
  },
  successText: {
    ...typography.presets.bodySmall,
    color: colors.textSecondary,
  },
  projectCard: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: borderRadius.xl,
    padding: 16,
    gap: 8,
    borderWidth: 1.5,
    borderColor: "rgba(148, 163, 184, 0.12)",
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
    backgroundColor: "#15803D",
  },
  badgeText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    color: "#15803D",
  },
  projectName: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  projectLocation: {
    ...typography.presets.bodySmall,
    color: colors.textSecondary,
  },
  nextSection: {
    gap: 6,
  },
  nextLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  nextText: {
    ...typography.presets.bodySmall,
    color: colors.textSecondary,
  },
  nextDate: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  spacer: {
    flex: 1,
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandPrimary,
    borderRadius: borderRadius.lg,
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
    height: 44,
  },
  secondaryButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
});
