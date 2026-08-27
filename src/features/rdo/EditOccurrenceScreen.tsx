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
import { ArrowLeft, Clock, Check, ChevronDown } from "lucide-react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useThemeColors } from "@/contexts/ThemeContext";
import { colors } from "@/constants";
import { typography } from "@/constants/typography";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

const MOCK_CONTEXT = {
  date: "12 Agosto 2026",
  projectName: "Reabilitação Pedrinhas",
};

type ImpactOption = "sem_impacto" | "impacto_baixo" | "impacto_relevante" | "paralisacao";

const IMPACT_OPTIONS: { value: ImpactOption; label: string }[] = [
  { value: "sem_impacto", label: "Sem impacto" },
  { value: "impacto_baixo", label: "Impacto baixo" },
  { value: "impacto_relevante", label: "Impacto relevante" },
  { value: "paralisacao", label: "Paralisação" },
];

type OccurrenceData = {
  title: string;
  time: string;
  location: string;
  description: string;
  impact: ImpactOption;
  actionTaken: string;
};

const MOCK_OCCURRENCES_DATA: Record<string, OccurrenceData> = {
  "1": {
    title: "Chuva intensa",
    time: "14:20",
    location: "Área externa",
    description:
      "Interrupção dos trabalhos exteriores durante aproximadamente 1 hora.",
    impact: "impacto_relevante",
    actionTaken:
      "Trabalhos exteriores interrompidos durante aproximadamente 1 hora.",
  },
  "2": {
    title: "Atraso na entrega de material",
    time: "10:30",
    location: "Frente B",
    description:
      "A entrega do cimento prevista para a manhã ocorreu às 14h.",
    impact: "impacto_baixo",
    actionTaken:
      "Frente B redirecionada para outras tarefas até a chegada do material.",
  },
};

export default function EditOccurrenceScreen() {
  const colors = useThemeColors();
  const { id, occId } = useLocalSearchParams<{ id: string; occId: string }>();
  const insets = useSafeAreaInsets();
  const [step] = useState(6);
  const totalSteps = 9;

  const data = MOCK_OCCURRENCES_DATA[occId || "1"];

  const parseTimeString = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return new Date(2026, 7, 12, hours, minutes);
  };

  const [title, setTitle] = useState(data?.title || "");
  const [timeDate, setTimeDate] = useState(parseTimeString(data?.time || "14:20"));
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState(data?.location || "");
  const [description, setDescription] = useState(data?.description || "");
  const [impact, setImpact] = useState<ImpactOption>(data?.impact || "impacto_relevante");
  const [actionTaken, setActionTaken] = useState(data?.actionTaken || "");

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
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity
          style={styles.navButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.textPrimary} />
        </PressableOpacity>
        <Text style={styles.navTitle}>Editar ocorrência</Text>
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
          <Text style={styles.contextProject}>
            {MOCK_CONTEXT.projectName}
          </Text>
        </View>

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
              <Clock size={18} color="#6B7280" />
              <Text style={styles.timeValue}>{formatTime(timeDate)}</Text>
              <ChevronDown size={18} color="#9CA3AF" />
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
          <PressableOpacity
            style={styles.primaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>Guardar alterações</Text>
          </PressableOpacity>
          <PressableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </PressableOpacity>
        </View>

        <View style={styles.autosaveStatus}>
          <Check size={14} color="#9CA3AF" />
          <Text style={styles.autosaveText}>Salvo automaticamente</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceBg,
  },
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
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
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  progressText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: "#1B3A5C",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 20,
  },
  context: {
    gap: 2,
  },
  contextDate: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
  contextProject: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    ...typography.presets.caption,
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    overflow: "hidden",
    height: 40,
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
    color: "#FFFFFF",
    fontWeight: typography.fontWeight.semibold,
  },
  buttonSection: {
    gap: 12,
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandPrimary,
    borderRadius: 24,
    height: 48,
  },
  primaryButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: "#FFFFFF",
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 44,
  },
  secondaryButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  autosaveStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  autosaveText: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
});
