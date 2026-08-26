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
import { MOCK_RDO_CONTEXT, MOCK_ROLES, MOCK_WORKFORCE_DATA } from "@/mocks";

interface WorkforceFormProps {
  mode: "add" | "edit";
}

export function WorkforceForm({ mode }: WorkforceFormProps) {
  const { id, workforceId } = useLocalSearchParams<{ id: string; workforceId?: string }>();
  const insets = useSafeAreaInsets();

  const editData = mode === "edit" ? MOCK_WORKFORCE_DATA[workforceId || "1"] : null;

  const [role, setRole] = useState(editData?.role || "");
  const [customRole, setCustomRole] = useState("");
  const [peopleCount, setPeopleCount] = useState(editData?.people || 1);
  const [hoursPerPerson, setHoursPerPerson] = useState(editData?.hoursPerPerson || 8);
  const [observation, setObservation] = useState(editData?.observation || "");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

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

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Função</Text>
            <PressableOpacity
              style={styles.dropdown}
              onPress={() => setShowRoleDropdown(!showRoleDropdown)}
            >
              <Text style={[styles.dropdownText, !role && styles.dropdownPlaceholder]}>
                {isCustomRole ? customRole || "Inserir nome da função" : role || "Ex.: Mestre de Obras"}
              </Text>
              <ChevronDown size={18} color={colors.textTertiary} />
            </PressableOpacity>
            {showRoleDropdown && (
              <View style={styles.dropdownOptions}>
                {MOCK_ROLES.map((r) => (
                  <PressableOpacity
                    key={r}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setRole(r);
                      setShowRoleDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{r}</Text>
                  </PressableOpacity>
                ))}
              </View>
            )}
            {isCustomRole && (
              <TextInput
                style={styles.customInput}
                value={customRole}
                onChangeText={setCustomRole}
                placeholder="Inserir nome da função"
                placeholderTextColor={colors.textSecondary}
              />
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Número de pessoas</Text>
            <View style={styles.stepper}>
              <PressableOpacity
                style={styles.stepperButton}
                onPress={() => setPeopleCount(Math.max(1, peopleCount - 1))}
              >
                <Minus size={18} color={colors.textTertiary} />
              </PressableOpacity>
              <View style={styles.stepperDivider} />
              <View style={styles.stepperValue}>
                <Text style={styles.stepperValueText}>{peopleCount}</Text>
              </View>
              <View style={styles.stepperDivider} />
              <PressableOpacity
                style={styles.stepperButton}
                onPress={() => setPeopleCount(peopleCount + 1)}
              >
                <Plus size={18} color={colors.textTertiary} />
              </PressableOpacity>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Horas por pessoa</Text>
            <View style={styles.stepper}>
              <PressableOpacity
                style={styles.stepperButton}
                onPress={() => setHoursPerPerson(Math.max(1, hoursPerPerson - 1))}
              >
                <Minus size={18} color={colors.textTertiary} />
              </PressableOpacity>
              <View style={styles.stepperDivider} />
              <View style={styles.stepperValue}>
                <Text style={styles.stepperValueText}>{hoursPerPerson}</Text>
              </View>
              <View style={styles.stepperDivider} />
              <PressableOpacity
                style={styles.stepperButton}
                onPress={() => setHoursPerPerson(hoursPerPerson + 1)}
              >
                <Plus size={18} color={colors.textTertiary} />
              </PressableOpacity>
              <Text style={styles.stepperLabel}>horas</Text>
            </View>
          </View>
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

        <View style={styles.obsSection}>
          <Text style={styles.obsLabel}>OBSERVAÇÃO</Text>
          <TextInput
            style={styles.obsInput}
            value={observation}
            onChangeText={setObservation}
            placeholder="Ex.: Equipa trabalhou no período da manhã."
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
    gap: 12,
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
    backgroundColor: "rgba(30, 41, 59, 0.6)",
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
    backgroundColor: "rgba(30, 41, 59, 0.6)",
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
    backgroundColor: "rgba(30, 41, 59, 0.6)",
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
  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  summaryLeft: {
    gap: 2,
  },
  summaryTitle: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  summarySubtitle: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.presets.h2,
    color: colors.brandPrimary,
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
    backgroundColor: "rgba(30, 41, 59, 0.6)",
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
