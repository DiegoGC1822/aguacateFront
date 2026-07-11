import { Redirect, Slot } from "expo-router";
import { useAuth } from "../../presentation/viewmodel/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  const { isAuthenticated, isHydrated } = useAuth();

  if (!isHydrated) return null;

  if (isAuthenticated) {
    return <Redirect href="/(protected)/home" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d7f4d7" }} edges={["top", "bottom"]}>
      <Slot />
    </SafeAreaView>
  );
}
