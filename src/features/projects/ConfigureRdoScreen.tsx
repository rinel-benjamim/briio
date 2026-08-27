import { useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeftCircle,
  User,
  CircleCheck,
  FileText,
  Lock,
  Info,
} from "lucide-react-native";
import { typography, borderRadius } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

const MOCK_PROJECT = {
  name: "Reabilitação Pedrinhas",
};

interface RadioOptionProps {
  selected: boolean;
  label: string;
  sublabel: string;
  onPress: () => void;
  styles: any;
}

function RadioOption({ selected, label, sublabel, onPress, styles }: RadioOptionProps) {
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
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [step] = useState(2);
  const totalSteps = 2;

  const [signatureOption, setSignatureOption] = useState<"me" | "other">("me");

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
    progressBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 9999,
      backgroundColor: colors.primaryLight,
      gap: 4,
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
      color: colors.textMain,
    },
    projectDescription: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    section: {
      gap: 10,
    },
    sectionTitle: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMuted,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    sectionDescription: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    responsibleRow: {
      flexDirection: "row",
      alignItems: "center",
      height: 56,
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.lg,
      paddingHorizontal: 14,
      borderWidth: 2,
      borderColor: colors.primary,
      gap: 12,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
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
      color: colors.textMain,
    },
    responsibleRole: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    radioOption: {
      flexDirection: "row",
      alignItems: "center",
      height: 56,
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.lg,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    radioOptionSelected: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: colors.textMuted,
      justifyContent: "center",
      alignItems: "center",
    },
    radioSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    radioDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.textOnBrand,
    },
    radioInfo: {
      flex: 1,
      gap: 2,
    },
    radioLabel: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMain,
    },
    radioSublabel: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    modelRow: {
      flexDirection: "row",
      alignItems: "center",
      height: 52,
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.lg,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.textMain,
    },
    modelType: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    note: {
      flexDirection: "row",
      gap: 10,
      paddingTop: 14,
    },
    noteText: {
      flex: 1,
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    spacer: {
      height: 16,
    },
    primaryButton: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderRadius: borderRadius["2xl"],
      height: 56,
    },
    primaryButtonText: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textOnBrand,
    },
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeftCircle size={22} color={colors.textMain} />
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
            <CircleCheck size={20} color={colors.primary} />
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
            styles={styles}
          />
          <RadioOption
            selected={signatureOption === "other"}
            label="Outra pessoa"
            sublabel="Selecionar responsável"
            onPress={() => setSignatureOption("other")}
            styles={styles}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modelo do RDO</Text>
          <View style={styles.modelRow}>
            <View style={styles.modelIcon}>
              <FileText size={20} color={colors.textMuted} />
            </View>
            <View style={styles.modelInfo}>
              <Text style={styles.modelName}>RDO Diário de Obras</Text>
              <Text style={styles.modelType}>Modelo padrão</Text>
            </View>
            <Lock size={16} color={colors.textMuted} />
          </View>
        </View>

        <View style={styles.note}>
          <Info size={16} color={colors.textMuted} />
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
