import { View, ScrollView, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeftCircle,
  MoreHorizontal,
  MapPin,
  Copy,
  Map,
  CircleCheck,
} from "lucide-react-native";
import { typography, borderRadius } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useProject } from "@/hooks/useProjects";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

interface InfoRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  styles: any;
}

function InfoRow({ label, value, icon, styles }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      {icon}
    </View>
  );
}

function Divider({ styles }: { styles: any }) {
  return <View style={styles.divider} />;
}

export default function ProjectInfoScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { project, loading } = useProject(id ?? null);

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
      color: colors.textMain,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      gap: 16,
    },
    identity: {
      gap: 4,
      paddingTop: 8,
    },
    projectName: {
      ...typography.presets.h2,
      color: colors.textMain,
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.successBg,
      gap: 6,
    },
    statusText: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.success,
    },
    section: {
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    sectionHeader: {
      padding: 12,
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    sectionTitle: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMuted,
      letterSpacing: 0.5,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 16,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 12,
      paddingHorizontal: 16,
    },
    rowLeft: {
      flex: 1,
      gap: 2,
    },
    rowLabel: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    rowValue: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMain,
    },
    addressRow: {
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    addressText: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMain,
    },
    mapPlaceholder: {
      height: 120,
      backgroundColor: colors.primaryLight,
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      borderBottomLeftRadius: borderRadius.lg,
      borderBottomRightRadius: borderRadius.lg,
    },
    mapText: {
      ...typography.presets.caption,
      color: colors.textMuted,
      textAlign: "center",
    },
  }));

  if (loading) return <LoadingScreen />;

  if (!project) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.textMuted, textAlign: "center", marginTop: 100 }}>
          Obra não encontrada.
        </Text>
      </View>
    );
  }

  const statusLabel =
    project.status === "active" ? "Em execução" :
    project.status === "completed" ? "Concluída" : "Arquivada";

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("pt-AO", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeftCircle size={22} color={colors.textMain} />
        </PressableOpacity>
        <Text style={styles.navTitle}>Informações da obra</Text>
        <PressableOpacity style={styles.navButton}>
          <MoreHorizontal size={22} color={colors.textMain} />
        </PressableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.identity}>
          <Text style={styles.projectName}>{project.name}</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusBadge}>
              <CircleCheck size={14} color={colors.success} />
              <Text style={styles.statusText}>{statusLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dados da obra</Text>
          </View>
          <Divider styles={styles} />
          <InfoRow
            label="Localização"
            value={project.location ?? "—"}
            icon={<MapPin size={16} color={colors.textMuted} />}
            styles={styles}
          />
          <Divider styles={styles} />
          <InfoRow label="Data de início" value={formatDate(project.start_date)} styles={styles} />
          <Divider styles={styles} />
          <InfoRow label="Previsão de conclusão" value={formatDate(project.expected_end_date)} styles={styles} />
          <Divider styles={styles} />
          <InfoRow label="Responsável" value={project.responsible_name ?? "—"} styles={styles} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Entidades</Text>
          </View>
          <Divider styles={styles} />
          <InfoRow label="Cliente" value={project.client_name ?? "—"} styles={styles} />
          <Divider styles={styles} />
          <InfoRow label="Empreiteiro" value={project.contractor_name ?? "—"} styles={styles} />
          <Divider styles={styles} />
          <InfoRow label="Fiscalização" value={project.inspector_name ?? "—"} styles={styles} />
        </View>

        <View style={styles.section}>
          <InfoRow
            label="Referência da obra"
            value={project.reference ?? "—"}
            icon={<Copy size={18} color={colors.textMuted} />}
            styles={styles}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Localização da obra</Text>
          </View>
          <View style={styles.addressRow}>
            <Text style={styles.addressText}>{project.location ?? "—"}</Text>
          </View>
          <View style={styles.mapPlaceholder}>
            <Map size={32} color={colors.textMuted} />
            <Text style={styles.mapText}>{project.location ?? "Localização não definida"}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
