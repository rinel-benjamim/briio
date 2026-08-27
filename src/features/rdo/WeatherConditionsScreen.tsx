import { useState, useEffect } from "react";
import { View, Text, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Sun, Cloud, CloudRain } from "lucide-react-native";
import { typography } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";

import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { RdoScreenLayout } from "@/components/ui/RdoScreenLayout";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useRdo } from "@/contexts/RdoContext";
import { useWeatherRepository } from "@/repositories/weather.repository";
import { useRdoOverview } from "@/hooks/useRdoData";
import { useProjectRepository } from "@/repositories/project.repository";

import type { ThemeColors } from "@/contexts/ThemeContext";
import type { WeatherCondition, WeatherPeriod } from "@/types";

type WeatherOption = "sunny" | "cloudy" | "rain";

interface WeatherPeriodProps {
  label: string;
  selected: WeatherOption | null;
  onSelect: (option: WeatherOption) => void;
  colors: ThemeColors;
  styles: Record<string, any>;
}

function WeatherPeriod({ label, selected, onSelect, colors, styles }: WeatherPeriodProps) {
  return (
    <View style={styles.periodSection}>
      <Text style={styles.periodLabel}>{label}</Text>
      <View style={styles.periodOptions}>
        <PressableOpacity
          style={[styles.weatherOption, selected === "sunny" && styles.weatherOptionSelected]}
          onPress={() => onSelect("sunny")}
        >
          <Sun
            size={25}
            color={selected === "sunny" ? colors.textOnBrand : colors.inactiveIcon}
          />
          <Text
            style={[
              styles.weatherOptionText,
              selected === "sunny" && styles.weatherOptionTextSelected,
            ]}
          >
            Sol
          </Text>
        </PressableOpacity>

        <PressableOpacity
          style={[styles.weatherOption, selected === "cloudy" && styles.weatherOptionSelected]}
          onPress={() => onSelect("cloudy")}
        >
          <Cloud
            size={25}
            color={selected === "cloudy" ? colors.textOnBrand : colors.inactiveIcon}
          />
          <Text
            style={[
              styles.weatherOptionText,
              selected === "cloudy" && styles.weatherOptionTextSelected,
            ]}
          >
            Nublado
          </Text>
        </PressableOpacity>

        <PressableOpacity
          style={[styles.weatherOption, selected === "rain" && styles.weatherOptionSelected]}
          onPress={() => onSelect("rain")}
        >
          <CloudRain
            size={25}
            color={selected === "rain" ? colors.textOnBrand : colors.inactiveIcon}
          />
          <Text
            style={[
              styles.weatherOptionText,
              selected === "rain" && styles.weatherOptionTextSelected,
            ]}
          >
            Chuva
          </Text>
        </PressableOpacity>
      </View>
    </View>
  );
}

function formatReportDate(isoDate: string): string {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const d = new Date(isoDate + "T00:00:00");
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function WeatherConditionsScreen() {
  const colors = useThemeColors();
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const fromReview = from === "review";
  const { date, projectName } = useRdo();
  const { overview, loading: overviewLoading } = useRdoOverview(id ?? null);
  const weatherRepo = useWeatherRepository();

  const [step] = useState(1);
  const totalSteps = 9;

  const [morning, setMorning] = useState<WeatherOption | null>(null);
  const [afternoon, setAfternoon] = useState<WeatherOption | null>(null);
  const [night, setNight] = useState<WeatherOption | null>(null);
  const [observation, setObservation] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!id || loaded) return;
    weatherRepo.findByRdoId(id).then((conditions) => {
      for (const c of conditions) {
        const option = c.condition as WeatherOption | null;
        if (c.period === "morning") setMorning(option);
        if (c.period === "afternoon") setAfternoon(option);
        if (c.period === "night") setNight(option);
        if (c.notes) setObservation(c.notes);
      }
      setLoaded(true);
    });
  }, [id, loaded]);

  useEffect(() => {
    if (!loaded || !id) return;
    const save = async () => {
      if (morning) await weatherRepo.upsert(id, "morning" as WeatherPeriod, morning as WeatherCondition, null);
      if (afternoon) await weatherRepo.upsert(id, "afternoon" as WeatherPeriod, afternoon as WeatherCondition, null);
      if (night) await weatherRepo.upsert(id, "night" as WeatherPeriod, night as WeatherCondition, null);
    };
    save();
  }, [morning, afternoon, night, loaded]);

  const styles = useThemedStyles((colors) => ({
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
  }));

  if (overviewLoading || !loaded) return <LoadingScreen />;

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
      <View style={styles.context}>
        <Text style={styles.contextText}>
          {date} · {projectName}
        </Text>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Como esteve o tempo hoje?</Text>
        <Text style={styles.subtitle}>
          Selecione uma condição por período.
        </Text>
      </View>

      <WeatherPeriod label="Manhã" selected={morning} onSelect={setMorning} colors={colors} styles={styles} />
      <WeatherPeriod label="Tarde" selected={afternoon} onSelect={setAfternoon} colors={colors} styles={styles} />
      <WeatherPeriod label="Noite" selected={night} onSelect={setNight} colors={colors} styles={styles} />

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
