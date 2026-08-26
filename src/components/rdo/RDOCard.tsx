import { View, Text, StyleSheet } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { colors, typography, borderRadius, shadows } from "@/constants";
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
      <PressableOpacity style={styles.card} onPress={onContinue}>
        <View style={styles.header}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.progressPercent}>{progressPercentage}%</Text>
        </View>
        <Text style={styles.project}>{projectName}</Text>

        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercentage}%` },
              ]}
            />
          </View>
          {progressLabel && (
            <Text style={styles.progressSteps}>{progressLabel}</Text>
          )}
        </View>

        <View style={styles.ctaButton}>
          <Text style={styles.ctaText}>Continuar relatório</Text>
          <ArrowRight size={16} color={colors.primary} />
        </View>
      </PressableOpacity>
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
    color: colors.textMuted,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: 20,
    gap: 16,
    ...shadows.hero,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: "rgba(255,255,255,0.7)",
  },
  progressPercent: {
    ...typography.presets.h2,
    color: colors.textOnBrand,
  },
  project: {
    ...typography.presets.h2,
    color: colors.textOnBrand,
  },
  progressSection: {
    gap: 8,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.textOnBrand,
    borderRadius: 4,
  },
  progressSteps: {
    ...typography.presets.caption,
    color: "rgba(255,255,255,0.7)",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgSurface,
    borderRadius: borderRadius.lg,
    height: 44,
    gap: 8,
  },
  ctaText: {
    ...typography.presets.bodyMedium,
    color: colors.primary,
  },
});
