import { useState } from "react";
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
import {
  MOCK_RDO_CONTEXT,
  IMPACT_OPTIONS,
  MOCK_OCCURRENCES_DATA,
} from "@/mocks";
import type { ImpactOption } from "@/mocks";

interface OccurrenceFormProps {
  mode: "add" | "edit";
  currentStep?: number;
  totalSteps?: number;
}

export function OccurrenceForm({ mode, currentStep = 6, totalSteps = 9 }: OccurrenceFormProps) {
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

  const { id, occId } = useLocalSearchParams<{ id: string; occId?: string }>();

  const editData = mode === "edit" ? MOCK_OCCURRENCES_DATA[occId || "1"] : null;

  const parseTimeString = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return new Date(2026, 7, 12, hours, minutes);
  };

  const [title, setTitle] = useState(editData?.title || "");
  const [timeDate, setTimeDate] = useState(
    editData?.time ? parseTimeString(editData.time) : new Date(2026, 7, 12, 14, 20)
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState(editData?.location || "");
  const [description, setDescription] = useState(editData?.description || "");
  const [impact, setImpact] = useState<ImpactOption>(editData?.impact || "impacto_relevante");
  const [actionTaken, setActionTaken] = useState(editData?.actionTaken || "");

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
        <ContextBar date={MOCK_RDO_CONTEXT.date} projectName={MOCK_RDO_CONTEXT.projectName} />

        <View style={styles.section}>
          <Field
            label="Título"
            value={title}
            onChangeText={setTitle}
            placeholder="Ex.: Chuva intensa"
          />

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
          />
        </View>

        <SegmentedField
          label="Impacto"
          value={impact}
          options={IMPACT_OPTIONS}
          onChange={(v) => setImpact(v as ImpactOption)}
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


