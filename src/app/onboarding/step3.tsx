import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ArrowRightCircle } from "lucide-react-native";
import OnboardingIllustration from "@/components/onboarding/OnboardingIllustration";

const IMG = require("@/assets/images/onboarding-img3.png");

export default function OnboardingStep3() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.placeholder} />
        <View style={styles.placeholder} />
      </View>

      <View style={styles.contentBody}>
        <View style={styles.imageCard}>
          <OnboardingIllustration source={IMG} />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.title}>Gere PDF em segundos</Text>
          <Text style={styles.description}>
            Exporte relatórios profissionais em PDF prontos para partilhar com a sua equipa.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.pageDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dotActive} />
        </View>

        <Pressable
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          onPress={() => router.push("/onboarding/register")}
          accessibilityLabel="Começar agora"
          accessibilityRole="button"
        >
          <Text style={styles.btnText}>Começar agora</Text>
          <ArrowRightCircle size={18} color="#FFFFFF" strokeWidth={2} />
        </Pressable>
      </View>
    </View>
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
    paddingHorizontal: 24,
    paddingTop: 12,
    justifyContent: "space-between",
  },
  placeholder: {
    width: 32,
    height: 8,
  },
  contentBody: {
    alignSelf: "stretch",
    paddingHorizontal: 24,
    gap: 24,
  },
  imageCard: {
    alignSelf: "stretch",
    height: 320,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  textBlock: {
    alignSelf: "stretch",
    gap: 12,
  },
  title: {
    fontFamily: "Inter",
    fontWeight: "800",
    fontSize: 24,
    color: "#13201C",
    width: "100%",
  },
  description: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: 15,
    color: "#687770",
    lineHeight: 21,
    width: "100%",
  },
  footer: {
    alignSelf: "stretch",
    paddingHorizontal: 24,
    gap: 20,
  },
  pageDots: {
    flexDirection: "row",
    alignSelf: "stretch",
    padding: 12,
    justifyContent: "center",
    gap: 8,
  },
  dotActive: {
    width: 24,
    height: 8,
    borderRadius: 100,
    backgroundColor: "#176B50",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 100,
    backgroundColor: "#DDE5E1",
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
});
