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
      <PressableOpacity style={styles.card} onPress={onContinue}>
        {/* Header: label + status badge */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerLabel}>RDO de hoje</Text>
            <Text style={styles.headerDate}>{date}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Em andamento</Text>
          </View>
        </View>

        {/* Completion data */}
        <View style={styles.completionSection}>
          <View style={styles.completionRow}>
            <Text style={styles.completionPercent}>{progressPercentage}%</Text>
            {progressLabel && (
              <Text style={styles.completionSteps}>{progressLabel}</Text>
            )}
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercentage}%` },
              ]}
            />
          </View>
        </View>

        {/* CTA Button */}
        <View style={styles.ctaButton}>
          <Text style={styles.ctaText}>Continuar relatório</Text>
          <ArrowRight size={18} color={colors.textOnBrand} />
        </View>
      </PressableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.heroBg,
    borderRadius: 24,
    padding: 20,
    gap: 16,
    shadowColor: "#10201A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    gap: 4,
  },
  headerLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerDate: {
    ...typography.presets.bodySmall,
    color: colors.textOnBrand,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: colors.warningBg,
  },
  statusText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.bold,
    color: colors.warning,
  },
  completionSection: {
    gap: 8,
  },
  completionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  completionPercent: {
    ...typography.presets.h1,
    fontWeight: typography.fontWeight.regular,
    color: colors.textOnBrand,
  },
  completionSteps: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.regular,
    color: colors.primaryLight,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.progressTrack,
    borderRadius: 9999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 9999,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 56,
    gap: 10,
    shadowColor: "#10201A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  ctaText: {
    ...typography.presets.h3,
    color: colors.textOnBrand,
  },
});
