import {
  View,
  Text,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { router } from "expo-router";
import { useState } from "react";
import { useAuth } from "../../presentation/viewmodel/useAuth";
import { Image } from "react-native";
import AppModal from "../../presentation/components/AppModal";
import { isAppError, APP_ERROR_TITLES } from "../../domain/errors";
import KeyboardAvoidingScreen from "../../presentation/components/KeyboardAvoidingScreen";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const [modal, setModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({ visible: false, title: "", message: "" });

  const showErrorModal = (title: string, message: string) =>
    setModal({ visible: true, title, message });

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.push("/home");
    } catch (error: any) {
      if (isAppError(error)) {
        showErrorModal(APP_ERROR_TITLES[error.type], error.message);
      } else {
        showErrorModal("Error", "Ha ocurrido un error inesperado al iniciar sesión.");
      }
    }
  };

  return (
    <>
      <KeyboardAvoidingScreen>
        <View
          style={{
            width: "80%",
            height: 500,
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
              gap: 10,
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
              Inicia Sesión
            </Text>
            <TextInput
              placeholder="Email"
              placeholderTextColor="black"
              left={<TextInput.Icon icon="email" color="#2c7a2c" />}
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
              left={<TextInput.Icon icon="lock" color="#2c7a2c" />}
              mode="outlined"
              onChangeText={setPassword}
              outlineColor="#ccc"
              activeOutlineColor="#2c7a2c"
              textColor="black"
              right={
                <TextInput.Icon
                  color="gray"
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
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
            <Text
              style={{ marginTop: 10, textAlign: "center", color: "black" }}
            >
              ¿No tienes una cuenta?{" "}
              <Text
                style={{ color: "#2c7a2c", fontWeight: "bold" }}
                onPress={() => router.push("/register")}
              >
                Regístrate
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingScreen>

      <AppModal
        visible={modal.visible}
        type="error"
        title={modal.title}
        message={modal.message}
        onDismiss={() => setModal((prev) => ({ ...prev, visible: false }))}
      />
    </>
  );
}
