import { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera, Image as ImageIcon } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { colors, typography } from "@/constants";
import { PressableOpacity } from "@/components/ui/PressableOpacity";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ContextBar } from "@/components/ui/ContextBar";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { AutosaveStatus } from "@/components/ui/AutosaveStatus";
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
  const insets = useSafeAreaInsets();

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
              <Camera size={28} color={colors.brandPrimary} />
              <Text style={styles.photoButtonText}>Tirar fotografia</Text>
            </PressableOpacity>
            <PressableOpacity style={styles.photoButton} onPress={pickImage}>
              <ImageIcon size={28} color={colors.brandPrimary} />
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

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Legenda</Text>
            <TextInput
              style={styles.textInput}
              value={caption}
              onChangeText={setCaption}
              placeholder="Ex.: Armadura para os pilares."
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Local / frente de trabalho</Text>
            <TextInput
              style={styles.textInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Ex.: Bloco A — Piso 2"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
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
    backgroundColor: colors.surfaceBg,
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
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(148, 163, 184, 0.1)",
    padding: 12,
    gap: 12,
    height: 140,
    alignItems: "center",
  },
  photoButton: {
    width: 140,
    height: 110,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  photoButtonText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    textAlign: "center",
  },
  previewSection: {
    gap: 8,
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
  },
  changePhotoText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.brandPrimary,
    textAlign: "center",
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    ...typography.presets.overline,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  textInput: {
    height: 48,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    ...typography.presets.body,
    color: colors.textPrimary,
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
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  typeOptionSelected: {
    backgroundColor: colors.brandPrimary,
    borderColor: colors.brandPrimary,
  },
  typeOptionText: {
    ...typography.presets.caption,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  typeOptionTextSelected: {
    color: colors.textPrimary,
  },
  buttonSection: {
    gap: 12,
  },
});
