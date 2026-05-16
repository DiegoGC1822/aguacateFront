import { Stack, Redirect } from "expo-router";

import { useAuth } from "../../store/useAuth";
import { View } from "react-native";
import LeftSidebar from "../../components/LeftSideBar";

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  console.log("Authenticated:", isAuthenticated);

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
