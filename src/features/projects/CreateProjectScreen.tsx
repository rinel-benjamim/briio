import { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  Platform,
} from "react-native";
import { router } from "expo-router";
import {
  ArrowRight,
  ChevronDown,
  Calendar,
} from "lucide-react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { colors, typography, borderRadius } from "@/constants";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
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

export default function CreateProjectScreen() {
  const stepBadge = (
    <View style={styles.stepBadge}>
      <Text style={styles.stepBadgeText}>1 de 2</Text>
    </View>
  );

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
      <ScreenHeader
        title="Nova obra"
        onBack={() => router.back()}
        rightSlot={stepBadge}
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
              />
            </View>
            <View style={styles.fieldHalf}>
              <DateField
                label="Previsão de conclusão"
                value={endDate}
                placeholder="Selecionar data"
                optional
                onChange={setEndDate}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Pressable
            style={styles.sectionHeaderRow}
            onPress={() => setEntidadesExpanded(!entidadesExpanded)}
          >
            <Text style={styles.sectionTitle}>Entidades</Text>
            <ChevronDown
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

        <PrimaryButton
          label="Continuar"
          onPress={() => router.push(`/(tabs)/projects/1/configure-rdo`)}
          icon={<ArrowRight size={18} color={colors.textOnBrand} />}
        />

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
    transform: [{ rotate: "180deg" }],
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
  supportingText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: typography.fontWeight.regular,
    fontFamily: typography.fontFamily,
    color: colors.textMuted,
    textAlign: "center",
  },
});
