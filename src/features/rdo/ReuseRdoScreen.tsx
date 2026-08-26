import { useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Check,
  Users,
  ClipboardCheck,
  Package,
  Wrench,
  CloudSun,
  TriangleAlert,
  MessageSquare,
  Camera,
  ArrowRight,
} from "lucide-react-native";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { useRdo } from "@/contexts/RdoContext";

const MOCK_CONTEXT = {
  date: "17 Agosto 2026",
  projectName: "Reabilitação Pedrinhas",
};

const MOCK_SOURCE_RDO = {
  number: "RDO #032",
  date: "12 Agosto 2026",
};

interface ReusableItem {
  id: string;
  title: string;
  summary: string;
  icon: React.ReactNode;
  selected: boolean;
}

interface DaySpecificItem {
  id: string;
  title: string;
  summary: string;
  icon: React.ReactNode;
}

const INITIAL_REUSABLE_ITEMS: ReusableItem[] = [
  { id: "1", title: "Mão de obra", summary: "7 trabalhadores · 56 h", icon: <Users size={18} color={colors.textTertiary} />, selected: true },
  { id: "2", title: "Atividades", summary: "2 atividades", icon: <ClipboardCheck size={18} color={colors.textTertiary} />, selected: true },
  { id: "3", title: "Materiais", summary: "3 registos", icon: <Package size={18} color={colors.textTertiary} />, selected: true },
  { id: "4", title: "Equipamentos", summary: "3 equipamentos", icon: <Wrench size={18} color={colors.textTertiary} />, selected: true },
];

const DAY_SPECIFIC_ITEMS: DaySpecificItem[] = [
  { id: "5", title: "Condições do dia", summary: "Será preenchido para hoje", icon: <CloudSun size={18} color={colors.textTertiary} /> },
  { id: "6", title: "Ocorrências", summary: "Será preenchido para hoje", icon: <TriangleAlert size={18} color={colors.textTertiary} /> },
  { id: "7", title: "Observações", summary: "Será preenchido para hoje", icon: <MessageSquare size={18} color={colors.textTertiary} /> },
  { id: "8", title: "Fotografias", summary: "Serão adicionadas para hoje", icon: <Camera size={18} color={colors.textTertiary} /> },
];

export default function ReuseRdoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { rdoId } = useRdo();
  const [step] = useState(1);
  const totalSteps = 2;
  const [reusableItems, setReusableItems] = useState(INITIAL_REUSABLE_ITEMS);

  const toggleItem = (itemId: string) => {
    setReusableItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </PressableOpacity>
        <Text style={styles.navTitle}>Usar RDO anterior</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>
            {step} de {totalSteps}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.context}>
          <Text style={styles.contextLabel}>Novo RDO</Text>
          <Text style={styles.contextDate}>{MOCK_CONTEXT.date}</Text>
          <Text style={styles.contextProject}>{MOCK_CONTEXT.projectName}</Text>
        </View>

        <View style={styles.sourceReport}>
          <Text style={styles.sourceLabel}>RDO de origem</Text>
          <Text style={styles.sourceNumber}>{MOCK_SOURCE_RDO.number}</Text>
          <Text style={styles.sourceDate}>{MOCK_SOURCE_RDO.date}</Text>
          <Text style={styles.sourceNote}>
            Escolha os dados que pretende aproveitar.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dados que podem ser reutilizados</Text>
          <Text style={styles.sectionSubtitle}>
            Selecionados por padrão para acelerar o preenchimento.
          </Text>
        </View>

        <View style={styles.list}>
          {reusableItems.map((item, index) => (
            <View key={item.id}>
              <PressableOpacity
                style={styles.listItem}
                onPress={() => toggleItem(item.id)}
              >
                <View style={styles.listItemLeft}>
                  <View style={[styles.checkbox, item.selected && styles.checkboxSelected]}>
                    {item.selected && <Check size={14} color={colors.textOnBrand} />}
                  </View>
                  {item.icon}
                  <View style={styles.listItemInfo}>
                    <Text style={styles.listItemTitle}>{item.title}</Text>
                    <Text style={styles.listItemSummary}>{item.summary}</Text>
                  </View>
                </View>
              </PressableOpacity>
              {index < reusableItems.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dados específicos do dia</Text>
          <Text style={styles.sectionSubtitle}>
            Estes dados serão preenchidos para o novo RDO.
          </Text>
        </View>

        <View style={styles.list}>
          {DAY_SPECIFIC_ITEMS.map((item, index) => (
            <View key={item.id}>
              <View style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  {item.icon}
                  <View style={styles.listItemInfo}>
                    <Text style={styles.listItemTitle}>{item.title}</Text>
                    <Text style={styles.listItemSummary}>{item.summary}</Text>
                  </View>
                </View>
              </View>
              {index < DAY_SPECIFIC_ITEMS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <PressableOpacity
          style={styles.primaryButton}
          onPress={() => router.push(`/(tabs)/reports/${rdoId}`)}
        >
          <Text style={styles.primaryButtonText}>Continuar</Text>
          <ArrowRight size={18} color={colors.textOnBrand} />
        </PressableOpacity>

        <View style={styles.note}>
          <Text style={styles.noteText}>
            Os dados selecionados serão usados como ponto de partida.
          </Text>
          <Text style={styles.noteText}>
            Poderá alterá-los no RDO de hoje.
          </Text>
        </View>
      </ScrollView>
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
    width: 36,
    height: 36,
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
  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: "#FFFFFF",
    gap: 4,
  },
  progressText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: "#1B3A5C",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    paddingTop: 20,
    gap: 6,
  },
  context: {
    gap: 2,
    paddingTop: 2,
  },
  contextLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.brandPrimary,
  },
  contextDate: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  contextProject: {
    ...typography.presets.bodySmall,
    color: colors.textSecondary,
  },
  sourceReport: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: borderRadius.xl,
    padding: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  sourceLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  sourceNumber: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  sourceDate: {
    ...typography.presets.bodySmall,
    color: colors.textSecondary,
  },
  sourceNote: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  sectionHeader: {
    gap: 2,
  },
  sectionTitle: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  list: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
    overflow: "hidden",
  },
  listItem: {
    padding: 14,
    paddingHorizontal: 14,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#404040",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: colors.brandPrimary,
    borderColor: colors.brandPrimary,
  },
  listItemInfo: {
    flex: 1,
    gap: 1,
  },
  listItemTitle: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  listItemSummary: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandPrimary,
    borderRadius: borderRadius.xl,
    height: 56,
    gap: 8,
    marginTop: 14,
  },
  primaryButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textOnBrand,
  },
  note: {
    alignItems: "center",
    gap: 2,
    paddingBottom: 8,
  },
  noteText: {
    ...typography.presets.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
