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
import {
  ArrowLeft,
  ChevronDown,
  Minus,
  Plus,
  Check,
  Percent,
} from "lucide-react-native";
import { typography, borderRadius } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

const MOCK_CONTEXT = {
  date: "12 Agosto 2026",
  projectName: "Reabilitação Pedrinhas",
};

const MOCK_UNITS = ["m²", "m³", "un.", "kg", "L", "m", "sacos"];

type StatusOption = "em_execucao" | "concluida" | "paralisada";

const STATUS_OPTIONS: { value: StatusOption; label: string }[] = [
  { value: "em_execucao", label: "Em execução" },
  { value: "concluida", label: "Concluída" },
  { value: "paralisada", label: "Paralisada" },
];

const STATUS_LABELS: Record<StatusOption, string> = {
  em_execucao: "Em execução",
  concluida: "Concluída",
  paralisada: "Paralisada",
};

export default function AddTaskScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [step] = useState(5);
  const totalSteps = 9;

  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState(120);
  const [unit, setUnit] = useState("m²");
  const [status, setStatus] = useState<StatusOption>("em_execucao");
  const [observation, setObservation] = useState("");
  const [progress, setProgress] = useState(65);
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
    textArea: {
      height: 64,
      backgroundColor: colors.bgSurface,
      borderRadius: 12,
      padding: 12,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
      ...typography.presets.body,
      color: colors.textMain,
    },
    textInput: {
      height: 48,
      backgroundColor: colors.bgSurface,
      borderRadius: 12,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
      ...typography.presets.body,
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
    segmentedControl: {
      flexDirection: "row",
      height: 40,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    segmentOption: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.bgSurface,
    },
    segmentOptionSelected: {
      backgroundColor: colors.primary,
    },
    segmentOptionText: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
    segmentOptionTextSelected: {
      color: colors.textMain,
      fontWeight: typography.fontWeight.semibold,
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
      height: 72,
      backgroundColor: colors.bgSurface,
      borderRadius: 12,
      padding: 12,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
      ...typography.presets.body,
      color: colors.textMain,
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
      borderRadius: 12,
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
      borderColor: colors.textOnBrand,
      marginLeft: -8,
    },
    progressButton: {
      width: 28,
      height: 28,
      borderRadius: 6,
      backgroundColor: colors.bgSurface,
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
        <Text style={styles.navTitle}>Adicionar atividade</Text>
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
          <Text style={styles.sectionLabel}>ATIVIDADE</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Descrição da atividade</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Ex.: Execução de alvenaria"
              placeholderTextColor={colors.textMuted}
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
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Quantidade executada</Text>
            <View style={styles.stepper}>
              <PressableOpacity
                style={styles.stepperButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={18} color={colors.textMuted} />
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
                <Plus size={18} color={colors.textMuted} />
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
              <ChevronDown size={18} color={colors.textMuted} />
            </PressableOpacity>
            {showUnitDropdown && (
              <View style={styles.dropdownOptions}>
                {MOCK_UNITS.map((u) => (
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
            {STATUS_OPTIONS.map((option) => (
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
            placeholderTextColor={colors.textMuted}
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
              <Minus size={14} color={colors.textMuted} />
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
              <Plus size={14} color={colors.textMuted} />
            </PressableOpacity>
            <Text style={styles.progressValue}>{progress}%</Text>
          </View>
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
