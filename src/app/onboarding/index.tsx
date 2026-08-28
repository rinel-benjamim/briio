import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { ArrowRightCircle } from "lucide-react-native";

const LOGO = require("@/assets/images/splash-logo.png");

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoArea}>
        <View style={styles.brandGroup}>
          <Image source={LOGO} style={styles.logo} resizeMode="cover" />
          <Text style={styles.brand}>Briio</Text>
        </View>
      </View>

      <View style={styles.actionArea}>
        <Pressable
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          onPress={() => router.push("/onboarding/step1")}
          accessibilityLabel="Começar"
          accessibilityRole="button"
        >
          <Text style={styles.btnText}>Começar</Text>
          <ArrowRightCircle size={18} color="#FFFFFF" strokeWidth={2} />
        </Pressable>

        <Text style={styles.version}>v1.0.0 · Briio Angola</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15221D",
    paddingBottom: 48,
    justifyContent: "space-between",
  },
  logoArea: {
    paddingHorizontal: 32,
    justifyContent: "center",
    alignItems: "stretch",
    flex: 1,
  },
  brandGroup: {
    alignItems: "center",
    gap: 24,
    paddingTop: 120,
  },
  logo: {
    width: 165,
    height: 165,
    borderRadius: 33,
  },
  brand: {
    fontFamily: "Sora",
    fontWeight: "800",
    fontSize: 44,
    color: "#FFFFFF",
    textAlign: "center",
  },
  actionArea: {
    paddingHorizontal: 24,
    alignItems: "stretch",
    gap: 20,
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
  btnPressed: {
    opacity: 0.85,
  },
  btnText: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: 15,
    color: "#FFFFFF",
  },
  version: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 12,
    color: "#687770",
    textAlign: "center",
    opacity: 0.6,
  },
});
