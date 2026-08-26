import { View, Text, StyleSheet } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { colors, typography, borderRadius, shadows } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

interface RecentReport {
  id: string;
  number: number;
  date: string;
  day: string;
  month: string;
  projectName: string;
  status: "draft" | "completed" | "generated";
}

interface RecentReportsProps {
  reports: RecentReport[];
  onViewAll?: () => void;
  onReportPress?: (id: string) => void;
}

const statusConfig = {
  draft: {
    label: "Rascunho",
    color: colors.warning,
    bg: colors.warningBg,
  },
  completed: {
    label: "Concluído",
    color: colors.success,
    bg: colors.successBg,
  },
  generated: {
    label: "Gerado",
    color: colors.success,
    bg: colors.successBg,
  },
};

export function RecentReports({
  reports,
  onViewAll,
  onReportPress,
}: RecentReportsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>RELATÓRIOS RECENTES</Text>
      </View>

      <View style={styles.list}>
        {reports.map((report, index) => (
          <View key={report.id}>
            <PressableOpacity
              style={styles.item}
              onPress={() => onReportPress?.(report.id)}
            >
              <View style={styles.left}>
                <View style={styles.dateColumn}>
                  <Text style={styles.day}>{report.day}</Text>
                  <Text style={styles.month}>{report.month}</Text>
                </View>
                <View style={styles.itemDivider} />
                <View style={styles.info}>
                  <Text style={styles.reportNumber}>RDO #{report.number}</Text>
                  <Text style={styles.reportProject}>{report.projectName}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: statusConfig[report.status].bg },
                ]}
              >
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: statusConfig[report.status].color },
                  ]}
                />
                <Text
                  style={[
                    styles.badgeText,
                    { color: statusConfig[report.status].color },
                  ]}
                >
                  {statusConfig[report.status].label}
                </Text>
              </View>
            </PressableOpacity>
            {index < reports.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      <PressableOpacity style={styles.footer} onPress={onViewAll}>
        <Text style={styles.viewAll}>Ver todos</Text>
        <ArrowRight size={14} color={colors.primary} />
      </PressableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  list: {
    backgroundColor: colors.bgSurface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...shadows.sm,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    paddingHorizontal: 16,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  dateColumn: {
    width: 40,
    alignItems: "center",
    gap: 1,
  },
  day: {
    ...typography.presets.h3,
    color: colors.textMain,
  },
  month: {
    ...typography.presets.caption,
    color: colors.textMuted,
  },
  itemDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  reportNumber: {
    ...typography.presets.bodyMedium,
    color: colors.textMain,
  },
  reportProject: {
    ...typography.presets.caption,
    color: colors.textMuted,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 4,
  },
  viewAll: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
});
