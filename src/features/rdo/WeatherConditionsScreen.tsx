import { useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Sun, Cloud, CloudRain } from "lucide-react-native";
import { colors, typography } from "@/constants";

import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { RdoScreenLayout } from "@/components/ui/RdoScreenLayout";

const MOCK_CONTEXT = {
  date: "12 Agosto 2026",
  projectName: "Reabilitação Pedrinhas",
};

type WeatherOption = "sol" | "nublado" | "chuva";

interface WeatherPeriodProps {
  label: string;
  selected: WeatherOption | null;
  onSelect: (option: WeatherOption) => void;
}

function WeatherPeriod({ label, selected, onSelect }: WeatherPeriodProps) {
  return (
    <View style={styles.periodSection}>
      <Text style={styles.periodLabel}>{label}</Text>
      <View style={styles.periodOptions}>
        <PressableOpacity
          style={[styles.weatherOption, selected === "sol" && styles.weatherOptionSelected]}
          onPress={() => onSelect("sol")}
        >
          <Sun
            size={25}
            color={selected === "sol" ? colors.textOnBrand : colors.inactiveIcon}
          />
          <Text
            style={[
              styles.weatherOptionText,
              selected === "sol" && styles.weatherOptionTextSelected,
            ]}
          >
            Sol
          </Text>
        </PressableOpacity>

        <PressableOpacity
          style={[styles.weatherOption, selected === "nublado" && styles.weatherOptionSelected]}
          onPress={() => onSelect("nublado")}
        >
          <Cloud
            size={25}
            color={selected === "nublado" ? colors.textOnBrand : colors.inactiveIcon}
          />
          <Text
            style={[
              styles.weatherOptionText,
              selected === "nublado" && styles.weatherOptionTextSelected,
            ]}
          >
            Nublado
          </Text>
        </PressableOpacity>

        <PressableOpacity
          style={[styles.weatherOption, selected === "chuva" && styles.weatherOptionSelected]}
          onPress={() => onSelect("chuva")}
        >
          <CloudRain
            size={25}
            color={selected === "chuva" ? colors.textOnBrand : colors.inactiveIcon}
          />
          <Text
            style={[
              styles.weatherOptionText,
              selected === "chuva" && styles.weatherOptionTextSelected,
            ]}
          >
            Chuva
          </Text>
        </PressableOpacity>
      </View>
    </View>
  );
}

export default function WeatherConditionsScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const [step] = useState(1);
  const totalSteps = 9;
  const fromReview = from === "review";

  const [morning, setMorning] = useState<WeatherOption | null>("sol");
  const [afternoon, setAfternoon] = useState<WeatherOption | null>("chuva");
  const [night, setNight] = useState<WeatherOption | null>(null);
  const [observation, setObservation] = useState("");

  return (
    <RdoScreenLayout
      title="Condições do dia"
      progress={{ current: step, total: totalSteps }}
      onBack={() => router.back()}
      continueLabel="Guardar e continuar"
      onContinue={() => {
        if (fromReview) {
          router.push(`/(tabs)/reports/${id}/review`);
        } else {
          router.push(`/(tabs)/reports/${id}/workforce`);
        }
      }}
    >
      {/* Context line */}
      <View style={styles.context}>
        <Text style={styles.contextText}>
          {MOCK_CONTEXT.date} · {MOCK_CONTEXT.projectName}
        </Text>
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Como esteve o tempo hoje?</Text>
        <Text style={styles.subtitle}>
          Selecione uma condição por período.
        </Text>
      </View>

      {/* Weather periods */}
      <WeatherPeriod label="Manhã" selected={morning} onSelect={setMorning} />
      <WeatherPeriod label="Tarde" selected={afternoon} onSelect={setAfternoon} />
      <WeatherPeriod label="Noite" selected={night} onSelect={setNight} />

      {/* Observation */}
      <View style={styles.observationSection}>
        <TextInput
          style={styles.obsInput}
          value={observation}
          onChangeText={setObservation}
          placeholder="Adicionar observação meteorológica (opcional)"
          placeholderTextColor={colors.textMuted}
          multiline
          textAlignVertical="top"
        />
      </View>
    </RdoScreenLayout>
  );
}

const styles = StyleSheet.create({
  context: {
    gap: 2,
  },
  contextText: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  titleSection: {
    gap: 6,
  },
  mainTitle: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "400",
    fontFamily: typography.fontFamily,
    color: colors.textMain,
  },
  subtitle: {
    ...typography.presets.body,
    color: colors.textMuted,
  },
  periodSection: {
    gap: 10,
  },
  periodLabel: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMain,
  },
  periodOptions: {
    flexDirection: "row",
    gap: 8,
  },
  weatherOption: {
    flex: 1,
    height: 92,
    borderRadius: 16,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  weatherOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  weatherOptionText: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.inactiveIcon,
  },
  weatherOptionTextSelected: {
    color: colors.textOnBrand,
    fontWeight: typography.fontWeight.bold,
  },
  observationSection: {
    gap: 8,
  },
  obsInput: {
    height: 72,
    backgroundColor: colors.bgSurface,
    borderRadius: 16,
    padding: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...typography.presets.bodySmall,
    color: colors.textMain,
  },
});
