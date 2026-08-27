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
import { typography, borderRadius } from "@/constants";
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

export default function AddMaterialScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [step] = useState(3);
  const totalSteps = 9;

  const [material, setMaterial] = useState("");
  const [customMaterial, setCustomMaterial] = useState("");
  const [quantity, setQuantity] = useState(50);
  const [unit, setUnit] = useState("sacos");
  const [status, setStatus] = useState<StatusOption>("recebido");
  const [observation, setObservation] = useState("");
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
      backgroundColor: colors.bgSurface,
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
      backgroundColor: colors.bgSurface,
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
      backgroundColor: colors.bgSurface,
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
      backgroundColor: colors.bgSurface,
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
      color: colors.success,
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
      backgroundColor: colors.bgSurface,
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
          <ArrowLeft size={20} color={colors.textMain} />
        </PressableOpacity>
        <Text style={styles.navTitle}>Adicionar material</Text>
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
                {isCustomMaterial ? customMaterial || "Inserir nome do material" : material || "Ex.: Cimento Portland 42.5"}
              </Text>
              <ChevronDown size={18} color={colors.textMuted} />
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
                placeholderTextColor={colors.textMuted}
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
                <Minus size={18} color={colors.textMuted} />
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
                <Plus size={18} color={colors.textMuted} />
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
              <ChevronDown size={18} color={colors.textMuted} />
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
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.buttonSection}>
          <PressableOpacity
            style={styles.primaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>Guardar</Text>
          </PressableOpacity>
          <PressableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </PressableOpacity>
        </View>

        <View style={styles.autosaveStatus}>
          <Check size={14} color={colors.textMuted} />
          <Text style={styles.autosaveText}>Salvo automaticamente</Text>
        </View>
      </ScrollView>
    </View>
  );
}
