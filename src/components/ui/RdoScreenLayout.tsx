import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography } from "@/constants/typography";
import { ScreenHeader } from "./ScreenHeader";
import { AutosaveStatus } from "./AutosaveStatus";
import { ProgressBadge } from "./ProgressBadge";
import { PrimaryButton } from "./PrimaryButton";

interface RdoScreenLayoutProps {
  title: string;
  progress?: { current: number; total: number };
  onBack?: () => void;
  continueLabel?: string;
  onContinue?: () => void;
  continueDisabled?: boolean;
  showAutosave?: boolean;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}

export function RdoScreenLayout({
  title,
  progress,
  onBack,
  continueLabel = "Continuar",
  onContinue,
  continueDisabled = false,
  showAutosave = true,
  rightSlot,
  children,
}: RdoScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bgSurface }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.header, { backgroundColor: colors.bgSurface, borderBottomColor: colors.border }]}>
          <ScreenHeader
            title={title}
            onBack={onBack}
            rightSlot={
              rightSlot ??
              (progress ? (
                <ProgressBadge
                  current={progress.current}
                  total={progress.total}
                />
              ) : undefined)
            }
          />
        </View>

        <ScrollView
          style={[styles.scrollView, { backgroundColor: colors.bgMain }]}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        {onContinue && (
          <View
            style={[
              styles.footer,
              { backgroundColor: colors.bgSurface, borderTopColor: colors.border, paddingBottom: insets.bottom + 12 },
            ]}
          >
            {showAutosave && <AutosaveStatus />}
            <PrimaryButton
              label={continueLabel}
              onPress={onContinue}
              disabled={continueDisabled}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 20,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 8,
  },
});
