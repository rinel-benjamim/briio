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

  const editData = mode === "edit" ? MOCK_EQUIPMENT_DATA[equipmentId || "1"] : null;

  const [equipment, setEquipment] = useState(editData?.equipment || "");
  const [customEquipment, setCustomEquipment] = useState("");
  const [quantity, setQuantity] = useState(editData?.quantity || 1);
  const [hours, setHours] = useState(editData?.hours || 8);
  const [status, setStatus] = useState<EquipmentStatusOption>(editData?.status || "em_operacao");
  const [observation, setObservation] = useState(editData?.observation || "");

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

          <StepperField
            label="Quantidade"
            value={quantity}
            onChange={setQuantity}
            min={1}
          />

          <StepperField
            label="Horas de utilização"
            value={hours}
            onChange={setHours}
            min={1}
            suffix="horas"
          />
        </View>

        <SegmentedField
          label="ESTADO"
          value={status}
          options={EQUIPMENT_STATUS_OPTIONS}
          onChange={(v) => setStatus(v as EquipmentStatusOption)}
        />

        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>
            {quantity} {quantity === 1 ? "unidade" : "unidades"}
          </Text>
          <Text style={styles.summaryMeta}>{hours} h de utilização</Text>
          <Text style={styles.summaryStatus}>{EQUIPMENT_STATUS_LABELS[status]}</Text>
        </View>

        <TextArea
          label="OBSERVAÇÃO"
          value={observation}
          onChangeText={setObservation}
          placeholder="Ex.: Equipamento utilizado na preparação do terreno."
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
    backgroundColor: colors.bgSurface,
    borderRadius: borderRadius.lg,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMain,
  },
  summaryMeta: {
    ...typography.presets.bodySmall,
    color: colors.textMuted,
  },
  summaryStatus: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.success,
  },
  buttonSection: {
    gap: 12,
  },
});
