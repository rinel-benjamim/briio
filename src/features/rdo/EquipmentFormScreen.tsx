import { useState, useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { CirclePlus } from "lucide-react-native";
import { typography, borderRadius } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ContextBar } from "@/components/ui/ContextBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { AutosaveStatus } from "@/components/ui/AutosaveStatus";
import { SelectField } from "@/components/ui/Form/SelectField";
import { SegmentedField } from "@/components/ui/Form/SegmentedField";
import { TextArea } from "@/components/ui/Form/TextArea";
import { Field } from "@/components/ui/Form/Field";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useRdo } from "@/contexts/RdoContext";
import { useEquipmentRepository } from "@/repositories/equipment.repository";
import type { EquipmentStatus } from "@/types";

const MOCK_EQUIPMENT_OPTIONS = [
  "Retroescavadora",
  "Betoneira",
  "Camião basculante",
  "Guindaste",
  "Compressor",
  "Gerador",
  "Motocicleta",
  "Outro",
];

const EQUIPMENT_STATUS_OPTIONS = [
  { label: "Em operação", value: "operational" },
  { label: "Parado", value: "stopped" },
  { label: "Manutenção", value: "maintenance" },
  { label: "Indisponível", value: "unavailable" },
];

const EQUIPMENT_STATUS_LABELS: Record<string, string> = {
  operational: "Em operação",
  stopped: "Parado",
  maintenance: "Manutenção",
  unavailable: "Indisponível",
};

interface EquipmentFormProps {
  mode: "add" | "edit";
  currentStep?: number;
  totalSteps?: number;
}

export function EquipmentForm({ mode, currentStep = 4, totalSteps = 9 }: EquipmentFormProps) {
  const colors = useThemeColors();
  const { id, equipmentId } = useLocalSearchParams<{ id: string; equipmentId?: string }>();
  const { date, projectName } = useRdo();
  const equipmentRepo = useEquipmentRepository();

  const [equipment, setEquipment] = useState("");
  const [customEquipment, setCustomEquipment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [hours, setHours] = useState(8);
  const [status, setStatus] = useState<EquipmentStatus>("operational");
  const [observation, setObservation] = useState("");
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode === "edit" && equipmentId) {
      equipmentRepo.findById(equipmentId).then((entry) => {
        if (entry) {
          setEquipment(entry.equipment);
          setQuantity(entry.quantity);
          setHours(entry.hours_used);
          setStatus(entry.status);
          setObservation(entry.observation ?? "");
        }
        setLoading(false);
      });
    }
  }, [mode, equipmentId]);

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
    summaryCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.primaryLight,
      borderRadius: borderRadius["2xl"],
      padding: 16,
    },
    summaryLeft: {
      gap: 3,
    },
    summaryTitle: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: typography.fontWeight.bold,
      fontFamily: typography.fontFamily,
      color: colors.primaryHover,
    },
    summarySubtitle: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: typography.fontWeight.regular,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    },
    summaryStatus: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: typography.fontWeight.regular,
      fontFamily: typography.fontFamily,
      color: colors.primary,
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

  const isCustomEquipment = equipment === "Outro";

  const stepBadge = (
    <View style={styles.stepBadge}>
      <Text style={styles.stepBadgeText}>
        {currentStep} de {totalSteps}
      </Text>
    </View>
  );

  async function handleSave() {
    if (!id) return;
    const equipmentName = isCustomEquipment ? customEquipment : equipment;
    if (!equipmentName) return;

    if (mode === "add") {
      await equipmentRepo.create(id, {
        equipment: equipmentName,
        quantity,
        hours_used: hours,
        status,
        observation: observation || undefined,
      });
    } else if (equipmentId) {
      await equipmentRepo.update(equipmentId, {
        equipment: equipmentName,
        quantity,
        hours_used: hours,
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
        title={mode === "add" ? "Adicionar equipamento" : "Editar equipamento"}
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
          <SelectField
            label="Equipamento"
            value={isCustomEquipment ? customEquipment || "" : equipment}
            options={MOCK_EQUIPMENT_OPTIONS}
            onSelect={(v) => {
              setEquipment(v);
              setCustomEquipment("");
            }}
            placeholder="Ex.: Retroescavadora"
          />
          {isCustomEquipment && (
            <Field
              label="Nome do equipamento"
              value={customEquipment}
              onChangeText={setCustomEquipment}
              placeholder="Inserir nome do equipamento"
            />
          )}

          <View style={styles.fieldRow}>
            <View style={styles.fieldHalf}>
              <Field
                label="Quantidade"
                value={String(quantity)}
                onChangeText={(v) => setQuantity(Number(v) || 1)}
                keyboardType="numeric"
                placeholder="1"
              />
            </View>
            <View style={styles.fieldHalf}>
              <Field
                label="Horas de utilização"
                value={String(hours)}
                onChangeText={(v) => setHours(Number(v) || 1)}
                keyboardType="numeric"
                placeholder="8"
              />
            </View>
          </View>
        </View>

        <SegmentedField
          label="Estado"
          value={status}
          options={EQUIPMENT_STATUS_OPTIONS}
          onChange={(v) => setStatus(v as EquipmentStatus)}
        />

        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryTitle}>
              {quantity} {quantity === 1 ? "unidade" : "unidades"}
            </Text>
            <Text style={styles.summarySubtitle}>{hours} h de utilização</Text>
          </View>
          <Text style={styles.summaryStatus}>{EQUIPMENT_STATUS_LABELS[status]}</Text>
        </View>

        <TextArea
          label="Observação"
          value={observation}
          onChangeText={setObservation}
          placeholder="Ex.: Equipamento utilizado na preparação do terreno."
          height={80}
        />

        <View style={styles.saveReassurance}>
          <AutosaveStatus />
        </View>

        <View style={styles.buttonSection}>
          <PrimaryButton
            label={mode === "add" ? "Adicionar equipamento" : "Guardar alterações"}
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
