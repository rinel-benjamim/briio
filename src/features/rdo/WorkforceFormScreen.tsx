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
import { TextArea } from "@/components/ui/Form/TextArea";
import { Field } from "@/components/ui/Form/Field";
import { MOCK_RDO_CONTEXT, MOCK_ROLES, MOCK_WORKFORCE_DATA } from "@/mocks";

interface WorkforceFormProps {
  mode: "add" | "edit";
}

export function WorkforceForm({ mode }: WorkforceFormProps) {
  const { id, workforceId } = useLocalSearchParams<{ id: string; workforceId?: string }>();

  const editData = mode === "edit" ? MOCK_WORKFORCE_DATA[workforceId || "1"] : null;

  const [role, setRole] = useState(editData?.role || "");
  const [customRole, setCustomRole] = useState("");
  const [peopleCount, setPeopleCount] = useState(editData?.people || 1);
  const [hoursPerPerson, setHoursPerPerson] = useState(editData?.hoursPerPerson || 8);
  const [observation, setObservation] = useState(editData?.observation || "");

  const totalHours = peopleCount * hoursPerPerson;
  const isCustomRole = role === "Outro";

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={mode === "add" ? "Adicionar mão de obra" : "Editar função"}
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ContextBar date={MOCK_RDO_CONTEXT.date} projectName={MOCK_RDO_CONTEXT.projectName} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DADOS DA EQUIPA</Text>

          <SelectField
            label="Função"
            value={isCustomRole ? customRole || "" : role}
            options={MOCK_ROLES}
            onSelect={(v) => {
              setRole(v);
              setCustomRole("");
            }}
            placeholder="Ex.: Mestre de Obras"
          />
          {isCustomRole && (
            <Field
              label="Nome da função"
              value={customRole}
              onChangeText={setCustomRole}
              placeholder="Inserir nome da função"
            />
          )}

          <StepperField
            label="Número de pessoas"
            value={peopleCount}
            onChange={setPeopleCount}
            min={1}
          />

          <StepperField
            label="Horas por pessoa"
            value={hoursPerPerson}
            onChange={setHoursPerPerson}
            min={1}
            suffix="horas"
          />
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryTitle}>Total de horas</Text>
            <Text style={styles.summarySubtitle}>
              {peopleCount} {peopleCount === 1 ? "pessoa" : "pessoas"} × {hoursPerPerson} h
            </Text>
          </View>
          <Text style={styles.summaryValue}>{totalHours} h</Text>
        </View>

        <TextArea
          label="OBSERVAÇÃO"
          value={observation}
          onChangeText={setObservation}
          placeholder="Ex.: Equipa trabalhou no período da manhã."
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
    gap: 12,
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
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryLeft: {
    gap: 2,
  },
  summaryTitle: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMain,
  },
  summarySubtitle: {
    ...typography.presets.caption,
    color: colors.textMuted,
  },
  summaryValue: {
    ...typography.presets.h2,
    color: colors.primary,
  },
  buttonSection: {
    gap: 12,
  },
});
