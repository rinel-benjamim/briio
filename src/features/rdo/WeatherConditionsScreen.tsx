import { useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Sun, Cloud, CloudRain } from "lucide-react-native";
import { colors, typography, shadows } from "@/constants";
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
            size={22}
            color={selected === "sol" ? colors.textOnBrand : colors.textMuted}
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
            size={22}
            color={selected === "nublado" ? colors.textOnBrand : colors.textMuted}
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
            size={22}
            color={selected === "chuva" ? colors.textOnBrand : colors.textMuted}
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
      onContinue={() => {
        if (fromReview) {
          router.push(`/(tabs)/reports/${id}/review`);
        } else {
          router.push(`/(tabs)/reports/${id}/workforce`);
        }
      }}
    >
      <View style={styles.context}>
        <Text style={styles.contextDate}>{MOCK_CONTEXT.date}</Text>
        <Text style={styles.contextProject}>{MOCK_CONTEXT.projectName}</Text>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Como esteve o tempo hoje?</Text>
        <Text style={styles.subtitle}>
          Registe as condições observadas em cada período.
        </Text>
      </View>

      <WeatherPeriod label="Manhã" selected={morning} onSelect={setMorning} />
      <WeatherPeriod label="Tarde" selected={afternoon} onSelect={setAfternoon} />
      <WeatherPeriod label="Noite" selected={night} onSelect={setNight} />

      <View style={styles.observationSection}>
        <View style={styles.obsHeader}>
          <Text style={styles.obsLabel}>Observação meteorológica</Text>
          <View style={styles.obsBadge}>
            <Text style={styles.obsBadgeText}>Opcional</Text>
          </View>
        </View>
        <TextInput
          style={styles.obsInput}
          value={observation}
          onChangeText={setObservation}
          placeholder="Ex.: chuva intensa durante aproximadamente 1 hora..."
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
  contextDate: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  contextProject: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  titleSection: {
    gap: 6,
  },
  mainTitle: {
    ...typography.presets.h2,
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
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMain,
  },
  periodOptions: {
    flexDirection: "row",
    gap: 10,
  },
  weatherOption: {
    flex: 1,
    height: 80,
    borderRadius: 14,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  weatherOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  weatherOptionText: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  weatherOptionTextSelected: {
    color: colors.textOnBrand,
    fontWeight: typography.fontWeight.semibold,
  },
  observationSection: {
    gap: 8,
  },
  obsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  obsLabel: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  obsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: colors.primaryLight,
  },
  obsBadgeText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary,
  },
  obsInput: {
    height: 80,
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...typography.presets.body,
    color: colors.textMain,
  },
});
