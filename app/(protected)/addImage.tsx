import { View, Image, Modal, TouchableOpacity, Text } from "react-native";
import { Button } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePrediction } from "../../presentation/viewmodel/usePrediction";
import { useImageUpload } from "../../presentation/viewmodel/useImageUpload";
import { router } from "expo-router";
import { useState } from "react";
import AppToast, { ToastType } from "../../presentation/components/AppToast";
import { isAppError } from "../../domain/errors";

const GuideRow = ({
  icon,
  text,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  text: string;
}) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
      gap: 10,
    }}
  >
    <Ionicons name={icon} size={22} color="#2c7a2c" style={{ marginTop: 1 }} />
    <Text style={{ flex: 1, fontSize: 14, color: "#333", lineHeight: 20 }}>
      {text}
    </Text>
  </View>
);

export default function ImageUploader() {
  const { pickImage, takePhoto, image, resetImage } = useImageUpload();
  const { analyzeImage } = usePrediction();
  const [showGuide, setShowGuide] = useState(false);

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: ToastType;
  }>({ visible: false, message: "", type: "info" });

  const showToast = (message: string, type: ToastType) =>
    setToast({ visible: true, message, type });

  const hideToast = () => setToast((prev) => ({ ...prev, visible: false }));

  const handlePickImage = async () => {
    try {
      await pickImage();
      showToast("✅ Imagen cargada correctamente", "success");
    } catch (error: any) {
      if (isAppError(error) && error.type === "IMAGE_FORMAT") {
        showToast(error.message, "error");
      } else {
        showToast("No se pudo cargar la imagen. Intenta de nuevo.", "error");
      }
    }
  };

  const handleTakePhoto = async () => {
    try {
      await takePhoto();
      showToast("Foto tomada correctamente", "success");
    } catch (error: any) {
      if (isAppError(error) && error.type === "IMAGE_FORMAT") {
        showToast(error.message, "error");
      } else {
        showToast("No se pudo tomar la foto. Intenta de nuevo.", "error");
      }
    }
  };

  const handleAnalyze = () => {
    if (!image) return;
    analyzeImage(image);
    router.push("/result");
  };

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
      {/* Botón de ayuda */}
      <TouchableOpacity
        onPress={() => setShowGuide(true)}
        style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}
        accessibilityLabel="Abrir guía de captura"
      >
        <Ionicons name="help-circle-outline" size={32} color="#2c7a2c" />
      </TouchableOpacity>

      {/* Modal de guía de captura */}
      <Modal
        visible={showGuide}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGuide(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 360,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#1a1a1a",
                marginBottom: 16,
              }}
            >
              📷 Cómo tomar una buena foto
            </Text>
            <GuideRow
              icon="sunny-outline"
              text="Usa luz natural — evita sombras directas y flash"
            />
            <GuideRow
              icon="scan-outline"
              text="Distancia recomendada: 15 – 25 cm del fruto"
            />
            <GuideRow
              icon="aperture-outline"
              text="Asegúrate de que el aguacate esté en foco y centrado"
            />
            <GuideRow
              icon="color-filter-outline"
              text="Usa un fondo uniforme (mesa, suelo o tela de un solo color)"
            />
            <Button
              mode="contained"
              style={{ backgroundColor: "#2c7a2c", marginTop: 8 }}
              onPress={() => setShowGuide(false)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Entendido</Text>
            </Button>
          </View>
        </View>
      </Modal>

      <AppToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={hideToast}
        hasSidebar
      />

      {/* Título */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 10,
          color: "black",
          textAlign: "center",
        }}
      >
        Detección de Enfermedades en Aguacates
      </Text>

      {image && (
        <Image
          source={{ uri: image }}
          style={{
            width: 200,
            height: 200,
            borderRadius: 10,
            marginBottom: 20,
          }}
        />
      )}

      <View style={{ width: "80%" }}>
        {/* Botón primario: Analizar (solo visible si hay imagen) */}
        {image && (
          <Button
            testID="btn-analizar"
            mode="contained"
            onPress={handleAnalyze}
            style={{ backgroundColor: "#2c7a2c", marginTop: 20 }}
            icon={() => <Ionicons name="analytics" size={20} color="white" />}
          >
            <Text style={{ fontWeight: "bold", color: "white" }}>Analizar</Text>
          </Button>
        )}

        {/* Botones secundarios */}
        <Button
          testID="btn-cargar-imagen"
          mode="contained"
          onPress={handlePickImage}
          style={{ backgroundColor: "#37c534", marginTop: 20 }}
          icon={() => <Ionicons name="image" size={20} color="white" />}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>
            Cargar Imagen
          </Text>
        </Button>
        <Button
          mode="contained"
          onPress={handleTakePhoto}
          style={{ backgroundColor: "#37c534", marginTop: 20 }}
          icon={() => <Ionicons name="camera" size={20} color="white" />}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>Tomar Foto</Text>
        </Button>

        {/* Botón destructivo (outlined) */}
        {image && (
          <Button
            mode="outlined"
            onPress={resetImage}
            style={{ borderColor: "#c0392b", marginTop: 20 }}
            textColor="#c0392b"
            icon={() => (
              <Ionicons name="trash-outline" size={20} color="#c0392b" />
            )}
          >
            Quitar imagen
          </Button>
        )}
      </View>

    </View>
  );
}

