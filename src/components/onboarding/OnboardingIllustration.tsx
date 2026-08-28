import { useEffect, useState } from "react";
import { View, Image, ImageSourcePropType, StyleSheet, ActivityIndicator } from "react-native";

interface Props {
  source: ImageSourcePropType;
  style?: object;
}

export default function OnboardingIllustration({ source, style }: Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = Image.resolveAssetSource(source);
    if (!img) return;

    Image.prefetch(img.uri)
      .then(() => setLoaded(true))
      .catch(() => setLoaded(true));
  }, [source]);

  if (!loaded) {
    return (
      <View style={[styles.placeholder, style]}>
        <ActivityIndicator size="large" color="#DDE5E1" />
      </View>
    );
  }

  return (
    <Image source={source} style={[styles.image, style]} resizeMode="cover" />
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
