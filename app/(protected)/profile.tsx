import { TextInput, Button, Text } from "react-native-paper";
import { useState } from "react";
import { View } from "react-native";
import { useAuth } from "../../presentation/viewmodel/useAuth";
import { RuleRow } from "../../presentation/components/RuleRow";
import { RulesPanel } from "../../presentation/components/RulesPanel";
import { useUploadProfile } from "../../presentation/viewmodel/useUploadProfile";
import { useUploadPassword } from "../../presentation/viewmodel/useUploadPassword";
import AppModal, { ModalType } from "../../presentation/components/AppModal";
import { isAppError, APP_ERROR_TITLES } from "../../domain/errors";
import KeyboardAvoidingScreen from "../../presentation/components/KeyboardAvoidingScreen";

export default function ProfileScreen() {
  const { profile } = useAuth();

  const {
    firstName, setFirstName,
    lastName, setLastName,
    validation: profileValidation,
    submit: submitProfile,
  } = useUploadProfile();

  const {
    password, setPassword,
    password2, setPassword2,
    validation: passwordValidation,
    submit: submitPassword,
  } = useUploadPassword();

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [edit, setEdit] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [password2Focused, setPassword2Focused] = useState(false);

  const [modal, setModal] = useState<{
    visible: boolean;
    type: ModalType;
    title: string;
    message: string;
  }>({ visible: false, type: "error", title: "", message: "" });

  const showModal = (type: ModalType, title: string, message: string) =>
    setModal({ visible: true, type, title, message });

  const hideModal = () => setModal((prev) => ({ ...prev, visible: false }));

  const handleSave = async () => {
    try {
      await submitProfile();
      setEdit(false);
      showModal("success", "Perfil actualizado", "Tu perfil fue actualizado correctamente.");
    } catch (error: any) {
      if (isAppError(error)) {
        showModal("error", APP_ERROR_TITLES[error.type], error.message);
      } else {
        showModal("error", "Error", "Ha ocurrido un error al actualizar el perfil.");
      }
    }
  };

  const handleChangePassword = async () => {
    try {
      await submitPassword();
      setChangePassword(false);
      setPassword("");
      setPassword2("");
      showModal("success", "Contraseña actualizada", "Tu contraseña fue cambiada correctamente.");
    } catch (error: any) {
      if (isAppError(error)) {
        showModal("error", APP_ERROR_TITLES[error.type], error.message);
      } else {
        showModal("error", "Error", "Ha ocurrido un error al cambiar la contraseña.");
      }
    }
  };

  const handleCancelPassword = () => {
    setChangePassword(false);
    setPassword("");
    setPassword2("");
  };

  return (
    <>
      <KeyboardAvoidingScreen>
        <View
          style={{
            paddingLeft: 80,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#d7f4d7",
            width: "100%",
          }}
        >
          <Text style={{ color: "black" }} variant="displaySmall">
            Perfil de usuario
          </Text>
          <View style={{ padding: 20, width: "100%", borderRadius: 10 }}>
            {changePassword ? (
              <>
                {/* Contraseña actual */}
                <TextInput
                  placeholder="Actual contraseña"
                  placeholderTextColor="black"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  left={<TextInput.Icon icon="lock" color="black" />}
                  mode="outlined"
                  outlineColor="#ccc"
                  activeOutlineColor="#2c7a2c"
                  textColor="black"
                  style={{ marginBottom: 4, borderRadius: 5, backgroundColor: "white" }}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
                {(passwordFocused) && (
                  <RulesPanel>
                    <RuleRow ok={passwordValidation.password.hasValue} label="Campo no vacio" />
                  </RulesPanel>
                )}

                {/* Nueva contraseña */}
                <TextInput
                  placeholder="Nueva contraseña"
                  placeholderTextColor="black"
                  secureTextEntry={!showPassword2}
                  value={password2}
                  onChangeText={setPassword2}
                  onFocus={() => setPassword2Focused(true)}
                  onBlur={() => setPassword2Focused(false)}
                  left={<TextInput.Icon icon="lock" color="black" />}
                  mode="outlined"
                  outlineColor="#ccc"
                  activeOutlineColor="#2c7a2c"
                  textColor="black"
                  style={{ marginBottom: 4, borderRadius: 5, backgroundColor: "white" }}
                  right={
                    <TextInput.Icon
                      icon={showPassword2 ? "eye-off" : "eye"}
                      onPress={() => setShowPassword2(!showPassword2)}
                    />
                  }
                />
                {(password2Focused) && (
                  <RulesPanel>
                    <RuleRow ok={passwordValidation.password2.hasMinLength} label="Mínimo 8 caracteres" />
                    <RuleRow ok={passwordValidation.password2.hasUppercase} label="Al menos una mayúscula" />
                    <RuleRow ok={passwordValidation.password2.hasNumber} label="Al menos un número" />
                  </RulesPanel>
                )}

                <Button
                  mode="contained"
                  style={{
                    backgroundColor: "#2c7a2c",
                    marginTop: 10,
                    paddingVertical: 3,
                  }}
                  onPress={handleChangePassword}
                  icon="lock-reset"
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Guardar contraseña
                  </Text>
                </Button>
                <Button
                  mode="outlined"
                  style={{ borderColor: "red", marginTop: 10, paddingVertical: 3 }}
                  onPress={handleCancelPassword}
                  textColor="red"
                  icon="close"
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                {/* Nombre */}
                <TextInput
                  placeholder="Nombre"
                  placeholderTextColor="black"
                  left={<TextInput.Icon icon="account" color="black" />}
                  mode="outlined"
                  value={firstName}
                  onChangeText={setFirstName}
                  onFocus={() => setFirstNameFocused(true)}
                  onBlur={() => setFirstNameFocused(false)}
                  disabled={!edit}
                  outlineColor="#ccc"
                  activeOutlineColor="#2c7a2c"
                  textColor="black"
                  style={{ marginBottom: 4, borderRadius: 5, backgroundColor: "white" }}
                />
                {edit && (firstNameFocused) && (
                  <RulesPanel>
                    <RuleRow ok={profileValidation.firstName.hasMinLength} label="Mínimo 4 caracteres" />
                  </RulesPanel>
                )}

                {/* Apellido */}
                <TextInput
                  placeholder="Apellido"
                  placeholderTextColor="black"
                  left={<TextInput.Icon icon="account" color="black" />}
                  mode="outlined"
                  value={lastName}
                  onChangeText={setLastName}
                  onFocus={() => setLastNameFocused(true)}
                  onBlur={() => setLastNameFocused(false)}
                  disabled={!edit}
                  outlineColor="#ccc"
                  activeOutlineColor="#2c7a2c"
                  textColor="black"
                  style={{ marginBottom: 4, borderRadius: 5, backgroundColor: "white" }}
                />
                {edit && (lastNameFocused) && (
                  <RulesPanel>
                    <RuleRow ok={profileValidation.lastName.hasMinLength} label="Mínimo 4 caracteres" />
                  </RulesPanel>
                )}

                <Button
                  mode="contained"
                  style={{
                    backgroundColor: "#2c7a2c",
                    marginTop: 10,
                    paddingVertical: 3,
                  }}
                  onPress={edit ? handleSave : () => setEdit(true)}
                  icon={edit ? "content-save" : "pencil"}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {edit ? "Guardar Cambios" : "Editar Perfil"}
                  </Text>
                </Button>
                {edit && (
                  <Button
                    mode="outlined"
                    style={{ borderColor: "red", marginTop: 10, paddingVertical: 3 }}
                    textColor="red"
                    onPress={() => setEdit(false)}
                    icon="close"
                  >
                    Cancelar
                  </Button>
                )}
                <Button
                  mode="contained"
                  style={{ backgroundColor: "#b5651d", marginTop: 10, paddingVertical: 3 }}
                  onPress={() => setChangePassword(true)}
                  icon="lock-reset"
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Cambiar Contraseña
                  </Text>
                </Button>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingScreen>

      <AppModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onDismiss={hideModal}
        hasSidebar={true}
      />
    </>
  );
}