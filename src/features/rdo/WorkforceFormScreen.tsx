import { useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { CirclePlus } from "lucide-react-native";
import { colors, typography, borderRadius } from "@/constants";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ContextBar } from "@/components/ui/ContextBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { AutosaveStatus } from "@/components/ui/AutosaveStatus";
import { SelectField } from "@/components/ui/Form/SelectField";
import { TextArea } from "@/components/ui/Form/TextArea";
import { Field } from "@/components/ui/Form/Field";
import { MOCK_RDO_CONTEXT, MOCK_ROLES, MOCK_WORKFORCE_DATA } from "@/mocks";

interface WorkforceFormProps {
  mode: "add" | "edit";
  currentStep?: number;
  totalSteps?: number;
}

export function WorkforceForm({ mode, currentStep = 2, totalSteps = 9 }: WorkforceFormProps) {
  const { id, workforceId } = useLocalSearchParams<{ id: string; workforceId?: string }>();

  const editData = mode === "edit" ? MOCK_WORKFORCE_DATA[workforceId || "1"] : null;

  const [role, setRole] = useState(editData?.role || "");
  const [customRole, setCustomRole] = useState("");
  const [peopleCount, setPeopleCount] = useState(editData?.people || 1);
  const [hoursPerPerson, setHoursPerPerson] = useState(editData?.hoursPerPerson || 8);
  const [observation, setObservation] = useState(editData?.observation || "");

  const totalHours = peopleCount * hoursPerPerson;
  const isCustomRole = role === "Outro";

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
        title={mode === "add" ? "Adicionar mão de obra" : "Editar função"}
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

          <View style={styles.stepperRow}>
            <View style={styles.stepperHalf}>
              <Field
                label="N.º de pessoas"
                value={String(peopleCount)}
                onChangeText={(v) => setPeopleCount(Number(v) || 1)}
                keyboardType="numeric"
                placeholder="2"
              />
            </View>
            <View style={styles.stepperHalf}>
              <Field
                label="Horas por pessoa"
                value={String(hoursPerPerson)}
                onChangeText={(v) => setHoursPerPerson(Number(v) || 1)}
                keyboardType="numeric"
                placeholder="8"
              />
            </View>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryTitle}>Total de horas</Text>
            <Text style={styles.summarySubtitle}>
              {peopleCount} {peopleCount === 1 ? "pessoa" : "pessoas"} × {hoursPerPerson} horas
            </Text>
          </View>
          <Text style={styles.summaryValue}>{totalHours} h</Text>
        </View>

        <TextArea
          label="Observação"
          value={observation}
          onChangeText={setObservation}
          placeholder="Ex.: Equipa trabalhou no período da manhã."
          height={112}
        />

        <View style={styles.saveReassurance}>
          <AutosaveStatus />
        </View>

        <View style={styles.buttonSection}>
          <PrimaryButton
            label={mode === "add" ? "Adicionar à equipa" : "Guardar alterações"}
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
  stepperRow: {
    flexDirection: "row",
    gap: 12,
  },
  stepperHalf: {
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
  summaryValue: {
    fontSize: 24,
    lineHeight: 30,
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
