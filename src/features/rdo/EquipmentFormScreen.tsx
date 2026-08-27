import { useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { CirclePlus } from "lucide-react-native";
import { colors, typography, borderRadius } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ContextBar } from "@/components/ui/ContextBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { AutosaveStatus } from "@/components/ui/AutosaveStatus";
import { SelectField } from "@/components/ui/Form/SelectField";
import { SegmentedField } from "@/components/ui/Form/SegmentedField";
import { TextArea } from "@/components/ui/Form/TextArea";
import { Field } from "@/components/ui/Form/Field";
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
  currentStep?: number;
  totalSteps?: number;
}

export function EquipmentForm({ mode, currentStep = 4, totalSteps = 9 }: EquipmentFormProps) {
  const colors = useThemeColors();
  const { id, equipmentId } = useLocalSearchParams<{ id: string; equipmentId?: string }>();

  const editData = mode === "edit" ? MOCK_EQUIPMENT_DATA[equipmentId || "1"] : null;

  const [equipment, setEquipment] = useState(editData?.equipment || "");
  const [customEquipment, setCustomEquipment] = useState("");
  const [quantity, setQuantity] = useState(editData?.quantity || 1);
  const [hours, setHours] = useState(editData?.hours || 8);
  const [status, setStatus] = useState<EquipmentStatusOption>(editData?.status || "em_operacao");
  const [observation, setObservation] = useState(editData?.observation || "");

  const isCustomEquipment = equipment === "Outro";

  const stepBadge = (
    <View style={styles.stepBadge}>
      <Text style={styles.stepBadgeText}>
        {currentStep} de {totalSteps}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={mode === "add" ? "Adicionar equipamento" : "Editar equipamento"}
        onBack={() => router.back()}
        rightSlot={stepBadge}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ContextBar date={MOCK_RDO_CONTEXT.date} projectName={MOCK_RDO_CONTEXT.projectName} />

        <View style={styles.section}>
          <SelectField
            label="Equipamento"
            value={isCustomEquipment ? customEquipment || "" : equipment}
            options={MOCK_EQUIPMENT_OPTIONS}
            onSelect={(v) => {
              setEquipment(v);
              setCustomEquipment("");
            }}
            placeholder="Ex.: Retroescavadora"
          />
          {isCustomEquipment && (
            <Field
              label="Nome do equipamento"
              value={customEquipment}
              onChangeText={setCustomEquipment}
              placeholder="Inserir nome do equipamento"
            />
          )}

          <View style={styles.fieldRow}>
            <View style={styles.fieldHalf}>
              <Field
                label="Quantidade"
                value={String(quantity)}
                onChangeText={(v) => setQuantity(Number(v) || 1)}
                keyboardType="numeric"
                placeholder="1"
              />
            </View>
            <View style={styles.fieldHalf}>
              <Field
                label="Horas de utilização"
                value={String(hours)}
                onChangeText={(v) => setHours(Number(v) || 1)}
                keyboardType="numeric"
                placeholder="8"
              />
            </View>
          </View>
        </View>

        <SegmentedField
          label="Estado"
          value={status}
          options={EQUIPMENT_STATUS_OPTIONS}
          onChange={(v) => setStatus(v as EquipmentStatusOption)}
        />

        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryTitle}>
              {quantity} {quantity === 1 ? "unidade" : "unidades"}
            </Text>
            <Text style={styles.summarySubtitle}>{hours} h de utilização</Text>
          </View>
          <Text style={styles.summaryStatus}>{EQUIPMENT_STATUS_LABELS[status]}</Text>
        </View>

        <TextArea
          label="Observação"
          value={observation}
          onChangeText={setObservation}
          placeholder="Ex.: Equipamento utilizado na preparação do terreno."
          height={80}
        />

        <View style={styles.saveReassurance}>
          <AutosaveStatus />
        </View>

        <View style={styles.buttonSection}>
          <PrimaryButton
            label={mode === "add" ? "Adicionar equipamento" : "Guardar alterações"}
            onPress={() => router.back()}
            icon={<CirclePlus size={18} color={colors.textOnBrand} />}
          />
          <PressableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Cancelar"
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </PressableOpacity>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 18,
  },
  stepBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    backgroundColor: colors.progressTrack,
  },
  stepBadgeText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily,
    color: colors.textMuted,
  },
  section: {
    gap: 7,
  },
  fieldRow: {
    flexDirection: "row",
    gap: 12,
  },
  fieldHalf: {
    flex: 1,
  },
  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius["2xl"],
    padding: 16,
  },
  summaryLeft: {
    gap: 3,
  },
  summaryTitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily,
    color: colors.primaryHover,
  },
  summarySubtitle: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: typography.fontWeight.regular,
    fontFamily: typography.fontFamily,
    color: colors.textMuted,
  },
  summaryStatus: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: typography.fontWeight.regular,
    fontFamily: typography.fontFamily,
    color: colors.primary,
  },
  saveReassurance: {
    alignItems: "flex-start",
  },
  buttonSection: {
    gap: 10,
  },
  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 48,
  },
  cancelText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: typography.fontWeight.regular,
    fontFamily: typography.fontFamily,
    color: colors.textMuted,
  },
});
