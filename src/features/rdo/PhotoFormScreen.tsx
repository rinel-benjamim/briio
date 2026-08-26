import { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Camera, Image as ImageIcon } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { colors, typography, borderRadius } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ContextBar } from "@/components/ui/ContextBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { AutosaveStatus } from "@/components/ui/AutosaveStatus";
import { Field } from "@/components/ui/Form/Field";
import {
  MOCK_RDO_CONTEXT,
  PHOTO_TYPES,
  MOCK_PHOTOS_DATA,
} from "@/mocks";
import type { PhotoType } from "@/mocks";

interface PhotoFormProps {
  mode: "add" | "edit";
}

export function PhotoForm({ mode }: PhotoFormProps) {
  const { id, photoId } = useLocalSearchParams<{ id: string; photoId?: string }>();

  const editData = mode === "edit" ? MOCK_PHOTOS_DATA[photoId || "1"] : null;

  const [photoUri, setPhotoUri] = useState<string | null>(editData?.uri || null);
  const [caption, setCaption] = useState(editData?.caption || "");
  const [location, setLocation] = useState(editData?.location || "");
  const [photoType, setPhotoType] = useState<PhotoType>(editData?.type || "execucao");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
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
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={mode === "add" ? "Adicionar fotografia" : "Editar fotografia"}
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ContextBar date={MOCK_RDO_CONTEXT.date} projectName={MOCK_RDO_CONTEXT.projectName} />

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
          <Text style={styles.sectionLabel}>IDENTIFICAÇÃO DA FOTOGRAFIA</Text>

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
          <Text style={styles.sectionLabel}>TIPO</Text>
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

        <View style={styles.buttonSection}>
          <PrimaryButton
            label={mode === "add" ? "Adicionar fotografia" : "Guardar alterações"}
            onPress={() => router.back()}
          />
          <SecondaryButton label="Cancelar" onPress={() => router.back()} />
        </View>

        <AutosaveStatus />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    gap: 20,
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
    height: 180,
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
    gap: 12,
  },
  sectionLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textMuted,
    letterSpacing: 0.5,
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
  buttonSection: {
    gap: 12,
  },
});
