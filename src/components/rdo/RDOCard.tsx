import { View, Text, StyleSheet } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography, borderRadius } from "@/constants";

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
  const colors = useThemeColors();
  const progressLabel =
    completedSteps != null && totalSteps != null
      ? `${completedSteps} de ${totalSteps} etapas`
      : undefined;

  return (
    <View style={styles.container}>
      <PressableOpacity style={[styles.card, { backgroundColor: colors.heroBg }]} onPress={onContinue}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerLabel, { color: colors.heroText }]}>RDO de hoje</Text>
            <Text style={[styles.headerDate, { color: colors.heroText }]}>{date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: colors.warningBg }]}>
            <Text style={[styles.statusText, { color: colors.warning }]}>Em andamento</Text>
          </View>
        </View>

        <View style={styles.completionSection}>
          <View style={styles.completionRow}>
            <Text style={[styles.completionPercent, { color: colors.heroText }]}>{progressPercentage}%</Text>
            {progressLabel && (
              <Text style={[styles.completionSteps, { color: colors.heroTextMuted }]}>{progressLabel}</Text>
            )}
          </View>

          <View style={[styles.progressTrack, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercentage}%`, backgroundColor: colors.primary },
              ]}
            />
          </View>
        </View>

        <View style={[styles.ctaButton, { backgroundColor: colors.primary }]}>
          <Text style={[styles.ctaText, { color: colors.textOnBrand }]}>Continuar relatório</Text>
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
    borderRadius: 24,
    padding: 20,
    gap: 16,
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
  },
  ctaText: {
    ...typography.presets.h3,
  },
});
