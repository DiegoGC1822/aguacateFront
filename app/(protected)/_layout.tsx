import { Stack, Redirect } from "expo-router";

import { useAuth } from "../../store/useAuth";
import { ActivityIndicator, View } from "react-native";
import LeftSidebar from "../../components/LeftSideBar";

export default function ProtectedLayout() {
  const { isAuthenticated, isHydrated } = useAuth();

  console.log("Authenticated:", isAuthenticated);
  console.log("Is Hydrated:", isHydrated);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />

      <LeftSidebar />
    </View>
  );
}
