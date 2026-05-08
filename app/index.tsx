import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#d7f4d7",
      }}
    >
      <Text
        variant="displayMedium"
        style={{
          fontWeight: "bold",
          marginBottom: 10,
          color: "black",
          textAlign: "center",
        }}
      >
        ¡Bienvenido, sebas!
      </Text>
      <Text
        variant="headlineLarge"
        style={{ color: "gray", marginBottom: 20, textAlign: "center" }}
      >
        ¿Qué Prefieres hacer hoy?
      </Text>
      <Button
        mode="contained"
        onPress={() => router.push("/addImage")}
        style={{ backgroundColor: "#37c534", marginBottom: 10, width: "80%" }}
        icon={() => <Ionicons name="camera" size={20} color="black" />}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Analizar una Imagen
        </Text>
      </Button>
      <Button
        mode="contained"
        onPress={() => router.push("/history")}
        style={{
          backgroundColor: "white",
          borderColor: "black",
          borderWidth: 1,
          width: "80%",
          marginBottom: 10,
        }}
        icon={() => <Ionicons name="list" size={20} color="black" />}
      >
        <Text style={{ color: "black", fontWeight: "bold" }}>
          Ver Historial
        </Text>
      </Button>
      <Button
        mode="contained"
        onPress={() => router.push("/report")}
        style={{
          backgroundColor: "#7f34c5",
          width: "80%",
          marginBottom: 10,
        }}
        icon={() => <Ionicons name="document-text" size={20} color="black" />}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Ver Reporte</Text>
      </Button>
      <Button
        mode="contained"
        onPress={() => router.push("/login")}
        style={{
          backgroundColor: "#f72c1e",
          width: "80%",
        }}
        icon={() => <Ionicons name="log-out" size={20} color="black" />}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Cerrar sesión
        </Text>
      </Button>
    </View>
  );
}
