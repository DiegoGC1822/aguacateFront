import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { View } from "react-native";
import LeftSidebar from "../components/LeftSideBar";

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}
