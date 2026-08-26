import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Fixed Header */}
        <View style={styles.header}>
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

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        {/* Fixed Footer */}
        {onContinue && (
          <View
            style={[
              styles.footer,
              { paddingBottom: insets.bottom + 12 },
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
    backgroundColor: colors.bgSurface,
  },
  flex: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.bgMain,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 20,
  },
  footer: {
    backgroundColor: colors.bgSurface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 8,
  },
});
