import { useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  User,
  CircleCheck,
  FileText,
  Lock,
  Info,
} from "lucide-react-native";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

const MOCK_PROJECT = {
  name: "Reabilitação Pedrinhas",
};

interface RadioOptionProps {
  selected: boolean;
  label: string;
  sublabel: string;
  onPress: () => void;
}

function RadioOption({ selected, label, sublabel, onPress }: RadioOptionProps) {
  return (
    <PressableOpacity
      style={[styles.radioOption, selected && styles.radioOptionSelected]}
      onPress={onPress}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
      <View style={styles.radioInfo}>
        <Text style={styles.radioLabel}>{label}</Text>
        <Text style={styles.radioSublabel}>{sublabel}</Text>
      </View>
    </PressableOpacity>
  );
}

export default function ConfigureRdoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [step] = useState(2);
  const totalSteps = 2;

  const [signatureOption, setSignatureOption] = useState<"me" | "other">("me");

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </PressableOpacity>
        <Text style={styles.navTitle}>Configurar RDO</Text>
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
        <View style={styles.projectContext}>
          <Text style={styles.projectName}>{MOCK_PROJECT.name}</Text>
          <Text style={styles.projectDescription}>
            Configure as informações padrão dos RDOs desta obra.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Responsável pelo preenchimento</Text>
          <Text style={styles.sectionDescription}>
            Quem normalmente preenche os RDOs desta obra?
          </Text>
          <View style={styles.responsibleRow}>
            <View style={styles.avatar}>
              <User size={18} color={colors.textOnBrand} />
            </View>
            <View style={styles.responsibleInfo}>
              <Text style={styles.responsibleName}>Kiali Rodrigues</Text>
              <Text style={styles.responsibleRole}>Responsável técnico</Text>
            </View>
            <CircleCheck size={20} color={colors.brandPrimary} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assinatura</Text>
          <Text style={styles.sectionDescription}>
            Quem normalmente assina os RDOs?
          </Text>
          <RadioOption
            selected={signatureOption === "me"}
            label="Eu"
            sublabel="Kiali Rodrigues"
            onPress={() => setSignatureOption("me")}
          />
          <RadioOption
            selected={signatureOption === "other"}
            label="Outra pessoa"
            sublabel="Selecionar responsável"
            onPress={() => setSignatureOption("other")}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modelo do RDO</Text>
          <View style={styles.modelRow}>
            <View style={styles.modelIcon}>
              <FileText size={20} color={colors.textTertiary} />
            </View>
            <View style={styles.modelInfo}>
              <Text style={styles.modelName}>RDO Diário de Obras</Text>
              <Text style={styles.modelType}>Modelo padrão</Text>
            </View>
            <Lock size={16} color={colors.textTertiary} />
          </View>
        </View>

        <View style={styles.note}>
          <Info size={16} color={colors.textTertiary} />
          <Text style={styles.noteText}>
            Estas definições serão usadas como padrão nos próximos RDOs desta
            obra. Poderá alterá-las quando necessário.
          </Text>
        </View>

        <View style={styles.spacer} />

        <PressableOpacity
          style={styles.primaryButton}
          onPress={() => router.push(`/(tabs)/projects/1/created`)}
        >
          <Text style={styles.primaryButtonText}>Concluir configuração</Text>
        </PressableOpacity>
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
    color: colors.textPrimary,
  },
  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    gap: 4,
    borderWidth: 1.5,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  progressText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 24,
  },
  projectContext: {
    gap: 4,
  },
  projectName: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  projectDescription: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  sectionDescription: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  responsibleRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: borderRadius.lg,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: "#1B3A5C",
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.brandPrimary,
    justifyContent: "center",
    alignItems: "center",
  },
  responsibleInfo: {
    flex: 1,
    gap: 2,
  },
  responsibleName: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  responsibleRole: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: borderRadius.lg,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    gap: 12,
  },
  radioOptionSelected: {
    borderColor: "#1B3A5C",
    borderWidth: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#404040",
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    backgroundColor: colors.brandPrimary,
    borderColor: colors.brandPrimary,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textPrimary,
  },
  radioInfo: {
    flex: 1,
    gap: 2,
  },
  radioLabel: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  radioSublabel: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  modelRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: borderRadius.lg,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    gap: 12,
  },
  modelIcon: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modelInfo: {
    flex: 1,
    gap: 2,
  },
  modelName: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  modelType: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  note: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 14,
  },
  noteText: {
    flex: 1,
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  spacer: {
    height: 16,
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandPrimary,
    borderRadius: 24,
    height: 48,
  },
  primaryButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textOnBrand,
  },
});
