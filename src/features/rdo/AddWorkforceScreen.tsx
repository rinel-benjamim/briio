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

const MOCK_ROLES = [
  "Mestre de Obras",
  "Servente",
  "Pedreiro",
  "Eletricista",
  "Canalizador",
  "Operador de Máquinas",
  "Outro",
];

export default function AddWorkforceScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [step] = useState(2);
  const totalSteps = 9;

  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [peopleCount, setPeopleCount] = useState(1);
  const [hoursPerPerson, setHoursPerPerson] = useState(8);
  const [observation, setObservation] = useState("");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const totalHours = peopleCount * hoursPerPerson;
  const isCustomRole = role === "Outro";

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
      gap: 12,
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
    stepperLabel: {
      ...typography.presets.caption,
      color: colors.textMuted,
      marginRight: 14,
    },
    summaryCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.bgSurface,
      borderRadius: 16,
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
      color: colors.textMuted,
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
        <Text style={styles.navTitle}>Adicionar mão de obra</Text>
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
              <ChevronDown size={18} color={colors.textMuted} />
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
                placeholderTextColor={colors.textMuted}
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
                <Minus size={18} color={colors.textMuted} />
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
                <Plus size={18} color={colors.textMuted} />
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
                <Minus size={18} color={colors.textMuted} />
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
                <Plus size={18} color={colors.textMuted} />
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
