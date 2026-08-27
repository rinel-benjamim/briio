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
import { useMaterialRepository } from "@/repositories/material.repository";
import type { MaterialStatus } from "@/types";

const MOCK_MATERIALS_OPTIONS = [
  "Cimento Portland 42.5",
  "Areia média",
  "Bloco de cimento",
  "Brita",
  "Vergalhão",
  "Tubo PVC",
  "Fio eléctrico",
  "Outro",
];

const MOCK_UNITS = ["sacos", "m³", "un.", "kg", "l", "cx", "rolo"];

const MATERIAL_STATUS_OPTIONS = [
  { label: "Recebido", value: "received" },
  { label: "Utilizado", value: "used" },
  { label: "Em falta", value: "missing" },
  { label: "Em trânsito", value: "in_transit" },
];

const MATERIAL_STATUS_LABELS: Record<string, string> = {
  received: "Recebido",
  used: "Utilizado",
  missing: "Em falta",
  in_transit: "Em trânsito",
};

interface MaterialFormProps {
  mode: "add" | "edit";
  currentStep?: number;
  totalSteps?: number;
}

export function MaterialForm({ mode, currentStep = 3, totalSteps = 9 }: MaterialFormProps) {
  const colors = useThemeColors();
  const { id, materialId } = useLocalSearchParams<{ id: string; materialId?: string }>();
  const { date, projectName } = useRdo();
  const materialRepo = useMaterialRepository();

  const [material, setMaterial] = useState("");
  const [customMaterial, setCustomMaterial] = useState("");
  const [quantity, setQuantity] = useState(50);
  const [unit, setUnit] = useState("sacos");
  const [status, setStatus] = useState<MaterialStatus>("received");
  const [observation, setObservation] = useState("");
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode === "edit" && materialId) {
      materialRepo.findById(materialId).then((entry) => {
        if (entry) {
          setMaterial(entry.material);
          setQuantity(entry.quantity);
          setUnit(entry.unit ?? "sacos");
          setStatus(entry.status);
          setObservation(entry.observation ?? "");
        }
        setLoading(false);
      });
    }
  }, [mode, materialId]);

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
    summaryText: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: typography.fontWeight.bold,
      fontFamily: typography.fontFamily,
      color: colors.primaryHover,
    },
    summaryStatus: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: typography.fontWeight.regular,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
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

  const isCustomMaterial = material === "Outro";

  const stepBadge = (
    <View style={styles.stepBadge}>
      <Text style={styles.stepBadgeText}>
        {currentStep} de {totalSteps}
      </Text>
    </View>
  );

  async function handleSave() {
    if (!id) return;
    const materialName = isCustomMaterial ? customMaterial : material;
    if (!materialName) return;

    if (mode === "add") {
      await materialRepo.create(id, {
        material: materialName,
        quantity,
        unit,
        status,
        observation: observation || undefined,
      });
    } else if (materialId) {
      await materialRepo.update(materialId, {
        material: materialName,
        quantity,
        unit,
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
        title={mode === "add" ? "Adicionar material" : "Editar material"}
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
            label="Material"
            value={isCustomMaterial ? customMaterial || "" : material}
            options={MOCK_MATERIALS_OPTIONS}
            onSelect={(v) => {
              setMaterial(v);
              setCustomMaterial("");
            }}
            placeholder="Ex.: Cimento Portland 42.5"
          />
          {isCustomMaterial && (
            <Field
              label="Nome do material"
              value={customMaterial}
              onChangeText={setCustomMaterial}
              placeholder="Inserir nome do material"
            />
          )}

          <View style={styles.fieldRow}>
            <View style={styles.fieldHalf}>
              <Field
                label="Quantidade"
                value={String(quantity)}
                onChangeText={(v) => setQuantity(Number(v) || 1)}
                keyboardType="numeric"
                placeholder="50"
              />
            </View>
            <View style={styles.fieldHalf}>
              <SelectField
                label="Unidade"
                value={unit}
                options={MOCK_UNITS}
                onSelect={setUnit}
              />
            </View>
          </View>
        </View>

        <SegmentedField
          label="Situação"
          value={status}
          options={MATERIAL_STATUS_OPTIONS}
          onChange={(v) => setStatus(v as MaterialStatus)}
        />

        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>
            {quantity} {unit}
          </Text>
          <Text style={styles.summaryStatus}>{MATERIAL_STATUS_LABELS[status]}</Text>
        </View>

        <TextArea
          label="Observação"
          value={observation}
          onChangeText={setObservation}
          placeholder="Ex.: Material recebido no período da manhã."
          height={80}
        />

        <View style={styles.saveReassurance}>
          <AutosaveStatus />
        </View>

        <View style={styles.buttonSection}>
          <PrimaryButton
            label={mode === "add" ? "Adicionar material" : "Guardar alterações"}
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
