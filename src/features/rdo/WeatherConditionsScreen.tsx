import { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Sun,
  Cloud,
  CloudRain,
  ArrowRight,
  Check,
} from "lucide-react-native";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

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
            color={selected === "sol" ? colors.textPrimary : colors.textTertiary}
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
            color={selected === "nublado" ? colors.textPrimary : colors.textTertiary}
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
            color={selected === "chuva" ? colors.textPrimary : colors.textTertiary}
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
  const insets = useSafeAreaInsets();
  const [step] = useState(1);
  const totalSteps = 9;
  const fromReview = from === "review";

  const [morning, setMorning] = useState<WeatherOption | null>("sol");
  const [afternoon, setAfternoon] = useState<WeatherOption | null>("chuva");
  const [night, setNight] = useState<WeatherOption | null>(null);
  const [observation, setObservation] = useState("");

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.textPrimary} />
        </PressableOpacity>
        <Text style={styles.navTitle}>Condições do dia</Text>
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
            placeholderTextColor={colors.textSecondary}
            multiline
            textAlignVertical="top"
          />
        </View>

        <PressableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (fromReview) {
              router.push(`/(tabs)/reports/${id}/review`);
            } else {
              router.push(`/(tabs)/reports/${id}/workforce`);
            }
          }}
        >
          <Text style={styles.primaryButtonText}>Continuar</Text>
          <ArrowRight size={18} color={colors.textOnBrand} />
        </PressableOpacity>

        <View style={styles.autosaveStatus}>
          <Check size={14} color={colors.textTertiary} />
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
    color: colors.textPrimary,
  },
  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: "#E5E7EB",
    gap: 4,
    borderWidth: 1,
    borderColor: "#404040",
  },
  progressText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: "#94A3B8",
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
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  contextProject: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  titleSection: {
    gap: 6,
  },
  mainTitle: {
    ...typography.presets.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.presets.body,
    color: colors.textSecondary,
  },
  periodSection: {
    gap: 10,
  },
  periodLabel: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  periodOptions: {
    flexDirection: "row",
    gap: 10,
  },
  weatherOption: {
    flex: 1,
    height: 80,
    borderRadius: 14,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  weatherOptionSelected: {
    backgroundColor: colors.brandPrimary,
    borderColor: "#1B3A5C",
  },
  weatherOptionText: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  weatherOptionTextSelected: {
    color: colors.textPrimary,
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
    color: colors.textSecondary,
  },
  obsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: "#FFFFFF",
  },
  obsBadgeText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: "#94A3B8",
  },
  obsInput: {
    height: 80,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
    ...typography.presets.body,
    color: colors.textPrimary,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandPrimary,
    borderRadius: borderRadius.xl,
    height: 56,
    gap: 8,
  },
  primaryButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textOnBrand,
  },
  autosaveStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  autosaveText: {
    ...typography.presets.caption,
    color: colors.textSecondary,
  },
});
