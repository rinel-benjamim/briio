import { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  ChevronDown,
  Minus,
  Plus,
  Check,
} from "lucide-react-native";
import { typography } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

const MOCK_CONTEXT = {
  date: "12 Agosto 2026",
  projectName: "Reabilitação Pedrinhas",
};

const MOCK_MATERIALS = [
  "Cimento Portland 42.5",
  "Areia média",
  "Bloco de cimento",
  "Brita 1",
  "Brita 2",
  "Ferro de construção",
  "Outro",
];

const MOCK_UNITS = ["sacos", "m³", "un.", "kg", "L", "m"];

type StatusOption = "recebido" | "utilizado" | "em_falta" | "em_transito";

const STATUS_OPTIONS: { value: StatusOption; label: string }[] = [
  { value: "recebido", label: "Recebido" },
  { value: "utilizado", label: "Utilizado" },
  { value: "em_falta", label: "Em falta" },
  { value: "em_transito", label: "Em trânsito" },
];

const STATUS_LABELS: Record<StatusOption, string> = {
  recebido: "Recebido",
  utilizado: "Utilizado",
  em_falta: "Em falta",
  em_transito: "Em trânsito",
};

const MOCK_MATERIALS_DATA: Record<string, { material: string; quantity: number; unit: string; status: StatusOption; observation: string }> = {
  "1": { material: "Cimento Portland 42.5", quantity: 50, unit: "sacos", status: "recebido", observation: "" },
  "2": { material: "Areia média", quantity: 8, unit: "m³", status: "recebido", observation: "" },
  "3": { material: "Bloco de cimento", quantity: 500, unit: "un.", status: "utilizado", observation: "" },
};

export default function EditMaterialScreen() {
  const colors = useThemeColors();
  const { id, materialId } = useLocalSearchParams<{ id: string; materialId: string }>();
  const insets = useSafeAreaInsets();
  const [step] = useState(3);
  const totalSteps = 9;

  const data = MOCK_MATERIALS_DATA[materialId || "1"];

  const [material, setMaterial] = useState(data?.material || "");
  const [customMaterial, setCustomMaterial] = useState("");
  const [quantity, setQuantity] = useState(data?.quantity || 50);
  const [unit, setUnit] = useState(data?.unit || "sacos");
  const [status, setStatus] = useState<StatusOption>(data?.status || "recebido");
  const [observation, setObservation] = useState(data?.observation || "");
  const [showMaterialDropdown, setShowMaterialDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const isCustomMaterial = material === "Outro";

  const styles = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      backgroundColor: colors.bgSurface,
    },
    topNav: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
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
    progressText: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 24,
      paddingTop: 8,
      gap: 20,
    },
    context: {
      gap: 2,
    },
    contextDate: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
    contextProject: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
    section: {
      gap: 10,
    },
    sectionLabel: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMuted,
      letterSpacing: 0.5,
    },
    field: {
      gap: 8,
    },
    fieldLabel: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMain,
    },
    dropdown: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "rgba(148, 163, 184, 0.1)",
      borderRadius: 12,
      height: 48,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dropdownText: {
      ...typography.presets.body,
      color: colors.textMain,
    },
    dropdownPlaceholder: {
      color: colors.textMuted,
    },
    dropdownOptions: {
      backgroundColor: colors.bgElevated,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    dropdownOption: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dropdownOptionText: {
      ...typography.presets.body,
      color: colors.textMain,
    },
    customInput: {
      height: 48,
      backgroundColor: "rgba(148, 163, 184, 0.1)",
      borderRadius: 12,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
      ...typography.presets.body,
      color: colors.textMain,
    },
    stepper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(148, 163, 184, 0.1)",
      borderRadius: 12,
      height: 48,
      borderWidth: 1,
      borderColor: colors.border,
    },
    stepperButton: {
      width: 48,
      height: 48,
      justifyContent: "center",
      alignItems: "center",
    },
    stepperDivider: {
      width: 1,
      height: 28,
      backgroundColor: colors.border,
    },
    stepperValue: {
      flex: 1,
      height: 48,
      justifyContent: "center",
      alignItems: "center",
    },
    stepperValueText: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
    segmentedControl: {
      flexDirection: "row",
      height: 40,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    segmentOption: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(148, 163, 184, 0.1)",
    },
    segmentOptionSelected: {
      backgroundColor: colors.primary,
    },
    segmentOptionText: {
      ...typography.presets.bodySmall,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
    segmentOptionTextSelected: {
      color: colors.textMain,
      fontWeight: typography.fontWeight.semibold,
    },
    summaryCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.bgSurface,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryText: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
    },
    summaryStatus: {
      ...typography.presets.bodySmall,
      color: "#15803D",
    },
    obsSection: {
      gap: 8,
    },
    obsLabel: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMuted,
      letterSpacing: 0.5,
    },
    obsInput: {
      height: 80,
      backgroundColor: "rgba(148, 163, 184, 0.1)",
      borderRadius: 12,
      padding: 12,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
      ...typography.presets.body,
      color: colors.textMain,
    },
    buttonSection: {
      gap: 12,
    },
    primaryButton: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderRadius: 24,
      height: 48,
    },
    primaryButtonText: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textOnBrand,
    },
    secondaryButton: {
      alignItems: "center",
      justifyContent: "center",
      height: 44,
    },
    secondaryButtonText: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
    autosaveStatus: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },
    autosaveText: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </PressableOpacity>
        <Text style={styles.navTitle}>Editar material</Text>
        <Text style={styles.progressText}>
          {step} de {totalSteps}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.context}>
          <Text style={styles.contextDate}>{MOCK_CONTEXT.date}</Text>
          <Text style={styles.contextProject}>{MOCK_CONTEXT.projectName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DADOS DO MATERIAL</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Material</Text>
            <PressableOpacity
              style={styles.dropdown}
              onPress={() => setShowMaterialDropdown(!showMaterialDropdown)}
            >
              <Text style={[styles.dropdownText, !material && styles.dropdownPlaceholder]}>
                {isCustomMaterial ? customMaterial || "Inserir nome do material" : material || "Selecione um material"}
              </Text>
              <ChevronDown size={18} color={colors.textTertiary} />
            </PressableOpacity>
            {showMaterialDropdown && (
              <View style={styles.dropdownOptions}>
                {MOCK_MATERIALS.map((m) => (
                  <PressableOpacity
                    key={m}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setMaterial(m);
                      setShowMaterialDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{m}</Text>
                  </PressableOpacity>
                ))}
              </View>
            )}
            {isCustomMaterial && (
              <TextInput
                style={styles.customInput}
                value={customMaterial}
                onChangeText={setCustomMaterial}
                placeholder="Inserir nome do material"
                placeholderTextColor={colors.textSecondary}
              />
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Quantidade</Text>
            <View style={styles.stepper}>
              <PressableOpacity
                style={styles.stepperButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={18} color={colors.textTertiary} />
              </PressableOpacity>
              <View style={styles.stepperDivider} />
              <View style={styles.stepperValue}>
                <Text style={styles.stepperValueText}>{quantity}</Text>
              </View>
              <View style={styles.stepperDivider} />
              <PressableOpacity
                style={styles.stepperButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Plus size={18} color={colors.textTertiary} />
              </PressableOpacity>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Unidade</Text>
            <PressableOpacity
              style={styles.dropdown}
              onPress={() => setShowUnitDropdown(!showUnitDropdown)}
            >
              <Text style={styles.dropdownText}>{unit}</Text>
              <ChevronDown size={18} color={colors.textTertiary} />
            </PressableOpacity>
            {showUnitDropdown && (
              <View style={styles.dropdownOptions}>
                {MOCK_UNITS.map((u) => (
                  <PressableOpacity
                    key={u}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setUnit(u);
                      setShowUnitDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{u}</Text>
                  </PressableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SITUAÇÃO</Text>
          <View style={styles.segmentedControl}>
            {STATUS_OPTIONS.map((option) => (
              <PressableOpacity
                key={option.value}
                style={[
                  styles.segmentOption,
                  status === option.value && styles.segmentOptionSelected,
                ]}
                onPress={() => setStatus(option.value)}
              >
                <Text
                  style={[
                    styles.segmentOptionText,
                    status === option.value && styles.segmentOptionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </PressableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>
            {quantity} {unit}
          </Text>
          <Text style={styles.summaryStatus}>{STATUS_LABELS[status]}</Text>
        </View>

        <View style={styles.obsSection}>
          <Text style={styles.obsLabel}>OBSERVAÇÃO</Text>
          <TextInput
            style={styles.obsInput}
            value={observation}
            onChangeText={setObservation}
            placeholder="Ex.: Material recebido no período da manhã."
            placeholderTextColor={colors.textSecondary}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.buttonSection}>
          <PressableOpacity
            style={styles.primaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>Guardar alterações</Text>
          </PressableOpacity>
          <PressableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </PressableOpacity>
        </View>

        <View style={styles.autosaveStatus}>
          <Check size={14} color={colors.textTertiary} />
          <Text style={styles.autosaveText}>Salvo automaticamente</Text>
        </View>
      </ScrollView>
    </View>
  );
}
