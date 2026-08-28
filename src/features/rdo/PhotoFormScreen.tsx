import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { CirclePlus, Camera, Image as ImageIcon } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { typography, borderRadius } from "@/constants";
import { useThemeColors } from "@/contexts/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ContextBar } from "@/components/ui/ContextBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { AutosaveStatus } from "@/components/ui/AutosaveStatus";
import { Field } from "@/components/ui/Form/Field";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useRdo } from "@/contexts/RdoContext";
import { usePhotographRepository } from "@/repositories/photograph.repository";
import type { PhotographType } from "@/types";

const PHOTO_TYPES = [
  { label: "Execução", value: "during" as PhotographType },
  { label: "Antes", value: "before" as PhotographType },
  { label: "Depois", value: "after" as PhotographType },
];

interface PhotoFormProps {
  mode: "add" | "edit";
  currentStep?: number;
  totalSteps?: number;
}

export function PhotoForm({ mode, currentStep = 8, totalSteps = 9 }: PhotoFormProps) {
  const colors = useThemeColors();
  const { id, photoId } = useLocalSearchParams<{ id: string; photoId?: string }>();
  const { date, projectName } = useRdo();
  const photographRepo = usePhotographRepository();

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [photoType, setPhotoType] = useState<PhotographType>("during");
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode === "edit" && photoId) {
      photographRepo.findById(photoId).then((entry) => {
        if (entry) {
          setPhotoUri(entry.file_uri);
          setCaption(entry.caption ?? "");
          setLocation(entry.location ?? "");
          if (entry.type) setPhotoType(entry.type);
        }
        setLoading(false);
      });
    }
  }, [mode, photoId]);

  const styles = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      backgroundColor: colors.bgMain,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 24,
      paddingTop: 8,
      gap: 18,
    },
    stepBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: borderRadius.full,
      backgroundColor: colors.progressTrack,
    },
    stepBadgeText: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    },
    photoArea: {
      flexDirection: "row",
      justifyContent: "center",
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.xl,
      borderWidth: 1.5,
      borderColor: colors.border,
      padding: 12,
      gap: 12,
      height: 140,
      alignItems: "center",
    },
    photoButton: {
      width: 140,
      height: 110,
      backgroundColor: colors.primaryLight,
      borderRadius: borderRadius.lg,
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },
    photoButtonText: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMain,
      textAlign: "center",
    },
    previewSection: {
      gap: 8,
    },
    previewImage: {
      width: "100%",
      aspectRatio: 1,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.border,
    },
    changePhotoText: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.primary,
      textAlign: "center",
    },
    section: {
      gap: 7,
    },
    sectionLabel: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: typography.fontWeight.bold,
      fontFamily: typography.fontFamily,
      color: colors.textMain,
    },
    typeRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    typeOption: {
      paddingHorizontal: 14,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primaryLight,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    typeOptionSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    typeOptionText: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
    typeOptionTextSelected: {
      color: colors.textOnBrand,
    },
    saveReassurance: {
      alignItems: "flex-start",
    },
    buttonSection: {
      gap: 10,
    },
    cancelButton: {
      alignItems: "center",
      justifyContent: "center",
      height: 48,
    },
    cancelText: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: typography.fontWeight.regular,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    },
  }));

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Precisamos de permissão para aceder à câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const stepBadge = (
    <View style={styles.stepBadge}>
      <Text style={styles.stepBadgeText}>
        {currentStep} de {totalSteps}
      </Text>
    </View>
  );

  async function handleSave() {
    if (!id) return;

    if (mode === "add") {
      if (!photoUri) return;
      await photographRepo.create(id, {
        file_uri: photoUri,
        caption: caption || undefined,
        location: location || undefined,
        type: photoType,
      });
    } else if (photoId) {
      await photographRepo.update(photoId, {
        caption: caption || undefined,
        location: location || undefined,
        type: photoType,
      });
    }
    router.back();
  }

  if (loading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={mode === "add" ? "Adicionar fotografia" : "Editar fotografia"}
        onBack={() => router.back()}
        rightSlot={stepBadge}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ContextBar date={date} projectName={projectName} />

        {!photoUri ? (
          <View style={styles.photoArea}>
            <PressableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Camera size={28} color={colors.primary} />
              <Text style={styles.photoButtonText}>Tirar fotografia</Text>
            </PressableOpacity>
            <PressableOpacity style={styles.photoButton} onPress={pickImage}>
              <ImageIcon size={28} color={colors.primary} />
              <Text style={styles.photoButtonText}>Escolher da galeria</Text>
            </PressableOpacity>
          </View>
        ) : (
          <View style={styles.previewSection}>
            <Image source={{ uri: photoUri }} style={styles.previewImage} />
            <PressableOpacity onPress={() => setPhotoUri(null)}>
              <Text style={styles.changePhotoText}>Alterar fotografia</Text>
            </PressableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Field
            label="Legenda"
            value={caption}
            onChangeText={setCaption}
            placeholder="Ex.: Armadura para os pilares."
          />

          <Field
            label="Local / frente de trabalho"
            value={location}
            onChangeText={setLocation}
            placeholder="Ex.: Bloco A — Piso 2"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tipo</Text>
          <View style={styles.typeRow}>
            {PHOTO_TYPES.map((type) => (
              <PressableOpacity
                key={type.value}
                style={[
                  styles.typeOption,
                  photoType === type.value && styles.typeOptionSelected,
                ]}
                onPress={() => setPhotoType(type.value)}
              >
                <Text
                  style={[
                    styles.typeOptionText,
                    photoType === type.value && styles.typeOptionTextSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </PressableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.saveReassurance}>
          <AutosaveStatus />
        </View>

        <View style={styles.buttonSection}>
          <PrimaryButton
            label={mode === "add" ? "Adicionar fotografia" : "Guardar alterações"}
            onPress={handleSave}
            icon={<CirclePlus size={18} color={colors.textOnBrand} />}
          />
          <PressableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Cancelar"
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </PressableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
