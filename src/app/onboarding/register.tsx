import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeftCircle, ArrowRightCircle, ChevronDown, ShieldCheck } from "lucide-react-native";
import { useProfileRepository } from "@/repositories/profile.repository";
import { useSettingsRepository } from "@/repositories/settings.repository";

export default function RegisterScreen() {
  const router = useRouter();
  const profileRepo = useProfileRepository();
  const settingsRepo = useSettingsRepository();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const canSubmit = name.trim().length > 0;

  async function handleFinish() {
    if (!canSubmit || saving) return;
    setSaving(true);
    try {
      await profileRepo.upsert({
        name: name.trim(),
        role: role.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      await settingsRepo.set("onboarding_completed", "true");
      router.replace("/(tabs)");
    } catch {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.topBar}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityLabel="Voltar"
        >
          <ArrowLeftCircle size={22} color="#13201C" strokeWidth={2} />
        </Pressable>
        <Text style={styles.topBarTitle}>Criar Perfil</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContent}>
          <View style={styles.intro}>
            <Text style={styles.heading}>Configure o seu perfil</Text>
            <Text style={styles.description}>
              Estes dados serão apresentados no cabeçalho dos seus relatórios de obra (RDO).
            </Text>
          </View>

          <View style={styles.inputsBlock}>
            <View style={styles.field}>
              <Text style={styles.label}>Nome completo</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Ex: Ana Rodrigues"
                  placeholderTextColor="#687770"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Cargo</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={role}
                  onChangeText={setRole}
                  placeholder="Mestre de Obras"
                  placeholderTextColor="#687770"
                  autoCapitalize="words"
                />
                <ChevronDown size={18} color="#687770" strokeWidth={2} />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Empresa</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={company}
                  onChangeText={setCompany}
                  placeholder="Ex: Briio Engenharia Lda."
                  placeholderTextColor="#687770"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Telefone</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+244 923 000 000"
                  placeholderTextColor="#687770"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.saveReassurance}>
          <ShieldCheck size={17} color="#687770" strokeWidth={2} />
          <Text style={styles.reassuranceText}>
            Pode alterar estes dados mais tarde nas definições.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.btn,
            (!canSubmit || saving) && styles.btnDisabled,
            pressed && styles.btnPressed,
          ]}
          onPress={handleFinish}
          disabled={!canSubmit || saving}
          accessibilityLabel="Guardar e continuar"
          accessibilityRole="button"
        >
          <Text style={styles.btnText}>
            {saving ? "A guardar..." : "Guardar e continuar"}
          </Text>
          <ArrowRightCircle size={18} color="#FFFFFF" strokeWidth={2} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F6",
    paddingBottom: 32,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    alignSelf: "stretch",
    paddingHorizontal: 20,
    height: 58,
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    width: 22,
    height: 22,
  },
  topBarTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 17,
    color: "#13201C",
  },
  scroll: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 20,
  },
  intro: {
    gap: 4,
  },
  heading: {
    fontFamily: "Inter",
    fontWeight: "800",
    fontSize: 24,
    color: "#13201C",
  },
  description: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 14,
    color: "#687770",
  },
  inputsBlock: {
    gap: 16,
  },
  field: {
    gap: 7,
  },
  label: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: 14,
    color: "#13201C",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDE5E1",
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 14,
    color: "#13201C",
    height: "100%",
  },
  footer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  saveReassurance: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reassuranceText: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 13,
    color: "#687770",
    flex: 1,
  },
  btn: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    height: 56,
    backgroundColor: "#176B50",
    borderRadius: 16,
    shadowColor: "#102019",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnPressed: {
    opacity: 0.85,
  },
  btnText: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 15,
    color: "#FFFFFF",
  },
});
