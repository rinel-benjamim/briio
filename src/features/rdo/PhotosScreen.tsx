import { useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Camera, ArrowRight, Check, X } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { typography } from "@/constants/typography";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

const MOCK_CONTEXT = {
  date: "12 Agosto 2026",
  projectName: "Reabilitação Pedrinhas",
};

type PhotoItem = {
  id: string;
  caption: string;
};

const INITIAL_PHOTOS: PhotoItem[] = [
  { id: "1", caption: "Frente — Bloco A" },
  { id: "2", caption: "Alvenaria — Piso 2" },
  { id: "3", caption: "Revestimento — Piso 1" },
  { id: "4", caption: "Área comum" },
  { id: "5", caption: "Equipamentos no local" },
  { id: "6", caption: "Estado geral da obra" },
];

export default function PhotosScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const insets = useSafeAreaInsets();
  const [step] = useState(8);
  const totalSteps = 9;
  const [photos, setPhotos] = useState<PhotoItem[]>(INITIAL_PHOTOS);
  const fromReview = from === "review";

  const removePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
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
        <Text style={styles.navTitle}>Fotografias</Text>
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

        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryLabel}>Fotografias</Text>
            <Text style={styles.summaryValue}>
              {photos.length} fotografias
            </Text>
          </View>
          <View style={styles.summaryRight}>
            <Text style={styles.summarySubLabel}>Adicionadas</Text>
            <Text style={styles.summarySubValue}>hoje</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>FOTOGRAFIAS REGISTADAS</Text>

        <View style={styles.photoGrid}>
          {[0, 2, 4].map((rowStart) => (
            <View key={rowStart} style={styles.photoRow}>
              {photos.slice(rowStart, rowStart + 2).map((photo) => (
                <View key={photo.id} style={styles.photoItemContainer}>
                  <PressableOpacity
                    style={styles.removeButton}
                    onPress={() => removePhoto(photo.id)}
                  >
                    <X size={14} color="#FFFFFF" />
                  </PressableOpacity>
                  <PressableOpacity
                    style={styles.photoItem}
                    onPress={() =>
                      router.push(`/(tabs)/reports/${id}/edit-photo?photoId=${photo.id}`)
                    }
                  >
                    <Text style={styles.photoCaption}>{photo.caption}</Text>
                  </PressableOpacity>
                </View>
              ))}
            </View>
          ))}
        </View>

        <PressableOpacity
          style={styles.addButton}
          onPress={() => router.push(`/(tabs)/reports/${id}/add-photo`)}
        >
          <Camera size={18} color={colors.brandPrimary} />
          <Text style={styles.addButtonText}>Adicionar fotografia</Text>
        </PressableOpacity>

        <PressableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (fromReview) {
              router.push(`/(tabs)/reports/${id}/review`);
            } else {
              router.push(`/(tabs)/reports/${id}`);
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
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    padding: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  summaryLeft: {
    gap: 4,
  },
  summaryLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.presets.heading2,
    color: colors.textPrimary,
  },
  summaryRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  summarySubLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  summarySubValue: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  sectionLabel: {
    ...typography.presets.overline,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  photoGrid: {
    gap: 8,
  },
  photoRow: {
    flexDirection: "row",
    gap: 8,
  },
  photoItemContainer: {
    flex: 1,
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  photoItem: {
    height: 140,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    justifyContent: "flex-end",
    padding: 8,
    paddingHorizontal: 10,
    overflow: "hidden",
  },
  photoCaption: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: "#FFFFFF",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    height: 56,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  addButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.brandPrimary,
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
