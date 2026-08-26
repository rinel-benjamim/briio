import { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Clock, ChevronDown } from "lucide-react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { colors, typography } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ContextBar } from "@/components/ui/ContextBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { AutosaveStatus } from "@/components/ui/AutosaveStatus";
import {
  MOCK_RDO_CONTEXT,
  IMPACT_OPTIONS,
  MOCK_OCCURRENCES_DATA,
} from "@/mocks";
import type { ImpactOption } from "@/mocks";

interface OccurrenceFormProps {
  mode: "add" | "edit";
}

export function OccurrenceForm({ mode }: OccurrenceFormProps) {
  const { id, occId } = useLocalSearchParams<{ id: string; occId?: string }>();
  const insets = useSafeAreaInsets();

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

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={mode === "add" ? "Registar ocorrência" : "Editar ocorrência"}
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ContextBar date={MOCK_RDO_CONTEXT.date} projectName={MOCK_RDO_CONTEXT.projectName} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DETALHES DA OCORRÊNCIA</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Título</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex.: Chuva intensa"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Hora</Text>
            <PressableOpacity
              style={styles.timeField}
              onPress={() => setShowTimePicker(true)}
            >
              <Clock size={18} color={colors.textTertiary} />
              <Text style={styles.timeValue}>{formatTime(timeDate)}</Text>
              <ChevronDown size={18} color={colors.textTertiary} />
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

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Local / frente</Text>
            <TextInput
              style={styles.textInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Ex.: Área externa"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Descrição</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Descreva o que aconteceu e como afetou os trabalhos."
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>IMPACTO</Text>
          <View style={styles.segmentedControl}>
            {IMPACT_OPTIONS.map((option) => (
              <PressableOpacity
                key={option.value}
                style={[
                  styles.segmentOption,
                  impact === option.value && styles.segmentOptionSelected,
                ]}
                onPress={() => setImpact(option.value)}
              >
                <Text
                  style={[
                    styles.segmentOptionText,
                    impact === option.value && styles.segmentOptionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </PressableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>MEDIDA TOMADA</Text>
          <TextInput
            style={styles.textArea}
            value={actionTaken}
            onChangeText={setActionTaken}
            placeholder="Ex.: Trabalhos exteriores interrompidos durante aproximadamente 1 hora."
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
    ...typography.presets.overline,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  textInput: {
    height: 48,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    ...typography.presets.body,
    color: colors.textPrimary,
  },
  timeField: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    justifyContent: "space-between",
  },
  timeValue: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  textArea: {
    height: 88,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    ...typography.presets.body,
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
  buttonSection: {
    gap: 12,
  },
});
