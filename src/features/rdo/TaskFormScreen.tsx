import { useState, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  PanResponder,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Minus, Plus } from "lucide-react-native";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
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

  const editData = mode === "edit" ? MOCK_TASKS_DATA[taskId || "1"] : null;

  const [description, setDescription] = useState(editData?.description || "");
  const [location, setLocation] = useState(editData?.location || "");
  const [quantity, setQuantity] = useState(editData?.quantity || 120);
  const [unit, setUnit] = useState(editData?.unit || "m²");
  const [status, setStatus] = useState<TaskStatusOption>(editData?.status || "em_execucao");
  const [observation, setObservation] = useState(editData?.observation || "");
  const [progress, setProgress] = useState(editData?.progress || 65);

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

          <TextArea
            label="Descrição da atividade"
            value={description}
            onChangeText={setDescription}
            placeholder="Ex.: Execução de alvenaria"
            height={64}
          />

          <Field
            label="Local / frente de trabalho"
            value={location}
            onChangeText={setLocation}
            placeholder="Ex.: Piso 2 — Bloco A"
          />

          <StepperField
            label="Quantidade executada"
            value={quantity}
            onChange={setQuantity}
            min={1}
          />

          <SelectField
            label="Unidade"
            value={unit}
            options={MOCK_TASK_UNITS}
            onSelect={setUnit}
          />
        </View>

        <SegmentedField
          label="ESTADO"
          value={status}
          options={TASK_STATUS_OPTIONS}
          onChange={(v) => setStatus(v as TaskStatusOption)}
        />

        <TextArea
          label="OBSERVAÇÃO"
          value={observation}
          onChangeText={setObservation}
          placeholder="Ex.: Execução iniciada no período da manhã."
          height={72}
        />

        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>PROGRESSO DA ATIVIDADE</Text>
          <View style={styles.progressCard}>
            <PressableOpacity
              style={styles.progressButton}
              onPress={() => setProgress(Math.max(0, progress - 5))}
            >
              <Minus size={14} color={colors.primary} />
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
              <Plus size={14} color={colors.primary} />
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
  progressSection: {
    gap: 10,
  },
  progressLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  progressCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgSurface,
    borderRadius: borderRadius.lg,
    padding: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    position: "relative",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressThumb: {
    position: "absolute",
    top: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.bgSurface,
    marginLeft: -8,
  },
  progressButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  progressValue: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMain,
    minWidth: 40,
    textAlign: "center",
  },
  buttonSection: {
    gap: 12,
  },
});
