import { View } from "react-native";
import { Text } from "react-native-paper";

export default function HomeScreen() {
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
        ¡Bienvenido, Freddy!
      </Text>

      <Text variant="headlineLarge" style={{ color: "gray" }}>
        ¿Qué Prefieres hacer hoy?
      </Text>
    </View>
  );
}
