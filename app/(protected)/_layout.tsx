import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../presentation/viewmodel/useAuth";
import { ActivityIndicator, View } from "react-native";
import LeftSidebar from "../../presentation/components/LeftSideBar";

export default function ProtectedLayout() {
  const { isAuthenticated, isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />

      <LeftSidebar />
    </View>
  );
}
