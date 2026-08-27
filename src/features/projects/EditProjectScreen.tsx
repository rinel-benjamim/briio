import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  ChevronDown,
  Calendar,
} from "lucide-react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { typography, borderRadius } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useProject, useProjects } from "@/hooks/useProjects";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { AutosaveStatus } from "@/components/ui/AutosaveStatus";
import { Field } from "@/components/ui/Form/Field";
import { SelectField } from "@/components/ui/Form/SelectField";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const PROVINCES = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando-Cubango",
  "Cuanza Norte", "Cuanza Sul", "Cunene", "Huambo", "Huíla",
  "Icolo e Bengo", "Luanda", "Lunda Norte", "Lunda Sul",
  "Malanje", "Moxico", "Namibe", "Uíge", "Zaire",
];

interface DateFieldProps {
  label: string;
  value: Date | null;
  placeholder: string;
  required?: boolean;
  optional?: boolean;
  onChange: (date: Date) => void;
  colors: ReturnType<typeof useThemeColors>;
  styles: any;
}

function DateField({
  label,
  value,
  placeholder,
  required,
  optional,
  onChange,
  colors,
  styles,
}: DateFieldProps) {
  const [show, setShow] = useState(false);

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("pt-AO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <View style={styles.field}>
      <View style={styles.fieldLabel}>
        <Text style={styles.fieldLabelText}>
          {label}{required && " *"}
        </Text>
      </View>
      <Pressable style={styles.inputContainer} onPress={() => setShow(true)}>
        <View style={styles.inputLeft}>
          <Calendar size={16} color={colors.textMuted} />
          <Text style={[styles.input, value && styles.inputText]}>
            {value ? formatDate(value) : placeholder}
          </Text>
        </View>
        <ChevronDown size={20} color={colors.textMuted} />
      </Pressable>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onValueChange={handleChange}
          minimumDate={new Date(2020, 0, 1)}
          maximumDate={new Date(2030, 11, 31)}
          locale="pt-AO"
        />
      )}

      {show && Platform.OS === "ios" && (
        <Pressable
          style={styles.datePickerConfirm}
          onPress={() => setShow(false)}
        >
          <Text style={styles.datePickerConfirmText}>Confirmar</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function EditProjectScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { project, loading: projectLoading } = useProject(id ?? null);
  const { update } = useProjects();

  const [name, setName] = useState("");
  const [reference, setReference] = useState("");
  const [location, setLocation] = useState("");
  const [province, setProvince] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [responsible, setResponsible] = useState("");
  const [client, setClient] = useState("");
  const [contractor, setContractor] = useState("");
  const [inspector, setInspector] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setReference(project.reference ?? "");
      setLocation(project.location ?? "");
      setProvince(project.province ?? "");
      setStartDate(project.start_date ? new Date(project.start_date) : null);
      setEndDate(project.expected_end_date ? new Date(project.expected_end_date) : null);
      setResponsible(project.responsible_name ?? "");
      setClient(project.client_name ?? "");
      setContractor(project.contractor_name ?? "");
      setInspector(project.inspector_name ?? "");
    }
  }, [project]);

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
    sectionTitle: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: typography.fontWeight.bold,
      fontFamily: typography.fontFamily,
      color: colors.textMain,
    },
    field: {
      gap: 6,
    },
    fieldLabel: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    fieldLabelText: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textMain,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: 48,
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.lg,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      gap: 10,
    },
    input: {
      flex: 1,
      ...typography.presets.body,
      color: colors.textMain,
      padding: 0,
    },
    inputText: {
      color: colors.textMain,
    },
    datePickerConfirm: {
      alignItems: "center",
      paddingVertical: 12,
      backgroundColor: colors.primary,
      borderRadius: borderRadius.lg,
      marginTop: 8,
    },
    datePickerConfirmText: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textOnBrand,
    },
    saveReassurance: {
      alignItems: "flex-start",
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

  if (projectLoading) return <LoadingScreen />;

  if (!project) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Editar obra" onBack={() => router.back()} />
        <Text style={{ color: colors.textMuted, textAlign: "center", marginTop: 100 }}>
          Obra não encontrada.
        </Text>
      </View>
    );
  }

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "O nome da obra é obrigatório.");
      return;
    }
    setSaving(true);
    try {
      await update(id!, {
        name: name.trim(),
        reference: reference.trim() || undefined,
        location: location.trim() || undefined,
        province: province || undefined,
        start_date: startDate ? startDate.toISOString() : undefined,
        expected_end_date: endDate ? endDate.toISOString() : undefined,
        responsible_name: responsible.trim() || undefined,
        client_name: client.trim() || undefined,
        contractor_name: contractor.trim() || undefined,
        inspector_name: inspector.trim() || undefined,
      });
      router.back();
    } catch (e: any) {
      Alert.alert("Erro", e.message || "Erro ao guardar alterações.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Editar obra"
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Field
            label="Nome da obra"
            value={name}
            onChangeText={setName}
            placeholder="Ex.: Reabilitação Pedrinhas"
          />
          <Field
            label="Referência"
            value={reference}
            onChangeText={setReference}
            placeholder="Ex.: OBR-2026-032"
          />
        </View>

        <View style={styles.section}>
          <Field
            label="Localização da obra"
            value={location}
            onChangeText={setLocation}
            placeholder="Introduza a localização"
          />
          <SelectField
            label="Província"
            value={province}
            options={PROVINCES}
            onSelect={setProvince}
            placeholder="Selecionar província"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldHalf}>
              <DateField
                label="Data de início"
                value={startDate}
                placeholder="Selecionar data"
                required
                onChange={setStartDate}
                colors={colors}
                styles={styles}
              />
            </View>
            <View style={styles.fieldHalf}>
              <DateField
                label="Previsão de conclusão"
                value={endDate}
                placeholder="Selecionar data"
                optional
                onChange={setEndDate}
                colors={colors}
                styles={styles}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Field
            label="Responsável pela obra"
            value={responsible}
            onChangeText={setResponsible}
            placeholder="Nome do responsável"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entidades</Text>
          <Field
            label="Cliente"
            value={client}
            onChangeText={setClient}
            placeholder="Nome do cliente"
          />
          <Field
            label="Empreiteiro"
            value={contractor}
            onChangeText={setContractor}
            placeholder="Nome da empresa"
          />
          <Field
            label="Fiscalização"
            value={inspector}
            onChangeText={setInspector}
            placeholder="Nome da entidade / responsável"
          />
        </View>

        <View style={styles.saveReassurance}>
          <AutosaveStatus />
        </View>

        <PrimaryButton
          label={saving ? "Guardando..." : "Guardar alterações"}
          onPress={handleSave}
          disabled={saving}
        />

        <PressableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Cancelar"
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </PressableOpacity>
      </ScrollView>
    </View>
  );
}
