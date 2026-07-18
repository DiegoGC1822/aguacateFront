import React, { useState } from "react";
import { View, Image, Modal, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePrediction } from "../../presentation/viewmodel/usePrediction";
import { useImageUpload } from "../../presentation/viewmodel/useImageUpload";
import { router } from "expo-router";
import AppToast, { ToastType } from "../../presentation/components/AppToast";
import { isAppError } from "../../domain/errors";

const GuideRow = ({
  icon,
  text,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  text: string;
}) => (
  <View style={styles.guideRow}>
    <Ionicons name={icon} size={22} color="#2c7a2c" style={{ marginTop: 1 }} />
    <Text style={styles.guideText}>{text}</Text>
  </View>
);

export default function AnalysisScreen() {
  const [mode, setMode] = useState<"selection" | "individual">("selection");
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

  if (mode === "selection") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Elección de modalidad de análisis</Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => setMode("individual")}
            style={styles.primaryButton}
            icon={() => <Ionicons name="image-outline" size={20} color="white" />}
          >
            <Text style={styles.buttonText}>Análisis individual</Text>
          </Button>
          <Button
            mode="contained"
            onPress={() => router.push("/batch")}
            style={styles.primaryButton}
            icon={() => <Ionicons name="images-outline" size={20} color="white" />}
          >
            <Text style={styles.buttonText}>Análisis por lote</Text>
          </Button>
        </View>
      </View>
    );
  }

  // Individual mode
  return (
    <View style={styles.containerIndividual}>
      <TouchableOpacity
        onPress={() => setMode("selection")}
        style={styles.backButton}
        accessibilityLabel="Volver"
      >
        <Ionicons name="arrow-back" size={32} color="#2c7a2c" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowGuide(true)}
        style={styles.helpButton}
        accessibilityLabel="Abrir guía de captura"
      >
        <Ionicons name="help-circle-outline" size={32} color="#2c7a2c" />
      </TouchableOpacity>

      <Modal
        visible={showGuide}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGuide(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📷 Cómo tomar una buena foto</Text>
            <GuideRow icon="sunny-outline" text="Usa luz natural — evita sombras directas y flash" />
            <GuideRow icon="scan-outline" text="Distancia recomendada: 15 – 25 cm del fruto" />
            <GuideRow icon="aperture-outline" text="Asegúrate de que el aguacate esté en foco y centrado" />
            <GuideRow icon="color-filter-outline" text="Usa un fondo uniforme (mesa, suelo o tela de un solo color)" />
            <Button
              mode="contained"
              style={styles.modalButton}
              onPress={() => setShowGuide(false)}
            >
              <Text style={styles.modalButtonText}>Entendido</Text>
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

      <Text style={styles.titleIndividual}>
        Detección de Enfermedades en Aguacates
      </Text>

      {image && (
        <Image source={{ uri: image }} style={styles.previewImage} />
      )}

      <View style={{ width: "80%" }}>
        {image && (
          <Button
            testID="btn-analizar"
            mode="contained"
            onPress={handleAnalyze}
            style={styles.primaryButton}
            icon={() => <Ionicons name="analytics" size={20} color="white" />}
          >
            <Text style={styles.buttonText}>Analizar</Text>
          </Button>
        )}

        <Button
          testID="btn-cargar-imagen"
          mode="contained"
          onPress={handlePickImage}
          style={styles.secondaryButton}
          icon={() => <Ionicons name="image" size={20} color="white" />}
        >
          <Text style={styles.buttonText}>Cargar Imagen</Text>
        </Button>

        <Button
          mode="contained"
          onPress={handleTakePhoto}
          style={styles.secondaryButton}
          icon={() => <Ionicons name="camera" size={20} color="white" />}
        >
          <Text style={styles.buttonText}>Tomar Foto</Text>
        </Button>

        {image && (
          <Button
            mode="outlined"
            onPress={resetImage}
            style={styles.destructiveButton}
            textColor="#c0392b"
            icon={() => <Ionicons name="trash-outline" size={20} color="#c0392b" />}
          >
            Quitar imagen
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d7f4d7",
    paddingLeft: 80,
  },
  containerIndividual: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d7f4d7",
    paddingLeft: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#2c7a2c",
    textAlign: "center",
  },
  titleIndividual: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
    textAlign: "center",
  },
  buttonContainer: {
    width: "80%",
    maxWidth: 400,
    gap: 20,
  },
  primaryButton: {
    backgroundColor: "#2c7a2c",
    paddingVertical: 8,
  },
  secondaryButton: {
    backgroundColor: "#37c534",
    marginTop: 20,
  },
  destructiveButton: {
    borderColor: "#c0392b",
    marginTop: 20,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 80,
    zIndex: 10,
  },
  helpButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  guideRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 10,
  },
  guideText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: "#2c7a2c",
    marginTop: 8,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
});
