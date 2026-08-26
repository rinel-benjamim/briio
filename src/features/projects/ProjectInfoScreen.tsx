import { View, ScrollView, StyleSheet, Text } from "react-native";
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
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

const MOCK_PROJECT = {
  name: "Reabilitação Pedrinhas",
  status: "Em execução",
  location: "Zango 1 — Icolo e Bengo",
  startDate: "03 Jun 2026",
  endDate: "30 Nov 2026",
  responsible: "Kiali Rodrigues",
  client: "Nome do cliente",
  contractor: "Nome da empresa",
  inspector: "Nome da entidade / responsável",
  reference: "OBR-2026-032",
};

interface InfoRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

function InfoRow({ label, value, icon }: InfoRowProps) {
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

function Divider() {
  return <View style={styles.divider} />;
}

export default function ProjectInfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

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
          <Text style={styles.projectName}>{MOCK_PROJECT.name}</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusBadge}>
              <CircleCheck size={14} color={colors.success} />
              <Text style={styles.statusText}>{MOCK_PROJECT.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dados da obra</Text>
          </View>
          <Divider />
          <InfoRow
            label="Localização"
            value={MOCK_PROJECT.location}
            icon={<MapPin size={16} color={colors.textMuted} />}
          />
          <Divider />
          <InfoRow label="Data de início" value={MOCK_PROJECT.startDate} />
          <Divider />
          <InfoRow label="Previsão de conclusão" value={MOCK_PROJECT.endDate} />
          <Divider />
          <InfoRow label="Responsável" value={MOCK_PROJECT.responsible} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Entidades</Text>
          </View>
          <Divider />
          <InfoRow label="Cliente" value={MOCK_PROJECT.client} />
          <Divider />
          <InfoRow label="Empreiteiro" value={MOCK_PROJECT.contractor} />
          <Divider />
          <InfoRow label="Fiscalização" value={MOCK_PROJECT.inspector} />
        </View>

        <View style={styles.section}>
          <InfoRow
            label="Referência da obra"
            value={MOCK_PROJECT.reference}
            icon={<Copy size={18} color={colors.textMuted} />}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Localização da obra</Text>
          </View>
          <View style={styles.addressRow}>
            <Text style={styles.addressText}>{MOCK_PROJECT.location}</Text>
          </View>
          <View style={styles.mapPlaceholder}>
            <Map size={32} color={colors.textMuted} />
            <Text style={styles.mapText}>Zango 1, Icolo e Bengo, Luanda</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
