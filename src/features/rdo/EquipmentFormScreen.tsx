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
  MOCK_EQUIPMENT_OPTIONS,
  EQUIPMENT_STATUS_OPTIONS,
  EQUIPMENT_STATUS_LABELS,
  MOCK_EQUIPMENT_DATA,
} from "@/mocks";
import type { EquipmentStatusOption } from "@/mocks";

interface EquipmentFormProps {
  mode: "add" | "edit";
}

export function EquipmentForm({ mode }: EquipmentFormProps) {
  const { id, equipmentId } = useLocalSearchParams<{ id: string; equipmentId?: string }>();
  const insets = useSafeAreaInsets();

  const editData = mode === "edit" ? MOCK_EQUIPMENT_DATA[equipmentId || "1"] : null;

  const [equipment, setEquipment] = useState(editData?.equipment || "");
  const [customEquipment, setCustomEquipment] = useState("");
  const [quantity, setQuantity] = useState(editData?.quantity || 1);
  const [hours, setHours] = useState(editData?.hours || 8);
  const [status, setStatus] = useState<EquipmentStatusOption>(editData?.status || "em_operacao");
  const [observation, setObservation] = useState(editData?.observation || "");
  const [showEquipmentDropdown, setShowEquipmentDropdown] = useState(false);

  const isCustomEquipment = equipment === "Outro";

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={mode === "add" ? "Adicionar equipamento" : "Editar equipamento"}
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ContextBar date={MOCK_RDO_CONTEXT.date} projectName={MOCK_RDO_CONTEXT.projectName} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DADOS DO EQUIPAMENTO</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Equipamento</Text>
            <PressableOpacity
              style={styles.dropdown}
              onPress={() => setShowEquipmentDropdown(!showEquipmentDropdown)}
            >
              <Text style={[styles.dropdownText, !equipment && styles.dropdownPlaceholder]}>
                {isCustomEquipment ? customEquipment || "Inserir nome do equipamento" : equipment || "Ex.: Retroescavadora"}
              </Text>
              <ChevronDown size={18} color={colors.textTertiary} />
            </PressableOpacity>
            {showEquipmentDropdown && (
              <View style={styles.dropdownOptions}>
                {MOCK_EQUIPMENT_OPTIONS.map((e) => (
                  <PressableOpacity
                    key={e}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setEquipment(e);
                      setShowEquipmentDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{e}</Text>
                  </PressableOpacity>
                ))}
              </View>
            )}
            {isCustomEquipment && (
              <TextInput
                style={styles.customInput}
                value={customEquipment}
                onChangeText={setCustomEquipment}
                placeholder="Inserir nome do equipamento"
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
            <Text style={styles.fieldLabel}>Horas de utilização</Text>
            <View style={styles.stepper}>
              <PressableOpacity
                style={styles.stepperButton}
                onPress={() => setHours(Math.max(1, hours - 1))}
              >
                <Minus size={18} color={colors.textTertiary} />
              </PressableOpacity>
              <View style={styles.stepperDivider} />
              <View style={styles.stepperValue}>
                <Text style={styles.stepperValueText}>{hours}</Text>
              </View>
              <View style={styles.stepperDivider} />
              <PressableOpacity
                style={styles.stepperButton}
                onPress={() => setHours(hours + 1)}
              >
                <Plus size={18} color={colors.textTertiary} />
              </PressableOpacity>
              <Text style={styles.stepperLabel}>horas</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ESTADO</Text>
          <View style={styles.segmentedControl}>
            {EQUIPMENT_STATUS_OPTIONS.map((option) => (
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
            {quantity} {quantity === 1 ? "unidade" : "unidades"}
          </Text>
          <Text style={styles.summaryMeta}>{hours} h de utilização</Text>
          <Text style={styles.summaryStatus}>{EQUIPMENT_STATUS_LABELS[status]}</Text>
        </View>

        <View style={styles.obsSection}>
          <Text style={styles.obsLabel}>OBSERVAÇÃO</Text>
          <TextInput
            style={styles.obsInput}
            value={observation}
            onChangeText={setObservation}
            placeholder="Ex.: Equipamento utilizado na preparação do terreno."
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
  stepperLabel: {
    ...typography.presets.caption,
    color: colors.textSecondary,
    marginRight: 14,
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
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  segmentOptionTextSelected: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
  },
  summaryCard: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: borderRadius.lg,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  summaryText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  summaryMeta: {
    ...typography.presets.bodySmall,
    color: colors.textSecondary,
  },
  summaryStatus: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
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
