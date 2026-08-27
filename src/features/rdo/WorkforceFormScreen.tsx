import { useState, useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { CirclePlus } from "lucide-react-native";
import { typography, borderRadius } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ContextBar } from "@/components/ui/ContextBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { AutosaveStatus } from "@/components/ui/AutosaveStatus";
import { SelectField } from "@/components/ui/Form/SelectField";
import { TextArea } from "@/components/ui/Form/TextArea";
import { Field } from "@/components/ui/Form/Field";
import { ErrorMessage } from "@/components/ui/Form/ErrorMessage";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useRdo } from "@/contexts/RdoContext";
import { useWorkforceRepository } from "@/repositories/workforce.repository";
import {
  validate,
  hasErrors,
  workforceValidation,
} from "@/utils/validation";

const MOCK_ROLES = [
  "Mestre de Obras",
  "Serventes",
  "Pedreiro",
  "Armador",
  "Carpinteiro",
  "Electricista",
  "Canalizador",
  "Outro",
];

interface WorkforceFormProps {
  mode: "add" | "edit";
  currentStep?: number;
  totalSteps?: number;
}

export function WorkforceForm({ mode, currentStep = 2, totalSteps = 9 }: WorkforceFormProps) {
  const colors = useThemeColors();
  const { id, workforceId } = useLocalSearchParams<{ id: string; workforceId?: string }>();
  const { date, projectName } = useRdo();
  const workforceRepo = useWorkforceRepository();

  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [peopleCount, setPeopleCount] = useState(1);
  const [hoursPerPerson, setHoursPerPerson] = useState(8);
  const [observation, setObservation] = useState("");
  const [loading, setLoading] = useState(mode === "edit");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (mode === "edit" && workforceId) {
      workforceRepo.findById(workforceId).then((entry) => {
        if (entry) {
          setRole(entry.function);
          setPeopleCount(entry.people_count);
          setHoursPerPerson(entry.hours_per_person);
          setObservation(entry.observation ?? "");
        }
        setLoading(false);
      });
    }
  }, [mode, workforceId]);

  const styles = useThemedStyles((colors) => ({
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
  }));

  const totalHours = peopleCount * hoursPerPerson;
  const isCustomRole = role === "Outro";

  const stepBadge = (
    <View style={styles.stepBadge}>
      <Text style={styles.stepBadgeText}>
        {currentStep} de {totalSteps}
      </Text>
    </View>
  );

  async function handleSave() {
    if (!id) return;
    const functionName = isCustomRole ? customRole : role;

    const validationErrors = validate(workforceValidation, {
      role: functionName,
      worker_name: functionName,
      worker_count: peopleCount,
    });
    setErrors(validationErrors);
    setTouched({ role: true, worker_name: true, worker_count: true });
    if (hasErrors(validationErrors)) {
      return;
    }

    if (mode === "add") {
      await workforceRepo.create(id, {
        function: functionName,
        people_count: peopleCount,
        hours_per_person: hoursPerPerson,
        observation: observation || undefined,
      });
    } else if (workforceId) {
      await workforceRepo.update(workforceId, {
        function: functionName,
        people_count: peopleCount,
        hours_per_person: hoursPerPerson,
        observation: observation || undefined,
      });
    }
    router.back();
  }

  if (loading) return <LoadingScreen />;

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
        <ContextBar date={date} projectName={projectName} />

        <View style={styles.section}>
          <SelectField
            label="Função"
            value={isCustomRole ? customRole || "" : role}
            options={MOCK_ROLES}
            onSelect={(v) => {
              setRole(v);
              setCustomRole("");
              setTouched((prev) => ({ ...prev, role: true }));
              const fn = v === "Outro" ? "" : v;
              setErrors(validate(workforceValidation, { role: fn, worker_name: fn, worker_count: peopleCount }));
            }}
            placeholder="Ex.: Mestre de Obras"
          />
          <ErrorMessage message={errors.role} visible={touched.role} />
          {isCustomRole && (
            <Field
              label="Nome da função"
              value={customRole}
              onChangeText={setCustomRole}
              placeholder="Inserir nome da função"
              onBlur={() => {
                setTouched((prev) => ({ ...prev, role: true }));
                const fn = customRole;
                setErrors(validate(workforceValidation, { role: fn, worker_name: fn, worker_count: peopleCount }));
              }}
            />
          )}

          <View style={styles.stepperRow}>
            <View style={styles.stepperHalf}>
              <Field
                label="N.º de pessoas"
                value={String(peopleCount)}
                onChangeText={(v) => {
                  const num = Number(v) || 1;
                  setPeopleCount(num);
                  setTouched((prev) => ({ ...prev, worker_count: true }));
                  const fn = isCustomRole ? customRole : role;
                  setErrors(validate(workforceValidation, { role: fn, worker_name: fn, worker_count: num }));
                }}
                keyboardType="numeric"
                placeholder="2"
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, worker_count: true }));
                  const fn = isCustomRole ? customRole : role;
                  setErrors(validate(workforceValidation, { role: fn, worker_name: fn, worker_count: peopleCount }));
                }}
              />
              <ErrorMessage message={errors.worker_count} visible={touched.worker_count} />
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
            onPress={handleSave}
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
