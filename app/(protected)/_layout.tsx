import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../presentation/viewmodel/useAuth";
import { ActivityIndicator, View } from "react-native";
import LeftSidebar from "../../presentation/components/LeftSideBar";
import { SafeAreaView } from "react-native-safe-area-context";

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
      <SafeAreaView style={{ flex: 1, backgroundColor: "#d7f4d7" }} edges={["top", "bottom"]}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>

      <LeftSidebar />
    </View>
  );
}
