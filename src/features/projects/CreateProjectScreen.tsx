import { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  Modal,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  MapPin,
  ChevronDown,
  ChevronRight,
  Calendar,
} from "lucide-react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { Field } from "@/components/ui/Form/Field";
import { SelectField } from "@/components/ui/Form/SelectField";

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
}

function DateField({
  label,
  value,
  placeholder,
  required,
  optional,
  onChange,
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
        <Text style={styles.fieldLabelText}>{label}</Text>
        {optional && <Text style={styles.fieldOptional}>Opcional</Text>}
      </View>
      <Pressable style={styles.inputContainer} onPress={() => setShow(true)}>
        <View style={styles.inputLeft}>
          <Calendar size={16} color={colors.textMuted} />
          <Text style={[styles.input, value && styles.inputText]}>
            {value ? formatDate(value) : placeholder}
          </Text>
        </View>
        <ChevronDown size={18} color={colors.textMuted} />
      </Pressable>
      {required && <Text style={styles.fieldRequired}>Obrigatório</Text>}

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

export default function CreateProjectScreen() {
  const insets = useSafeAreaInsets();
  const [step] = useState(1);
  const totalSteps = 2;

  const [name, setName] = useState("");
  const [reference, setReference] = useState("");
  const [location, setLocation] = useState("");
  const [province, setProvince] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [client, setClient] = useState("");
  const [contractor, setContractor] = useState("");
  const [inspector, setInspector] = useState("");
  const [entidadesExpanded, setEntidadesExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.textMain} />
        </PressableOpacity>
        <Text style={styles.navTitle}>Nova obra</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>
            {step} de {totalSteps}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identificação</Text>
          <Field
            label="Nome da obra"
            value={name}
            onChangeText={setName}
            placeholder="Ex.: Reabilitação Pedrinhas"
          />
          <View style={styles.optionalField}>
            <Field
              label="Referência"
              value={reference}
              onChangeText={setReference}
              placeholder="Ex.: OBR-2026-032"
            />
            <Text style={styles.fieldOptional}>Opcional</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>
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
          <Text style={styles.sectionTitle}>Planeamento</Text>
          <DateField
            label="Data de início"
            value={startDate}
            placeholder="Selecionar data"
            required
            onChange={setStartDate}
          />
          <DateField
            label="Previsão de conclusão"
            value={endDate}
            placeholder="Selecionar data"
            optional
            onChange={setEndDate}
          />
        </View>

        <View style={styles.section}>
          <Pressable
            style={styles.sectionHeaderRow}
            onPress={() => setEntidadesExpanded(!entidadesExpanded)}
          >
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.sectionTitle}>Entidades</Text>
              <Text style={styles.sectionOptional}>Opcional</Text>
            </View>
            <ChevronRight
              size={18}
              color={colors.textMuted}
              style={[styles.chevron, entidadesExpanded && styles.chevronExpanded]}
            />
          </Pressable>
          {entidadesExpanded && (
            <>
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
            </>
          )}
        </View>

        <PressableOpacity
          style={styles.primaryButton}
          onPress={() => router.push(`/(tabs)/projects/1/configure-rdo`)}
        >
          <Text style={styles.primaryButtonText}>Continuar</Text>
        </PressableOpacity>

        <Text style={styles.supportingText}>
          Poderá alterar estas informações posteriormente.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
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
  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: colors.primaryLight,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 24,
  },
  section: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  chevron: {
    transform: [{ rotate: "0deg" }],
  },
  chevronExpanded: {
    transform: [{ rotate: "90deg" }],
  },
  sectionTitle: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
  },
  sectionOptional: {
    ...typography.presets.caption,
    color: colors.textMuted,
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
    ...typography.presets.label,
    color: colors.textMain,
  },
  fieldOptional: {
    ...typography.presets.caption,
    color: colors.textMuted,
    marginLeft: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
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
  inputWithIcon: {
    marginLeft: 4,
  },
  placeholder: {
    color: colors.textMuted,
  },
  fieldRequired: {
    ...typography.presets.caption,
    color: colors.textMuted,
  },
  optionalField: {
    gap: 4,
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
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    height: 50,
  },
  primaryButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textOnBrand,
  },
  supportingText: {
    ...typography.presets.caption,
    color: colors.textMuted,
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.bgSurface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetTitle: {
    ...typography.presets.h4,
    color: colors.textMain,
  },
  sheetClose: {
    ...typography.presets.bodySmall,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  sheetContent: {
    paddingBottom: 34,
  },
  sheetOption: {
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetOptionActive: {
    backgroundColor: colors.primaryLight,
  },
  sheetOptionText: {
    ...typography.presets.bodySmall,
    color: colors.textMain,
  },
  sheetOptionTextActive: {
    color: colors.primary,
  },
});
