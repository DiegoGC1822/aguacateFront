import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { router } from "expo-router";
import { useState } from "react";
import { useAuth } from "../../store/useAuth";
import { Image } from "react-native";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const { register } = useAuth();

  const handleRegister = async () => {
    try {
      await register(email, password, password2, firstName, lastName);
      router.push("/login");
    } catch (error) {
      alert("Error al registrarse. Por favor, intenta de nuevo.");
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
            <Image
              source={require("../../assets/logo.png")}
              style={{ width: 280, height: 50 }}
            />
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
              Regístrate
            </Text>
            <TextInput
              placeholder="Email"
              placeholderTextColor="black"
              left={<TextInput.Icon icon="email" color="black" />}
              mode="outlined"
              onChangeText={setEmail}
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
              secureTextEntry={!showPassword}
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
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            <TextInput
              placeholder="Confirmar Contraseña"
              placeholderTextColor="black"
              secureTextEntry={!showPassword2}
              left={<TextInput.Icon icon="lock" color="black" />}
              mode="outlined"
              onChangeText={setPassword2}
              outlineColor="#ccc"
              activeOutlineColor="#2c7a2c"
              textColor="black"
              style={{
                marginBottom: 10,
                borderRadius: 5,
                backgroundColor: "white",
              }}
              right={
                <TextInput.Icon
                  icon={showPassword2 ? "eye-off" : "eye"}
                  onPress={() => setShowPassword2(!showPassword2)}
                />
              }
            />
            <TextInput
              placeholder="Nombre"
              placeholderTextColor="black"
              left={<TextInput.Icon icon="account" color="black" />}
              mode="outlined"
              onChangeText={setFirstName}
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
              placeholder="Apellido"
              placeholderTextColor="black"
              left={<TextInput.Icon icon="account" color="black" />}
              mode="outlined"
              onChangeText={setLastName}
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
              onPress={handleRegister}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Regístrate
              </Text>
            </Button>
            <Text
              style={{ marginTop: 10, textAlign: "center", color: "black" }}
            >
              ¿Ya tienes una cuenta?{" "}
              <Text
                style={{ color: "#2c7a2c", fontWeight: "bold" }}
                onPress={() => router.push("/login")}
              >
                Inicia Sesión
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
