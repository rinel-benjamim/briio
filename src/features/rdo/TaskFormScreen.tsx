import { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  PanResponder,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { CirclePlus, Minus, Plus } from "lucide-react-native";
import { typography, borderRadius } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ContextBar } from "@/components/ui/ContextBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { AutosaveStatus } from "@/components/ui/AutosaveStatus";
import { SelectField } from "@/components/ui/Form/SelectField";
import { SegmentedField } from "@/components/ui/Form/SegmentedField";
import { TextArea } from "@/components/ui/Form/TextArea";
import { Field } from "@/components/ui/Form/Field";
import { ErrorMessage } from "@/components/ui/Form/ErrorMessage";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useRdo } from "@/contexts/RdoContext";
import { useTaskRepository } from "@/repositories/task.repository";
import type { TaskStatus } from "@/types";
import {
  validate,
  hasErrors,
  taskValidation,
} from "@/utils/validation";

const MOCK_TASK_UNITS = ["m²", "m", "un.", "kg", "l", "cx", "m³"];

const TASK_STATUS_OPTIONS = [
  { label: "Em execução", value: "in_progress" },
  { label: "Concluído", value: "completed" },
  { label: "Pausado", value: "paused" },
];

const TASK_STATUS_LABELS: Record<string, string> = {
  in_progress: "Em execução",
  completed: "Concluído",
  paused: "Pausado",
};

interface TaskFormProps {
  mode: "add" | "edit";
  currentStep?: number;
  totalSteps?: number;
}

export function TaskForm({ mode, currentStep = 5, totalSteps = 9 }: TaskFormProps) {
  const colors = useThemeColors();
  const { id, taskId } = useLocalSearchParams<{ id: string; taskId?: string }>();
  const { date, projectName } = useRdo();
  const taskRepo = useTaskRepository();

  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState(120);
  const [unit, setUnit] = useState("m²");
  const [status, setStatus] = useState<TaskStatus>("in_progress");
  const [observation, setObservation] = useState("");
  const [progress, setProgress] = useState(65);
  const [loading, setLoading] = useState(mode === "edit");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (mode === "edit" && taskId) {
      taskRepo.findById(taskId).then((entry) => {
        if (entry) {
          setDescription(entry.description);
          setLocation(entry.location ?? "");
          setQuantity(entry.quantity ?? 120);
          setUnit(entry.unit ?? "m²");
          setStatus(entry.status);
          setObservation(entry.observation ?? "");
          setProgress(entry.progress_percentage);
        }
        setLoading(false);
      });
    }
  }, [mode, taskId]);

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
    fieldRow: {
      flexDirection: "row",
      gap: 12,
    },
    fieldHalf: {
      flex: 1,
    },
    progressSection: {
      gap: 10,
    },
    progressLabel: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: typography.fontWeight.bold,
      fontFamily: typography.fontFamily,
      color: colors.textMain,
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

  const stepBadge = (
    <View style={styles.stepBadge}>
      <Text style={styles.stepBadgeText}>
        {currentStep} de {totalSteps}
      </Text>
    </View>
  );

  async function handleSave() {
    if (!id) return;

    const validationErrors = validate(taskValidation, {
      activity_name: description,
      status,
    });
    setErrors(validationErrors);
    setTouched({ activity_name: true, status: true });
    if (hasErrors(validationErrors)) {
      return;
    }

    if (mode === "add") {
      await taskRepo.create(id, {
        description,
        location: location || undefined,
        quantity,
        unit,
        progress_percentage: progress,
        status,
        observation: observation || undefined,
      });
    } else if (taskId) {
      await taskRepo.update(taskId, {
        description,
        location: location || undefined,
        quantity,
        unit,
        progress_percentage: progress,
        status,
        observation: observation || undefined,
      });
    }
    router.back();
  }

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={mode === "add" ? "Adicionar atividade" : "Editar atividade"}
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
          <TextArea
            label="Descrição da atividade"
            value={description}
            onChangeText={setDescription}
            placeholder="Ex.: Execução de alvenaria"
            height={64}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, activity_name: true }));
              setErrors(validate(taskValidation, { activity_name: description, status }));
            }}
          />
          <ErrorMessage message={errors.activity_name} visible={touched.activity_name} />

          <Field
            label="Local / frente de trabalho"
            value={location}
            onChangeText={setLocation}
            placeholder="Ex.: Piso 2 — Bloco A"
          />

          <View style={styles.fieldRow}>
            <View style={styles.fieldHalf}>
              <Field
                label="Quantidade executada"
                value={String(quantity)}
                onChangeText={(v) => setQuantity(Number(v) || 1)}
                keyboardType="numeric"
                placeholder="120"
              />
            </View>
            <View style={styles.fieldHalf}>
              <SelectField
                label="Unidade"
                value={unit}
                options={MOCK_TASK_UNITS}
                onSelect={setUnit}
              />
            </View>
          </View>
        </View>

        <SegmentedField
          label="Estado"
          value={status}
          options={TASK_STATUS_OPTIONS}
          onChange={(v) => {
            setStatus(v as TaskStatus);
            setTouched((prev) => ({ ...prev, status: true }));
            setErrors(validate(taskValidation, { activity_name: description, status: v }));
          }}
        />
        <ErrorMessage message={errors.status} visible={touched.status} />

        <TextArea
          label="Observação"
          value={observation}
          onChangeText={setObservation}
          placeholder="Ex.: Execução iniciada no período da manhã."
          height={72}
        />

        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>Progresso da atividade</Text>
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

        <View style={styles.saveReassurance}>
          <AutosaveStatus />
        </View>

        <View style={styles.buttonSection}>
          <PrimaryButton
            label={mode === "add" ? "Adicionar atividade" : "Guardar alterações"}
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
