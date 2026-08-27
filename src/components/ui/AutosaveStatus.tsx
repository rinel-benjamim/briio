import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ShieldCheck, Loader, AlertCircle } from "lucide-react-native";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography } from "@/constants";

type AutosaveState = "idle" | "saving" | "saved" | "error";

interface AutosaveIndicatorProps {
  state: AutosaveState;
}

export function AutosaveIndicator({ state }: AutosaveIndicatorProps) {
  const colors = useThemeColors();

  if (state === "idle") return null;

  return (
    <View style={styles.container}>
      {state === "saving" && (
        <>
          <Loader size={14} color={colors.textMuted} />
          <Text style={[styles.text, { color: colors.textMuted }]}>A guardar...</Text>
        </>
      )}
      {state === "saved" && (
        <>
          <ShieldCheck size={14} color={colors.success} />
          <Text style={[styles.text, { color: colors.success }]}>Guardado</Text>
        </>
      )}
      {state === "error" && (
        <>
          <AlertCircle size={14} color={colors.error} />
          <Text style={[styles.text, { color: colors.error }]}>Erro ao guardar</Text>
        </>
      )}
    </View>
  );
}

export function AutosaveStatus() {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <ShieldCheck size={17} color={colors.textMuted} />
      <Text style={[styles.text, { color: colors.textMuted }]}>Os dados ficam guardados automaticamente.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  text: {
    ...typography.presets.caption,
  },
});
