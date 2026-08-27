import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { CirclePlus, Clock, ChevronDown } from "lucide-react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { typography, borderRadius } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ContextBar } from "@/components/ui/ContextBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { AutosaveStatus } from "@/components/ui/AutosaveStatus";
import { SegmentedField } from "@/components/ui/Form/SegmentedField";
import { TextArea } from "@/components/ui/Form/TextArea";
import { Field } from "@/components/ui/Form/Field";
import { ErrorMessage } from "@/components/ui/Form/ErrorMessage";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useRdo } from "@/contexts/RdoContext";
import { useOccurrenceRepository } from "@/repositories/occurrence.repository";
import type { OccurrenceImpact } from "@/types";
import {
  validate,
  hasErrors,
  occurrenceValidation,
} from "@/utils/validation";

const IMPACT_OPTIONS = [
  { label: "Nenhum", value: "none" },
  { label: "Baixo", value: "low" },
  { label: "Relevante", value: "relevant" },
  { label: "Paragem", value: "stoppage" },
];

const IMPACT_LABELS: Record<string, string> = {
  none: "Nenhum",
  low: "Baixo",
  relevant: "Relevante",
  stoppage: "Paragem",
};

interface OccurrenceFormProps {
  mode: "add" | "edit";
  currentStep?: number;
  totalSteps?: number;
}

export function OccurrenceForm({ mode, currentStep = 6, totalSteps = 9 }: OccurrenceFormProps) {
  const colors = useThemeColors();
  const { id, occId } = useLocalSearchParams<{ id: string; occId?: string }>();
  const { date, projectName } = useRdo();
  const occurrenceRepo = useOccurrenceRepository();

  const [title, setTitle] = useState("");
  const [timeDate, setTimeDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [impact, setImpact] = useState<OccurrenceImpact>("none");
  const [actionTaken, setActionTaken] = useState("");
  const [loading, setLoading] = useState(mode === "edit");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (mode === "edit" && occId) {
      occurrenceRepo.findById(occId).then((entry) => {
        if (entry) {
          setTitle(entry.title);
          if (entry.occurred_at) {
            setTimeDate(new Date(entry.occurred_at));
          }
          setLocation(entry.location ?? "");
          setDescription(entry.description ?? "");
          setImpact(entry.impact);
          setActionTaken(entry.action_taken ?? "");
        }
        setLoading(false);
      });
    }
  }, [mode, occId]);

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
    field: {
      gap: 8,
    },
    fieldLabel: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textMain,
    },
    timeField: {
      flexDirection: "row",
      alignItems: "center",
      height: 48,
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.lg,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: "space-between",
    },
    timeValue: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMain,
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

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (selectedDate) {
      setTimeDate(selectedDate);
    }
  };

  const stepBadge = (
    <View style={styles.stepBadge}>
      <Text style={styles.stepBadgeText}>
        {currentStep} de {totalSteps}
      </Text>
    </View>
  );

  async function handleSave() {
    if (!id) return;

    const validationErrors = validate(occurrenceValidation, {
      occurrence_type: title,
      description,
    });
    setErrors(validationErrors);
    setTouched({ occurrence_type: true, description: true });
    if (hasErrors(validationErrors)) {
      return;
    }

    const occurredAt = timeDate.toISOString();

    if (mode === "add") {
      await occurrenceRepo.create(id, {
        title,
        occurred_at: occurredAt,
        location: location || undefined,
        description: description || undefined,
        impact,
        action_taken: actionTaken || undefined,
      });
    } else if (occId) {
      await occurrenceRepo.update(occId, {
        title,
        occurred_at: occurredAt,
        location: location || undefined,
        description: description || undefined,
        impact,
        action_taken: actionTaken || undefined,
      });
    }
    router.back();
  }

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={mode === "add" ? "Registar ocorrência" : "Editar ocorrência"}
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
          <Field
            label="Título"
            value={title}
            onChangeText={setTitle}
            placeholder="Ex.: Chuva intensa"
            onBlur={() => {
              setTouched((prev) => ({ ...prev, occurrence_type: true }));
              setErrors(validate(occurrenceValidation, { occurrence_type: title, description }));
            }}
          />
          <ErrorMessage message={errors.occurrence_type} visible={touched.occurrence_type} />

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Hora</Text>
            <PressableOpacity
              style={styles.timeField}
              onPress={() => setShowTimePicker(true)}
            >
              <Clock size={16} color={colors.textMuted} />
              <Text style={styles.timeValue}>{formatTime(timeDate)}</Text>
              <ChevronDown size={20} color={colors.textMuted} />
            </PressableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={timeDate}
                mode="time"
                is24Hour
                onChange={handleTimeChange}
              />
            )}
          </View>

          <Field
            label="Local / frente"
            value={location}
            onChangeText={setLocation}
            placeholder="Ex.: Área externa"
          />

          <TextArea
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            placeholder="Descreva o que aconteceu e como afetou os trabalhos."
            height={88}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, description: true }));
              setErrors(validate(occurrenceValidation, { occurrence_type: title, description }));
            }}
          />
          <ErrorMessage message={errors.description} visible={touched.description} />
        </View>

        <SegmentedField
          label="Impacto"
          value={impact}
          options={IMPACT_OPTIONS}
          onChange={(v) => setImpact(v as OccurrenceImpact)}
        />

        <TextArea
          label="Medida tomada"
          value={actionTaken}
          onChangeText={setActionTaken}
          placeholder="Ex.: Trabalhos exteriores interrompidos durante aproximadamente 1 hora."
          height={88}
        />

        <View style={styles.saveReassurance}>
          <AutosaveStatus />
        </View>

        <View style={styles.buttonSection}>
          <PrimaryButton
            label={mode === "add" ? "Registar ocorrência" : "Guardar alterações"}
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
