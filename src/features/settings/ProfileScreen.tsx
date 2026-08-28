import { View, ScrollView, Text, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { User, Briefcase, Building2, Phone, Mail } from "lucide-react-native";
import { useState, useEffect } from "react";
import { useThemeColors } from "@/contexts/ThemeContext";
import { typography, borderRadius } from "@/constants";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useProfile } from "@/hooks/useProfile";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Field } from "@/components/ui/Form/Field";
import { TextArea } from "@/components/ui/Form/TextArea";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { profile, save } = useProfile();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setRole(profile.role ?? "");
      setCompany(profile.company ?? "");
      setPhone(profile.phone ?? "");
      setEmail(profile.email ?? "");
    }
  }, [profile]);

  const styles = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      backgroundColor: colors.bgMain,
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 24,
      paddingTop: 8,
      gap: 20,
    },
    section: {
      backgroundColor: colors.bgSurface,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      gap: 16,
    },
    sectionTitle: {
      ...typography.presets.bodyMedium,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textMain,
      gap: 8,
      flexDirection: "row",
      alignItems: "center",
    },
  }));

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "O nome é obrigatório.");
      return;
    }
    await save({ name: name.trim(), role: role.trim(), company: company.trim(), phone: phone.trim(), email: email.trim() });
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <ScreenHeader title="Perfil" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <User size={16} color={colors.primary} /> Informações pessoais
          </Text>
          <Field label="Nome" value={name} onChangeText={setName} placeholder="Seu nome completo" />
          <Field label="Cargo" value={role} onChangeText={setRole} placeholder="Engenheiro(a) civil" />
          <Field label="Empresa" value={company} onChangeText={setCompany} placeholder="Nome da empresa" />
          <Field label="Telefone" value={phone} onChangeText={setPhone} placeholder="+244 900 000 000" keyboardType="phone-pad" />
          <Field label="Email" value={email} onChangeText={setEmail} placeholder="email@exemplo.com" keyboardType="email-address" autoCapitalize="none" />
        </View>

        <PrimaryButton label="Guardar" onPress={handleSave} />
      </ScrollView>
    </View>
  );
}
