import { useState, useCallback } from "react";
import { View, Text, Image, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useFocusEffect } from "expo-router";
import { Camera, X } from "lucide-react-native";
import { typography } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { RdoScreenLayout } from "@/components/ui/RdoScreenLayout";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useRdo } from "@/contexts/RdoContext";
import { usePhotographRepository } from "@/repositories/photograph.repository";
import type { Photograph } from "@/types";

export default function PhotosScreen() {
  const colors = useThemeColors();
  const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
  const { date, projectName } = useRdo();
  const photographRepo = usePhotographRepository();
  const [step] = useState(8);
  const totalSteps = 9;
  const [photos, setPhotos] = useState<Photograph[]>([]);
  const fromReview = from === "review";
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      photographRepo.findByRdoId(id).then((data) => {
        setPhotos(data);
        setLoading(false);
      });
    }, [id])
  );

  const removePhoto = async (photoId: string) => {
    Alert.alert("Remover fotografia", "Tem a certeza que deseja remover?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          await photographRepo.remove(photoId);
          setPhotos((prev) => prev.filter((p) => p.id !== photoId));
        },
      },
    ]);
  };

  const handleContinue = () => {
    if (fromReview) {
      router.push(`/(tabs)/reports/${id}/review`);
    } else {
      router.push(`/(tabs)/reports/${id}`);
    }
  };

  const styles = useThemedStyles((colors) => ({
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
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 32,
      gap: 8,
    },
    emptyText: {
      ...typography.presets.body,
      color: colors.textMuted,
      textAlign: "center",
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
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    },
    photoItem: {
      aspectRatio: 1,
      backgroundColor: colors.bgSurface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    photoImage: {
      width: "100%",
      height: "100%",
    },
    photoCaptionBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    photoCaption: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: "#FFFFFF",
    },
    photoTypeBadge: {
      position: "absolute",
      top: 8,
      left: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 9999,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    photoTypeText: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: "#FFFFFF",
      fontSize: 10,
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
  }));

  if (loading) return <LoadingScreen />;

  const PHOTO_TYPE_LABELS: Record<string, string> = {
    before: "Antes",
    during: "Execução",
    after: "Depois",
  };

  const rows: Photograph[][] = [];
  for (let i = 0; i < photos.length; i += 2) {
    rows.push(photos.slice(i, i + 2));
  }

  return (
    <RdoScreenLayout
      title="Fotografias"
      progress={{ current: step, total: totalSteps }}
      onBack={() => router.back()}
      onContinue={handleContinue}
    >
      <View style={styles.context}>
        <Text style={styles.contextDate}>{date}</Text>
        <Text style={styles.contextProject}>{projectName}</Text>
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

      {photos.length === 0 ? (
        <View style={styles.emptyState}>
          <Camera size={32} color={colors.textMuted} />
          <Text style={styles.emptyText}>
            Nenhuma fotografia adicionada.{"\n"}Toque no botão abaixo para adicionar.
          </Text>
        </View>
      ) : (
        <View style={styles.photoGrid}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.photoRow}>
              {row.map((photo) => (
                <View key={photo.id} style={styles.photoItemContainer}>
                  <PressableOpacity
                    style={styles.removeButton}
                    onPress={() => removePhoto(photo.id)}
                  >
                    <X size={14} color="#FFFFFF" />
                  </PressableOpacity>
                  {photo.type && (
                    <View style={styles.photoTypeBadge}>
                      <Text style={styles.photoTypeText}>
                        {PHOTO_TYPE_LABELS[photo.type] ?? photo.type}
                      </Text>
                    </View>
                  )}
                  <PressableOpacity
                    style={styles.photoItem}
                    onPress={() =>
                      router.push(`/(tabs)/reports/${id}/edit-photo?photoId=${photo.id}`)
                    }
                  >
                    {photo.file_uri ? (
                      <Image source={{ uri: photo.file_uri }} style={styles.photoImage} resizeMode="cover" />
                    ) : null}
                    {photo.caption ? (
                      <View style={styles.photoCaptionBar}>
                        <Text style={styles.photoCaption} numberOfLines={2}>
                          {photo.caption}
                        </Text>
                      </View>
                    ) : null}
                  </PressableOpacity>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

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
