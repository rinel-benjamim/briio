import { useState } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Info } from "lucide-react-native";
import { colors, typography } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { RdoScreenLayout } from "@/components/ui/RdoScreenLayout";

const MOCK_CONTEXT = {
  date: "12 Agosto 2026",
  projectName: "Reabilitação Pedrinhas",
};

const QUICK_SUGGESTIONS = [
  "Trabalhos decorreram normalmente",
  "Sem alterações relevantes",
  "Trabalhos dentro do previsto",
];

const MAX_CHARS = 1000;

export default function ObservationsScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const [step] = useState(7);
  const totalSteps = 9;
  const fromReview = from === "review";

  const [observation, setObservation] = useState("");

  const handleSuggestionPress = (suggestion: string) => {
    if (observation.length === 0) {
      setObservation(suggestion);
    } else {
      setObservation(`${observation}\n${suggestion}`);
    }
  };

  const handleContinue = () => {
    if (fromReview) {
      router.push(`/(tabs)/reports/${id}/review`);
    } else {
      router.push(`/(tabs)/reports/${id}/photos`);
    }
  };

  return (
    <RdoScreenLayout
      title="Observações"
      progress={{ current: step, total: totalSteps }}
      onBack={() => router.back()}
      onContinue={handleContinue}
    >
      <View style={styles.context}>
        <Text style={styles.contextDate}>{MOCK_CONTEXT.date}</Text>
        <Text style={styles.contextProject}>{MOCK_CONTEXT.projectName}</Text>
      </View>

      <View style={styles.titleSection}>
        <View style={styles.mainTitle}>
          <Text style={styles.mainTitleText}>Observações do dia</Text>
          <View style={styles.optionalBadge}>
            <Text style={styles.optionalText}>Opcional</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Registe qualquer informação adicional que considere relevante para o
          relatório.
        </Text>
      </View>

      <View style={styles.suggestionsSection}>
        <Text style={styles.suggestionsLabel}>SUGESTÕES RÁPIDAS</Text>
        <View style={styles.chipRow}>
          {QUICK_SUGGESTIONS.slice(0, 2).map((suggestion) => (
            <PressableOpacity
              key={suggestion}
              style={styles.chip}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Text style={styles.chipText}>{suggestion}</Text>
            </PressableOpacity>
          ))}
        </View>
        <View style={styles.chipRow}>
          <PressableOpacity
            style={styles.chip}
            onPress={() => handleSuggestionPress(QUICK_SUGGESTIONS[2])}
          >
            <Text style={styles.chipText}>{QUICK_SUGGESTIONS[2]}</Text>
          </PressableOpacity>
        </View>
      </View>

      <View style={styles.textFieldContainer}>
        <TextInput
          style={styles.textField}
          value={observation}
          onChangeText={(text) => {
            if (text.length <= MAX_CHARS) {
              setObservation(text);
            }
          }}
          placeholder="Ex.: Os trabalhos decorreram normalmente. A equipa iniciou a execução da alvenaria no bloco B..."
          placeholderTextColor={colors.textMuted}
          multiline
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>
          {observation.length} / {MAX_CHARS}
        </Text>
      </View>

      <View style={styles.emptyHint}>
        <Info size={14} color={colors.textMuted} />
        <Text style={styles.emptyHintText}>
          Nenhuma observação adicionada. Pode continuar sem preencher este
          campo.
        </Text>
      </View>
    </RdoScreenLayout>
  );
}

const styles = StyleSheet.create({
  context: {
    gap: 2,
  },
  contextDate: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  contextProject: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  titleSection: {
    gap: 6,
  },
  mainTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mainTitleText: {
    ...typography.presets.h1,
    color: colors.textMain,
  },
  optionalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionalText: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
  },
  subtitle: {
    ...typography.presets.body,
    color: colors.textMuted,
  },
  suggestionsSection: {
    gap: 10,
  },
  suggestionsLabel: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  textFieldContainer: {
    backgroundColor: colors.bgSurface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  textField: {
    height: 200,
    padding: 16,
    ...typography.presets.body,
    color: colors.textMain,
  },
  charCount: {
    position: "absolute",
    bottom: 12,
    right: 16,
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
  },
  emptyHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  emptyHintText: {
    ...typography.presets.caption,
    color: colors.textMuted,
    textAlign: "center",
  },
});
