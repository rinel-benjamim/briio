import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Camera, X } from "lucide-react-native";
import { colors, typography } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { RdoScreenLayout } from "@/components/ui/RdoScreenLayout";

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
  const colors = useThemeColors();
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const [step] = useState(8);
  const totalSteps = 9;
  const [photos, setPhotos] = useState<PhotoItem[]>(INITIAL_PHOTOS);
  const fromReview = from === "review";

  const removePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const handleContinue = () => {
    if (fromReview) {
      router.push(`/(tabs)/reports/${id}/review`);
    } else {
      router.push(`/(tabs)/reports/${id}`);
    }
  };

  return (
    <RdoScreenLayout
      title="Fotografias"
      progress={{ current: step, total: totalSteps }}
      onBack={() => router.back()}
      onContinue={handleContinue}
    >
      <View style={styles.context}>
        <Text style={styles.contextDate}>{MOCK_CONTEXT.date}</Text>
        <Text style={styles.contextProject}>{MOCK_CONTEXT.projectName}</Text>
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
                  <X size={14} color={colors.textOnBrand} />
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
        <Camera size={20} color={colors.primary} />
        <Text style={styles.addButtonText}>Adicionar fotografia</Text>
      </PressableOpacity>
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
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.bgSurface,
    borderRadius: 16,
    padding: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryLeft: {
    gap: 4,
  },
  summaryLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  summaryValue: {
    ...typography.presets.h2,
    color: colors.textMain,
  },
  summaryRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  summarySubLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  summarySubValue: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMain,
  },
  sectionLabel: {
    ...typography.presets.bodySmall,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
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
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  photoItem: {
    height: 140,
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "flex-end",
    padding: 8,
    paddingHorizontal: 10,
    overflow: "hidden",
  },
  photoCaption: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMain,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgSurface,
    borderRadius: 16,
    height: 56,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addButtonText: {
    ...typography.presets.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
});
