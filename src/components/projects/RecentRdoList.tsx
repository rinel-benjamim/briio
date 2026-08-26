import { View, Text, StyleSheet } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { colors, typography, borderRadius, shadows } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

interface RecentRdoItem {
  id: string;
  date: string;
  number: number;
  status: "draft" | "completed" | "generated";
}

interface RecentRdoListProps {
  items: RecentRdoItem[];
  onViewAll?: () => void;
  onItemPress?: (id: string) => void;
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

export function RecentRdoList({ items, onViewAll, onItemPress }: RecentRdoListProps) {
  return (
    <View style={styles.container}>
      <View style={styles.list}>
        {items.map((item, index) => (
          <View key={item.id}>
            <PressableOpacity
              style={styles.item}
              onPress={() => onItemPress?.(item.id)}
            >
              <Text style={styles.itemText}>
                {item.date} · RDO #{String(item.number).padStart(3, "0")}
              </Text>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: statusConfig[item.status].bg },
                ]}
              >
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: statusConfig[item.status].color },
                  ]}
                />
                <Text
                  style={[
                    styles.badgeText,
                    { color: statusConfig[item.status].color },
                  ]}
                >
                  {statusConfig[item.status].label}
                </Text>
              </View>
            </PressableOpacity>
            {index < items.length - 1 && <View style={styles.divider} />}
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
  itemText: {
    ...typography.presets.bodyMedium,
    color: colors.textMain,
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
