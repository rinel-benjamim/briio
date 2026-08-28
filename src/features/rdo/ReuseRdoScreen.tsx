import { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeftCircle,
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
import { typography, borderRadius } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { useRdo } from "@/contexts/RdoContext";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useReuseService, type ReusableDataSummary } from "@/services/reuse.service";
import { useRdoRepository } from "@/repositories/rdo.repository";
import { useCreateRdo } from "@/hooks/useRdoData";

function formatShortDate(isoDate: string): string {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const d = new Date(isoDate + "T00:00:00");
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

interface ReusableItem {
  id: string;
  key: "workforce" | "tasks" | "materials" | "equipment";
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

export default function ReuseRdoScreen() {
  const colors = useThemeColors();
  const { sourceId } = useLocalSearchParams<{ sourceId: string }>();
  const insets = useSafeAreaInsets();
  const { rdoId, projectId, projectName, date, setRdoId, setProjectId } = useRdo();
  const reuseService = useReuseService();
  const rdoRepo = useRdoRepository();
  const { create: createRdo } = useCreateRdo();
  const [step] = useState(1);
  const totalSteps = 2;

  const [sourceRdo, setSourceRdo] = useState<any>(null);
  const [summary, setSummary] = useState<ReusableDataSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const [newRdoId, setNewRdoId] = useState<string | null>(null);

  const [reusableItems, setReusableItems] = useState<ReusableItem[]>([]);

  useEffect(() => {
    async function load() {
      if (!sourceId) {
        setLoading(false);
        return;
      }
      try {
        const [rdo, data] = await Promise.all([
          rdoRepo.findById(sourceId),
          reuseService.getReusableSummary(sourceId),
        ]);
        setSourceRdo(rdo);
        setSummary(data);
        
        // If no projectId in context, use the source RDO's project
        if (!projectId && rdo) {
          setProjectId(rdo.project_id);
        }
        
        setReusableItems([
          {
            id: "1",
            key: "workforce",
            title: "Mão de obra",
            summary: `${data.workforceCount} trabalhadores · ${data.totalHours} h`,
            icon: <Users size={18} color={colors.textMuted} />,
            selected: true,
          },
          {
            id: "2",
            key: "tasks",
            title: "Atividades",
            summary: `${data.taskCount} atividades`,
            icon: <ClipboardCheck size={18} color={colors.textMuted} />,
            selected: true,
          },
          {
            id: "3",
            key: "materials",
            title: "Materiais",
            summary: `${data.materialCount} registos`,
            icon: <Package size={18} color={colors.textMuted} />,
            selected: true,
          },
          {
            id: "4",
            key: "equipment",
            title: "Equipamentos",
            summary: `${data.equipmentCount} equipamentos`,
            icon: <Wrench size={18} color={colors.textMuted} />,
            selected: true,
          },
        ]);
      } catch (e) {
        console.error("Failed to load RDO data:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sourceId]);

  const DAY_SPECIFIC_ITEMS: DaySpecificItem[] = [
    { id: "5", title: "Condições do dia", summary: "Será preenchido para hoje", icon: <CloudSun size={18} color={colors.textMuted} /> },
    { id: "6", title: "Ocorrências", summary: "Será preenchido para hoje", icon: <TriangleAlert size={18} color={colors.textMuted} /> },
    { id: "7", title: "Observações", summary: "Será preenchido para hoje", icon: <MessageSquare size={18} color={colors.textMuted} /> },
    { id: "8", title: "Fotografias", summary: "Serão adicionadas para hoje", icon: <Camera size={18} color={colors.textMuted} /> },
  ];

  const toggleItem = (itemId: string) => {
    setReusableItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleContinue = useCallback(async () => {
    if (!sourceId || !sourceRdo) return;
    setCopying(true);
    try {
      const targetProjectId = projectId || sourceRdo.project_id;

      // Create a new RDO if one doesn't exist yet
      let targetRdoId = newRdoId;
      if (!targetRdoId) {
        const today = new Date().toISOString().split("T")[0];
        const rdo = await createRdo(targetProjectId, today);
        targetRdoId = rdo.id;
        setNewRdoId(targetRdoId);
        setRdoId(targetRdoId);
        setProjectId(targetProjectId);
      }

      const options = {
        workforce: reusableItems.find((i) => i.key === "workforce")?.selected ?? false,
        tasks: reusableItems.find((i) => i.key === "tasks")?.selected ?? false,
        materials: reusableItems.find((i) => i.key === "materials")?.selected ?? false,
        equipment: reusableItems.find((i) => i.key === "equipment")?.selected ?? false,
      };
      await reuseService.copyDataToNewRdo(sourceId, targetRdoId, options);
      router.replace(`/(tabs)/reports/${targetRdoId}`);
    } catch (e) {
      console.error("Failed to copy data:", e);
    } finally {
      setCopying(false);
    }
  }, [sourceId, sourceRdo, projectId, newRdoId, reusableItems, reuseService, createRdo, setRdoId, setProjectId]);

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
      color: colors.textMain,
    },
    progressBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 9999,
      backgroundColor: colors.bgSurface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    progressText: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.primary,
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
      color: colors.primary,
    },
    contextDate: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
    contextProject: {
      ...typography.presets.bodySmall,
      color: colors.textMuted,
    },
    sourceReport: {
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.xl,
      padding: 16,
      gap: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sourceLabel: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMuted,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    sourceNumber: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
    sourceDate: {
      ...typography.presets.bodySmall,
      color: colors.textMuted,
    },
    sourceNote: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    sectionHeader: {
      gap: 2,
    },
    sectionTitle: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMuted,
      letterSpacing: 0.5,
    },
    sectionSubtitle: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    list: {
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.border,
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
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    listItemInfo: {
      flex: 1,
      gap: 1,
    },
    listItemTitle: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMain,
    },
    listItemSummary: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
    },
    primaryButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderRadius: borderRadius.xl,
      height: 56,
      gap: 8,
      marginTop: 14,
      opacity: copying ? 0.6 : 1,
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
      color: colors.textMuted,
      textAlign: "center",
    },
  }));

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeftCircle size={22} color={colors.textMain} />
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
          <Text style={styles.contextDate}>{date || formatShortDate(new Date().toISOString().split("T")[0])}</Text>
          <Text style={styles.contextProject}>{projectName || "Obra"}</Text>
        </View>

        {sourceRdo && (
          <View style={styles.sourceReport}>
            <Text style={styles.sourceLabel}>RDO de origem</Text>
            <Text style={styles.sourceNumber}>RDO #{sourceRdo.number}</Text>
            <Text style={styles.sourceDate}>{formatShortDate(sourceRdo.report_date)}</Text>
            <Text style={styles.sourceNote}>
              Escolha os dados que pretende aproveitar.
            </Text>
          </View>
        )}

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
          onPress={handleContinue}
          disabled={copying}
        >
          <Text style={styles.primaryButtonText}>
            {copying ? "A copiar..." : "Continuar"}
          </Text>
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
