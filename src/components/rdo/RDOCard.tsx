import { View, Text, StyleSheet } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

interface RDOCardProps {
  date: string;
  projectName: string;
  progressPercentage: number;
  completedSteps?: number;
  totalSteps?: number;
  onContinue?: () => void;
}

export function RDOCard({
  date,
  projectName,
  progressPercentage,
  completedSteps,
  totalSteps,
  onContinue,
}: RDOCardProps) {
  const progressLabel =
    completedSteps != null && totalSteps != null
      ? `${completedSteps} de ${totalSteps} etapas`
      : undefined;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>RDO DE HOJE</Text>
      <View style={styles.card}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.project}>{projectName}</Text>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              {progressPercentage}% concluído
            </Text>
            {progressLabel && (
              <Text style={styles.progressSteps}>{progressLabel}</Text>
            )}
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercentage}%` },
              ]}
            />
          </View>
        </View>

        <PressableOpacity style={styles.ctaButton} onPress={onContinue}>
          <Text style={styles.ctaText}>Continuar relatório</Text>
          <ArrowRight size={18} color={colors.textOnBrand} />
        </PressableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  label: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: borderRadius.lg,
    padding: 20,
    gap: 16,
    borderWidth: 1.5,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  date: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  project: {
    ...typography.presets.h4,
    color: colors.textPrimary,
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  progressSteps: {
    ...typography.presets.bodySmall,
    color: colors.textSecondary,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.brandPrimary,
    borderRadius: 4,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandPrimary,
    borderRadius: borderRadius.xl,
    height: 56,
    gap: 8,
  },
  ctaText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textOnBrand,
  },
});
