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
import { ArrowLeft, Camera, Image as ImageIcon, Check } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography } from "@/constants/typography";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { PressableOpacity } from "@/components/ui/PressableOpacity";

const MOCK_CONTEXT = {
  date: "12 Agosto 2026",
  projectName: "Reabilitação Pedrinhas",
};

type PhotoType = "execucao" | "material" | "equipamento" | "estado_obra" | "outro";

const PHOTO_TYPES: { value: PhotoType; label: string }[] = [
  { value: "execucao", label: "Execução" },
  { value: "material", label: "Material" },
  { value: "equipamento", label: "Equipamento" },
  { value: "estado_obra", label: "Estado da obra" },
  { value: "outro", label: "Outro" },
];

export default function AddPhotoScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [step] = useState(8);
  const totalSteps = 9;

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [photoType, setPhotoType] = useState<PhotoType>("execucao");

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

  const styles = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      backgroundColor: colors.bgSurface,
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
      color: colors.textMain,
      flex: 1,
    },
    progressText: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
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
      color: colors.textMuted,
    },
    contextProject: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
    photoArea: {
      flexDirection: "row",
      justifyContent: "center",
      backgroundColor: colors.bgSurface,
      borderRadius: 16,
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
      backgroundColor: colors.bgSurface,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },
    photoButtonText: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.textOnBrand,
      textAlign: "center",
    },
    previewSection: {
      gap: 8,
    },
    previewImage: {
      width: "100%",
      height: 180,
      borderRadius: 12,
      backgroundColor: colors.border,
    },
    changePhotoText: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
      textAlign: "center",
    },
    section: {
      gap: 12,
    },
    sectionLabel: {
      ...typography.presets.caption,
      color: colors.textMuted,
      letterSpacing: 0.5,
    },
    field: {
      gap: 8,
    },
    fieldLabel: {
      ...typography.presets.caption,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMain,
    },
    textInput: {
      height: 48,
      backgroundColor: colors.bgSurface,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.border,
      ...typography.presets.body,
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
      backgroundColor: colors.bgSurface,
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
    primaryButton: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderRadius: 24,
      height: 48,
    },
    primaryButtonText: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textOnBrand,
    },
    secondaryButton: {
      alignItems: "center",
      justifyContent: "center",
      height: 44,
    },
    secondaryButtonText: {
      ...typography.presets.body,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    },
    autosaveStatus: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },
    autosaveText: {
      ...typography.presets.caption,
      color: colors.textMuted,
    },
  }));

  return (
    <View style={styles.container}>
      <View style={[styles.topNav, { paddingTop: insets.top + 8 }]}>
        <PressableOpacity
          style={styles.navButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.textMain} />
        </PressableOpacity>
        <Text style={styles.navTitle}>Adicionar fotografia</Text>
        <Text style={styles.progressText}>
          {step} de {totalSteps}
        </Text>
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

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Legenda</Text>
            <TextInput
              style={styles.textInput}
              value={caption}
              onChangeText={setCaption}
              placeholder="Ex.: Armadura para os pilares."
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Local / frente de trabalho</Text>
            <TextInput
              style={styles.textInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Ex.: Bloco A — Piso 2"
              placeholderTextColor={colors.textMuted}
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
          <PressableOpacity
            style={styles.primaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>Adicionar fotografia</Text>
          </PressableOpacity>
          <PressableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </PressableOpacity>
        </View>

        <View style={styles.autosaveStatus}>
          <Check size={14} color={colors.textMuted} />
          <Text style={styles.autosaveText}>Salvo automaticamente</Text>
        </View>
      </ScrollView>
    </View>
  );
}
