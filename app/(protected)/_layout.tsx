import { Stack } from "expo-router";

import { View } from "react-native";
import LeftSidebar from "../../presentation/components/LeftSideBar";

export default function ProtectedLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />

      <LeftSidebar />
    </View>
  );
}
