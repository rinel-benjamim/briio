import { useState, useRef } from "react";
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
  currentStep?: number;
  totalSteps?: number;
}

export function TaskForm({ mode, currentStep = 5, totalSteps = 9 }: TaskFormProps) {
  const colors = useThemeColors();

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
        title={mode === "add" ? "Adicionar atividade" : "Editar atividade"}
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
          onChange={(v) => setStatus(v as TaskStatusOption)}
        />

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


