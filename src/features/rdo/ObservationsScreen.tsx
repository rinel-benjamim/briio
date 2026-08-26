import { useState } from "react";
import { View, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, ArrowRight, Check, Info } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

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
  const insets = useSafeAreaInsets();
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

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity
          style={styles.navButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.textPrimary} />
        </PressableOpacity>
        <Text style={styles.navTitle}>Observações</Text>
        <View style={styles.progressIndicator}>
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
          <Text style={styles.contextProject}>
            {MOCK_CONTEXT.projectName}
          </Text>
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
            placeholderTextColor={colors.textSecondary}
            multiline
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>
            {observation.length} / {MAX_CHARS}
          </Text>
        </View>

        <View style={styles.emptyHint}>
          <Info size={14} color="#9CA3AF" />
          <Text style={styles.emptyHintText}>
            Nenhuma observação adicionada. Pode continuar sem preencher este
            campo.
          </Text>
        </View>

        <PressableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (fromReview) {
              router.push(`/(tabs)/reports/${id}/review`);
            } else {
              router.push(`/(tabs)/reports/${id}/photos`);
            }
          }}
        >
          <Text style={styles.primaryButtonText}>Continuar</Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </PressableOpacity>

        <View style={styles.autosaveStatus}>
          <Check size={14} color="#9CA3AF" />
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
    paddingHorizontal: 16,
    paddingBottom: 12,
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
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  progressIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: "#E5E7EB",
    borderWidth: 1,
    borderColor: "#404040",
  },
  progressText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 20,
  },
  context: {
    gap: 2,
  },
  contextDate: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  contextProject: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
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
    ...typography.presets.heading1,
    color: colors.textPrimary,
  },
  optionalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    backgroundColor: "#FFFFFF",
  },
  optionalText: {
    ...typography.presets.overline,
    color: colors.textSecondary,
  },
  subtitle: {
    ...typography.presets.body,
    color: colors.textSecondary,
  },
  suggestionsSection: {
    gap: 10,
  },
  suggestionsLabel: {
    ...typography.presets.overline,
    color: colors.textSecondary,
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
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  chipText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  textFieldContainer: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
    overflow: "hidden",
  },
  textField: {
    height: 200,
    padding: 16,
    ...typography.presets.body,
    color: colors.textPrimary,
  },
  charCount: {
    position: "absolute",
    bottom: 12,
    right: 16,
    ...typography.presets.overline,
    color: colors.textSecondary,
  },
  emptyHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  emptyHintText: {
    ...typography.presets.caption,
    color: colors.textSecondary,
    textAlign: "center",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandPrimary,
    borderRadius: 16,
    height: 56,
    gap: 8,
  },
  primaryButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: "#FFFFFF",
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
