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
import { ChevronDown, Minus, Plus } from "lucide-react-native";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ContextBar } from "@/components/ui/ContextBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { AutosaveStatus } from "@/components/ui/AutosaveStatus";
import {
  MOCK_RDO_CONTEXT,
  MOCK_MATERIALS_OPTIONS,
  MOCK_UNITS,
  MATERIAL_STATUS_OPTIONS,
  MATERIAL_STATUS_LABELS,
  MOCK_MATERIALS_DATA,
} from "@/mocks";
import type { MaterialStatusOption } from "@/mocks";

interface MaterialFormProps {
  mode: "add" | "edit";
}

export function MaterialForm({ mode }: MaterialFormProps) {
  const { id, materialId } = useLocalSearchParams<{ id: string; materialId?: string }>();
  const insets = useSafeAreaInsets();

  const editData = mode === "edit" ? MOCK_MATERIALS_DATA[materialId || "1"] : null;

  const [material, setMaterial] = useState(editData?.material || "");
  const [customMaterial, setCustomMaterial] = useState("");
  const [quantity, setQuantity] = useState(editData?.quantity || 50);
  const [unit, setUnit] = useState(editData?.unit || "sacos");
  const [status, setStatus] = useState<MaterialStatusOption>(editData?.status || "recebido");
  const [observation, setObservation] = useState(editData?.observation || "");
  const [showMaterialDropdown, setShowMaterialDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const isCustomMaterial = material === "Outro";

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={mode === "add" ? "Adicionar material" : "Editar material"}
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ContextBar date={MOCK_RDO_CONTEXT.date} projectName={MOCK_RDO_CONTEXT.projectName} />

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
              <ChevronDown size={18} color={colors.textTertiary} />
            </PressableOpacity>
            {showMaterialDropdown && (
              <View style={styles.dropdownOptions}>
                {MOCK_MATERIALS_OPTIONS.map((m) => (
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
            {MATERIAL_STATUS_OPTIONS.map((option) => (
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
          <Text style={styles.summaryStatus}>{MATERIAL_STATUS_LABELS[status]}</Text>
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
          <PrimaryButton
            label={mode === "add" ? "Guardar" : "Guardar alterações"}
            onPress={() => router.back()}
          />
          <SecondaryButton label="Cancelar" onPress={() => router.back()} />
        </View>

        <AutosaveStatus />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceBg,
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
  section: {
    gap: 10,
  },
  sectionLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
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
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  dropdownText: {
    ...typography.presets.body,
    color: colors.textPrimary,
  },
  dropdownPlaceholder: {
    color: colors.textSecondary,
  },
  dropdownOptions: {
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    overflow: "hidden",
  },
  dropdownOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148, 163, 184, 0.12)",
  },
  dropdownOptionText: {
    ...typography.presets.body,
    color: colors.textPrimary,
  },
  customInput: {
    height: 48,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    ...typography.presets.body,
    color: colors.textPrimary,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
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
    backgroundColor: "rgba(148, 163, 184, 0.12)",
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
    color: colors.textPrimary,
  },
  segmentedControl: {
    flexDirection: "row",
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    overflow: "hidden",
  },
  segmentOption: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(148, 163, 184, 0.1)",
  },
  segmentOptionSelected: {
    backgroundColor: colors.brandPrimary,
  },
  segmentOptionText: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  segmentOptionTextSelected: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  summaryText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
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
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  obsInput: {
    height: 80,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    ...typography.presets.body,
    color: colors.textPrimary,
  },
  buttonSection: {
    gap: 12,
  },
});
