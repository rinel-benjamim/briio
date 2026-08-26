import { View, Text, StyleSheet } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography, borderRadius, shadows } from "@/constants";

import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { GradientCard } from "@/components/ui/GradientCard";

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
  const colors = useThemeColors();
  const progressLabel =
    completedSteps != null && totalSteps != null
      ? `${completedSteps} de ${totalSteps} etapas`
      : undefined;

  return (
    <View style={styles.container}>
      <PressableOpacity onPress={onContinue}>
        <GradientCard
          colors={[colors.heroBg, colors.bgElevated]}
          style={styles.card}
        >
          {/* Header: label + status badge */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={[styles.headerLabel, { color: colors.primaryLight }]}>RDO de hoje</Text>
              <Text style={[styles.headerDate, { color: colors.textOnBrand }]}>{date}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: colors.warningBg }]}>
              <Text style={[styles.statusText, { color: colors.warning }]}>Em andamento</Text>
            </View>
          </View>

          {/* Completion data */}
          <View style={styles.completionSection}>
            <View style={styles.completionRow}>
              <Text style={[styles.completionPercent, { color: colors.textOnBrand }]}>{progressPercentage}%</Text>
              {progressLabel && (
                <Text style={[styles.completionSteps, { color: colors.primaryLight }]}>{progressLabel}</Text>
              )}
            </View>

            {/* Progress bar */}
            <View style={[styles.progressTrack, { backgroundColor: colors.progressTrack }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%`, backgroundColor: colors.primary },
                ]}
              />
            </View>
          </View>

          {/* CTA Button */}
          <View style={[styles.ctaButton, { backgroundColor: colors.primary }]}>
            <Text style={[styles.ctaText, { color: colors.textOnBrand }]}>Continuar relatório</Text>
            <ArrowRight size={18} color={colors.textOnBrand} />
          </View>
        </GradientCard>
      </PressableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
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
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerDate: {
    ...typography.presets.bodySmall,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  statusText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.bold,
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
  },
  completionSteps: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.regular,
  },
  progressTrack: {
    height: 8,
    borderRadius: 9999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 9999,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  },
});
