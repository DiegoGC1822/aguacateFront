import {
  View,
  Text,
  Image,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { router } from "expo-router";
import { useState } from "react";
import { useRegisterForm } from "../../presentation/viewmodel/useRegisterForm";
import { RuleRow } from "../../presentation/components/RuleRow";
import { RulesPanel } from "../../presentation/components/RulesPanel";
import AppModal from "../../presentation/components/AppModal";
import { isAppError, APP_ERROR_TITLES } from "../../domain/errors";
import KeyboardAvoidingScreen from "../../presentation/components/KeyboardAvoidingScreen";

export default function RegisterScreen() {
  const {
    email, setEmail,
    password, setPassword,
    password2, setPassword2,
    firstName, setFirstName,
    lastName, setLastName,
    validation,
    submit,
  } = useRegisterForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [password2Focused, setPassword2Focused] = useState(false);
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);

  const [modal, setModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({ visible: false, title: "", message: "" });

  const showErrorModal = (title: string, message: string) =>
    setModal({ visible: true, title, message });

  const handleRegister = async () => {
    try {
      await submit();
      router.push("/login");
    } catch (error: any) {
      if (isAppError(error)) {
        showErrorModal(APP_ERROR_TITLES[error.type], error.message);
      } else {
        showErrorModal("Error", "Ha ocurrido un error inesperado al registrarse.");
      }
    }
  };

  return (
    <>
      <KeyboardAvoidingScreen>
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

            {/* Email */}
            <TextInput
              testID="input-email"
              placeholder="Email"
              placeholderTextColor="#888"
              left={<TextInput.Icon icon="email" color="#2c7a2c" />}
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              outlineColor="#ccc"
              activeOutlineColor="#2c7a2c"
              textColor="black"
              style={{ marginBottom: 4, borderRadius: 5, backgroundColor: "white" }}
            />
            {(emailFocused) && (
              <RulesPanel>
                <RuleRow ok={validation.email.hasValidFormat} label="Formato de email válido" />
              </RulesPanel>
            )}

            {/* Password */}
            <TextInput
              testID="input-password"
              placeholder="Contraseña"
              placeholderTextColor="#888"
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon="lock" color="#2c7a2c" />}
              mode="outlined"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              outlineColor="#ccc"
              activeOutlineColor="#2c7a2c"
              textColor="black"
              style={{ marginBottom: 4, borderRadius: 5, backgroundColor: "white" }}
              right={
                <TextInput.Icon
                  color="gray"
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            {(passwordFocused) && (
              <RulesPanel>
                <RuleRow ok={validation.password.hasMinLength} label="Mínimo 8 caracteres" />
                <RuleRow ok={validation.password.hasUppercase} label="Al menos una mayúscula" />
                <RuleRow ok={validation.password.hasNumber} label="Al menos un número" />
              </RulesPanel>
            )}

            {/* Confirmar Password */}
            <TextInput
              testID="input-password2"
              placeholder="Confirmar Contraseña"
              placeholderTextColor="#888"
              secureTextEntry={!showPassword2}
              left={<TextInput.Icon icon="lock" color="#2c7a2c" />}
              mode="outlined"
              value={password2}
              onChangeText={setPassword2}
              onFocus={() => setPassword2Focused(true)}
              onBlur={() => setPassword2Focused(false)}
              outlineColor="#ccc"
              activeOutlineColor="#2c7a2c"
              textColor="black"
              style={{ marginBottom: 4, borderRadius: 5, backgroundColor: "white" }}
              right={
                <TextInput.Icon
                  color="gray"
                  icon={showPassword2 ? "eye-off" : "eye"}
                  onPress={() => setShowPassword2(!showPassword2)}
                />
              }
            />
            {(password2Focused) && (
              <RulesPanel>
                <RuleRow ok={validation.password.passwordsMatch} label="Las contraseñas coinciden" />
              </RulesPanel>
            )}

            {/* Nombre */}
            <TextInput
              testID="input-firstname"
              placeholder="Nombre"
              placeholderTextColor="#888"
              left={<TextInput.Icon icon="account" color="#2c7a2c" />}
              mode="outlined"
              value={firstName}
              onChangeText={setFirstName}
              onFocus={() => setFirstNameFocused(true)}
              onBlur={() => setFirstNameFocused(false)}
              outlineColor="#ccc"
              activeOutlineColor="#2c7a2c"
              textColor="black"
              style={{ marginBottom: 4, borderRadius: 5, backgroundColor: "white" }}
            />
            {(firstNameFocused) && (
              <RulesPanel>
                <RuleRow ok={validation.firstName.hasMinLength} label="Minimo 4 caracteres" />
              </RulesPanel>
            )}

            {/* Apellido */}
            <TextInput
              testID="input-lastname"
              placeholder="Apellido"
              placeholderTextColor="#888"
              left={<TextInput.Icon icon="account" color="#2c7a2c" />}
              mode="outlined"
              value={lastName}
              onChangeText={setLastName}
              onFocus={() => setLastNameFocused(true)}
              onBlur={() => setLastNameFocused(false)}
              outlineColor="#ccc"
              activeOutlineColor="#2c7a2c"
              textColor="black"
              style={{ marginBottom: 4, borderRadius: 5, backgroundColor: "white" }}
            />
            {(lastNameFocused) && (
              <RulesPanel>
                <RuleRow ok={validation.lastName.hasMinLength} label="Minimo 4 caracteres" />
              </RulesPanel>
            )}

            <Button
              testID="btn-register"
              mode="contained"
              style={{
                backgroundColor: "#2c7a2c",
                marginTop: 10,
                paddingVertical: 3,
              }}
              onPress={handleRegister}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Regístrate</Text>
            </Button>

            <Text style={{ marginTop: 10, textAlign: "center", color: "black" }}>
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