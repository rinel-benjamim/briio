import { useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { colors, typography, borderRadius } from "@/constants";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ContextBar } from "@/components/ui/ContextBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { AutosaveStatus } from "@/components/ui/AutosaveStatus";
import { SelectField } from "@/components/ui/Form/SelectField";
import { StepperField } from "@/components/ui/Form/StepperField";
import { SegmentedField } from "@/components/ui/Form/SegmentedField";
import { TextArea } from "@/components/ui/Form/TextArea";
import { Field } from "@/components/ui/Form/Field";
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

  const editData = mode === "edit" ? MOCK_MATERIALS_DATA[materialId || "1"] : null;

  const [material, setMaterial] = useState(editData?.material || "");
  const [customMaterial, setCustomMaterial] = useState("");
  const [quantity, setQuantity] = useState(editData?.quantity || 50);
  const [unit, setUnit] = useState(editData?.unit || "sacos");
  const [status, setStatus] = useState<MaterialStatusOption>(editData?.status || "recebido");
  const [observation, setObservation] = useState(editData?.observation || "");

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

          <SelectField
            label="Material"
            value={isCustomMaterial ? customMaterial || "" : material}
            options={MOCK_MATERIALS_OPTIONS}
            onSelect={(v) => {
              setMaterial(v);
              setCustomMaterial("");
            }}
            placeholder="Ex.: Cimento Portland 42.5"
          />
          {isCustomMaterial && (
            <Field
              label="Nome do material"
              value={customMaterial}
              onChangeText={setCustomMaterial}
              placeholder="Inserir nome do material"
            />
          )}

          <StepperField
            label="Quantidade"
            value={quantity}
            onChange={setQuantity}
            min={1}
          />

          <SelectField
            label="Unidade"
            value={unit}
            options={MOCK_UNITS}
            onSelect={setUnit}
          />
        </View>

        <SegmentedField
          label="SITUAÇÃO"
          value={status}
          options={MATERIAL_STATUS_OPTIONS}
          onChange={(v) => setStatus(v as MaterialStatusOption)}
        />

        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>
            {quantity} {unit}
          </Text>
          <Text style={styles.summaryStatus}>{MATERIAL_STATUS_LABELS[status]}</Text>
        </View>

        <TextArea
          label="OBSERVAÇÃO"
          value={observation}
          onChangeText={setObservation}
          placeholder="Ex.: Material recebido no período da manhã."
          height={80}
        />

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
    backgroundColor: colors.bgMain,
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
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.bgSurface,
    borderRadius: borderRadius.lg,
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
  buttonSection: {
    gap: 12,
  },
});
