import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useAuth } from "../../presentation/viewmodel/useAuth";
import { useEffect } from "react";

export default function HomeScreen() {
  const { profile, getProfile, isHydrated } = useAuth();

  useEffect(() => {
    if (isHydrated) {
      getProfile();
    }
  }, [isHydrated]);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2c7a2c" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#d7f4d7",
        paddingLeft: 80,
      }}
    >
      <Text variant="displayMedium" style={{ fontWeight: "bold" }}>
        ¡Bienvenido, {profile?.first_name}!
      </Text>

      <Text variant="headlineLarge" style={{ color: "gray" }}>
        ¿Qué Prefieres hacer hoy?
      </Text>
    </View>
  );
}
