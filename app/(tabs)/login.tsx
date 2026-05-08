import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, Button } from "react-native-paper";
import { router } from "expo-router";
import { useState } from "react";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "sebas" && password === "123") {
      router.push("/");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#d7f4d7" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "80%",
            backgroundColor: "white",
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <View
            style={{
              backgroundColor: "#2c7a2c",
              paddingVertical: 40,
              alignItems: "center",
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: "#d7f4d7",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Ionicons name="leaf" size={32} color="#2c7a2c" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
              AguacateAI
            </Text>
            <Text style={{ color: "white" }}>Detección de enfermedades</Text>
          </View>

          {/* formulario */}
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginVertical: 20,
                color: "black",
              }}
            >
              Inicia Sesión
            </Text>
            <TextInput
              placeholder="Nombre de usuario"
              placeholderTextColor="black"
              left={<TextInput.Icon icon="email" color="black" />}
              mode="outlined"
              onChangeText={setUsername}
              outlineColor="#ccc"
              activeOutlineColor="#2c7a2c"
              textColor="black"
              style={{
                marginBottom: 10,
                borderRadius: 5,
                backgroundColor: "white",
              }}
            />
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="black"
              secureTextEntry
              left={<TextInput.Icon icon="lock" color="black" />}
              mode="outlined"
              onChangeText={setPassword}
              outlineColor="#ccc"
              activeOutlineColor="#2c7a2c"
              textColor="black"
              style={{
                marginBottom: 10,
                borderRadius: 5,
                backgroundColor: "white",
              }}
            />
            <Button
              mode="contained"
              style={{
                backgroundColor: "#2c7a2c",
                marginTop: 10,
                paddingVertical: 3,
              }}
              onPress={handleLogin}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Iniciar Sesión
              </Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
