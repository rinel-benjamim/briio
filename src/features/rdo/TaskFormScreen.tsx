import { useState, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  PanResponder,
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
  MOCK_TASK_UNITS,
  TASK_STATUS_OPTIONS,
  TASK_STATUS_LABELS,
  MOCK_TASKS_DATA,
} from "@/mocks";
import type { TaskStatusOption } from "@/mocks";

interface TaskFormProps {
  mode: "add" | "edit";
}

export function TaskForm({ mode }: TaskFormProps) {
  const { id, taskId } = useLocalSearchParams<{ id: string; taskId?: string }>();
  const insets = useSafeAreaInsets();

  const editData = mode === "edit" ? MOCK_TASKS_DATA[taskId || "1"] : null;

  const [description, setDescription] = useState(editData?.description || "");
  const [location, setLocation] = useState(editData?.location || "");
  const [quantity, setQuantity] = useState(editData?.quantity || 120);
  const [unit, setUnit] = useState(editData?.unit || "m²");
  const [status, setStatus] = useState<TaskStatusOption>(editData?.status || "em_execucao");
  const [observation, setObservation] = useState(editData?.observation || "");
  const [progress, setProgress] = useState(editData?.progress || 65);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const trackWidth = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (trackWidth.current > 0) {
          const newProgress = Math.round((gestureState.dx / trackWidth.current) * 100);
          const clampedProgress = Math.max(0, Math.min(100, progress + newProgress));
          setProgress(clampedProgress);
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={mode === "add" ? "Adicionar atividade" : "Editar atividade"}
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ContextBar date={MOCK_RDO_CONTEXT.date} projectName={MOCK_RDO_CONTEXT.projectName} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ATIVIDADE</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Descrição da atividade</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Ex.: Execução de alvenaria"
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Local / frente de trabalho</Text>
            <TextInput
              style={styles.textInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Ex.: Piso 2 — Bloco A"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Quantidade executada</Text>
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
                {MOCK_TASK_UNITS.map((u) => (
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
          <Text style={styles.sectionLabel}>ESTADO</Text>
          <View style={styles.segmentedControl}>
            {TASK_STATUS_OPTIONS.map((option) => (
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

        <View style={styles.obsSection}>
          <Text style={styles.obsLabel}>OBSERVAÇÃO</Text>
          <TextInput
            style={styles.obsInput}
            value={observation}
            onChangeText={setObservation}
            placeholder="Ex.: Execução iniciada no período da manhã."
            placeholderTextColor={colors.textSecondary}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>PROGRESSO DA ATIVIDADE</Text>
          <View style={styles.progressCard}>
            <PressableOpacity
              style={styles.progressButton}
              onPress={() => setProgress(Math.max(0, progress - 5))}
            >
              <Minus size={14} color={colors.textTertiary} />
            </PressableOpacity>
            <View
              style={styles.progressTrack}
              onLayout={(e) => {
                trackWidth.current = e.nativeEvent.layout.width;
              }}
              {...panResponder.panHandlers}
            >
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
              <View style={[styles.progressThumb, { left: `${progress}%` }]} />
            </View>
            <PressableOpacity
              style={styles.progressButton}
              onPress={() => setProgress(Math.min(100, progress + 5))}
            >
              <Plus size={14} color={colors.textTertiary} />
            </PressableOpacity>
            <Text style={styles.progressValue}>{progress}%</Text>
          </View>
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
  textArea: {
    height: 64,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    ...typography.presets.body,
    color: colors.textPrimary,
  },
  textInput: {
    height: 48,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    ...typography.presets.body,
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
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  segmentOptionTextSelected: {
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.semibold,
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
    height: 72,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    ...typography.presets.body,
    color: colors.textPrimary,
  },
  progressSection: {
    gap: 10,
  },
  progressLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  progressCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    position: "relative",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.brandPrimary,
    borderRadius: 3,
  },
  progressThumb: {
    position: "absolute",
    top: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.brandPrimary,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginLeft: -8,
  },
  progressButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "rgba(148, 163, 184, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  progressValue: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    minWidth: 40,
    textAlign: "center",
  },
  buttonSection: {
    gap: 12,
  },
});
