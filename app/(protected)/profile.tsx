import { TextInput, Button } from "react-native-paper";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { useAuth } from "../../presentation/viewmodel/useAuth";

export default function ProfileScreen() {
  const { profile, updateUserProfile, updatePassword } = useAuth();
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [edit, setEdit] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const handleSave = () => {
    try {
      console.log("Updating profile with:", { firstName, lastName });
      updateUserProfile(firstName, lastName);
      setEdit(false);
      alert("Perfil actualizado correctamente");
    } catch (error: any) {
      alert(error.message || "Error al actualizar el perfil");
    }
  };

  const handleChangePassword = () => {
    try {
      console.log("Changing password with:", {
        currentPassword: currentPassword,
        newPassword: newPassword,
      });
      updatePassword(currentPassword, newPassword);
      setChangePassword(false);
      alert("Contraseña cambiada correctamente");
    } catch (error: any) {
      alert(error.message || "Error al cambiar la contraseña");
    }
  };

  const handleCancelPassword = () => {
    setChangePassword(false);
    setNewPassword("");
    setCurrentPassword("");
  };

  const handleCancelEdit = () => {
    setEdit(false);
    setFirstName(profile?.first_name || "");
    setLastName(profile?.last_name || "");
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
          width: "100%",
        }}
      >
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
          <View
            style={{
              padding: 20,
              width: "100%",
              borderRadius: 10,
            }}
          >
            {changePassword ? (
              <>
                <TextInput
                  placeholder="Actual contraseña"
                  placeholderTextColor="black"
                  secureTextEntry={!showPassword}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  left={<TextInput.Icon icon="lock" color="black" />}
                  mode="outlined"
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
                  placeholder="Nueva contraseña"
                  placeholderTextColor="black"
                  secureTextEntry={!showPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  left={<TextInput.Icon icon="lock" color="black" />}
                  mode="outlined"
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
                <Button
                  mode="contained"
                  style={{
                    backgroundColor: "#23fdce",
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
                  mode="contained"
                  style={{
                    backgroundColor: "red",
                    marginTop: 10,
                    paddingVertical: 3,
                  }}
                  onPress={handleCancelPassword}
                  icon="close"
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Cancelar
                  </Text>
                </Button>
              </>
            ) : (
              <>
                <TextInput
                  placeholder="Nombre"
                  placeholderTextColor="black"
                  left={<TextInput.Icon icon="account" color="black" />}
                  mode="outlined"
                  value={firstName}
                  onChangeText={setFirstName}
                  disabled={!edit}
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
                  value={lastName}
                  onChangeText={setLastName}
                  disabled={!edit}
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
                    backgroundColor: edit ? "green" : "#2196F3",
                    marginTop: 10,
                    paddingVertical: 3,
                  }}
                  onPress={edit ? handleSave : () => setEdit(!edit)}
                  icon={edit ? "content-save" : "pencil"}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {edit ? "Guardar Cambios" : "Editar Perfil"}
                  </Text>
                </Button>
                {edit && (
                  <Button
                    mode="contained"
                    style={{
                      backgroundColor: "red",
                      marginTop: 10,
                      paddingVertical: 3,
                    }}
                    onPress={handleCancelEdit}
                    icon="close"
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      Cancelar
                    </Text>
                  </Button>
                )}
                <Button
                  mode="contained"
                  style={{
                    backgroundColor: "#23fdce",
                    marginTop: 10,
                    paddingVertical: 3,
                  }}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
