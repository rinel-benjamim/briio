import { useEffect, useState, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated, Easing } from "react-native";

const LOGO = require("@/assets/images/splash-logo.png");

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [opacity] = useState(new Animated.Value(0));
  const [logoScale] = useState(new Animated.Value(0.8));
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();

    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, []);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.brandGroup}>
        <Animated.View
          style={[
            styles.logoWrapper,
            { opacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <Image source={LOGO} style={styles.logo} resizeMode="cover" />
          <Text style={styles.brand}>Briio</Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.tagline}>
          <Text style={styles.taglineMain}>Relatórios de obra simplificados</Text>
          <Text style={styles.taglineSub}>Angola &amp; Portugal</Text>
        </View>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: barWidth }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15221D",
    paddingBottom: 34,
    justifyContent: "space-between",
  },
  brandGroup: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoWrapper: {
    alignItems: "center",
    gap: 24,
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
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 12,
    alignItems: "center",
    gap: 20,
  },
  tagline: {
    alignItems: "center",
    gap: 6,
  },
  taglineMain: {
    fontFamily: "Sora",
    fontWeight: "600",
    fontSize: 14,
    color: "#DDF5E9",
    textAlign: "center",
    opacity: 0.8,
  },
  taglineSub: {
    fontFamily: "Sora",
    fontWeight: "400",
    fontSize: 11,
    color: "#DDF5E9",
    textAlign: "center",
    opacity: 0.4,
  },
  progressBar: {
    width: "100%",
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 1.5,
    backgroundColor: "#176B50",
  },
});
