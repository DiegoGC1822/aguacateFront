import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { Button } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePrediction } from "../../presentation/viewmodel/usePrediction";
import { useImageUpload } from "../../presentation/viewmodel/useImageUpload";
import { router } from "expo-router";

// ---------------------------------------------------------------------------
// Modals Componentes Internos
// ---------------------------------------------------------------------------

// Modals removidos a resultsBatch.tsx

// ---------------------------------------------------------------------------
// Pantalla Principal Batch
// ---------------------------------------------------------------------------

export default function BatchScreen() {
  const {
    batchName,
    batchDescription,
    batchImages,
    setBatchConfig,
    addBatchImage,
    removeBatchImage,
    clearBatch,
    executeBatchAnalysis,
  } = usePrediction();
  const { pickImage, takePhoto } = useImageUpload();

  // Estados locales
  const [tempName, setTempName] = useState(batchName);
  const [tempDesc, setTempDesc] = useState(batchDescription);

  // Modals state
  const [showDescModal, setShowDescModal] = useState(false);
  const [showOriginModal, setShowOriginModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  useEffect(() => {
    setTempName(batchName);
    setTempDesc(batchDescription);
  }, [batchName, batchDescription]);

  const handleAddPhoto = async (action: () => Promise<string | null | void>) => {
    setShowOriginModal(false);
    try {
      const resultUri = await action();

      if (resultUri && typeof resultUri === "string") {
        addBatchImage(resultUri);
      } else {
        console.warn("La acción no retornó una URI. Verifica la implementación de useImageUpload.");
      }
    } catch (e) {
      console.error("Error al capturar la imagen para el lote:", e);
    }
  };

  const handleStartAnalysis = async () => {
    try {
      await executeBatchAnalysis();
      router.push("/resultsBatch" as any);
    } catch (e) {
      console.log(e);
      // Aqui podrías manejar un toast o error de UI si lo deseas.
    }
  };

  // ---------------------------------------------------------------------------
  // Sub-pantalla 1: Configuración
  // ---------------------------------------------------------------------------
  if (!batchName) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Análisis por lote</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del lote"
          value={tempName}
          onChangeText={setTempName}
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Descripción del lote"
          multiline
          value={tempDesc}
          onChangeText={setTempDesc}
        />
        <View style={styles.rowButtons}>
          <Button
            mode="outlined"
            onPress={() => {
              setTempName("");
              setTempDesc("");
              router.back();
            }}
            style={[styles.destructiveButton, { flex: 1, marginRight: 10 }]}
            textColor="red"
          >
            Regresar
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              if (tempName.trim()) {
                setBatchConfig(tempName.trim(), tempDesc.trim());
              }
            }}
            style={[styles.primaryButton, { flex: 1 }]}
          >
            Aceptar
          </Button>
        </View>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // Sub-pantalla 2: Confirmación
  // ---------------------------------------------------------------------------
  if (batchImages.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Confirmación de lote - {batchName}</Text>

        <View style={styles.buttonGroupVertical}>
          <Button
            mode="contained"
            onPress={() => setShowDescModal(true)}
            style={styles.secondaryButton}
            icon={() => <Ionicons name="document-text-outline" size={20} color="white" />}
          >
            Ver Desc.
          </Button>

          <Button
            mode="contained"
            onPress={() => handleAddPhoto(takePhoto)}
            style={styles.primaryButton}
            icon={() => <Ionicons name="camera-outline" size={20} color="white" />}
          >
            Tomar Foto
          </Button>

          <Button
            mode="contained"
            onPress={() => handleAddPhoto(pickImage)}
            style={styles.primaryButton}
            icon={() => <Ionicons name="image-outline" size={20} color="white" />}
          >
            Cargar Foto
          </Button>
        </View>

        <Button
          mode="outlined"
          onPress={() => setBatchConfig("", "")}
          style={[styles.destructiveButton, { width: "80%", marginTop: 23 }]}
          textColor="red"
        >
          Regresar
        </Button>

        {/* Modal 1: Descripción */}
        <Modal visible={showDescModal} transparent animationType="fade" onRequestClose={() => setShowDescModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Descripción del lote</Text>
              <Text style={styles.modalText}>{batchDescription || "Sin descripción"}</Text>
              <Button mode="contained" onPress={() => setShowDescModal(false)} style={styles.primaryButton}>
                Cerrar
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // Sub-pantalla 3: Panel de Trabajo
  // ---------------------------------------------------------------------------
  return (
    <View style={styles.containerGrid}>
      <View style={styles.headerRow}>
        <Text style={styles.titleGrid}>Panel de Trabajo - {batchName}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowOriginModal(true)}
        >
          <Ionicons name="add-circle" size={40} color="#2c7a2c" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {batchImages.map((img) => (
          <View key={img.id} style={styles.thumbnailContainer}>
            <Image source={{ uri: img.uri }} style={styles.thumbnail} />
            <TouchableOpacity
              style={styles.deleteThumbnailBtn}
              onPress={(e) => {
                e.stopPropagation();
                removeBatchImage(img.id);
              }}
            >
              <Ionicons name="close-circle" size={24} color="#c0392b" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footerButtons}>
        <Button
          mode="contained"
          onPress={handleStartAnalysis}
          style={styles.primaryButton}
        >
          <Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}>Iniciar Análisis</Text>
        </Button>
        <Button
          mode="contained"
          onPress={() => {
            setTempName(batchName);
            setTempDesc(batchDescription);
            setBatchConfig("", ""); // Hack to return to step 1 temporarily
          }}
          style={styles.secondaryButton}
        >
          <Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}>Editar Lote</Text>
        </Button>
        <Button
          mode="outlined"
          onPress={() => setShowClearConfirmModal(true)}
          style={styles.destructiveButton}
        >
          <Text style={{ fontSize: 12, color: '#c0392b' }}>Borrar Fotos</Text>
        </Button>
      </View>

      {/* Modal 2: Origen Media */}
      <Modal visible={showOriginModal} transparent animationType="slide" onRequestClose={() => setShowOriginModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar imagen</Text>
            <Button mode="contained" onPress={() => handleAddPhoto(takePhoto)} style={styles.primaryButton}>
              Tomar Foto
            </Button>
            <Button mode="contained" onPress={() => handleAddPhoto(pickImage)} style={styles.primaryButton}>
              Cargar Foto
            </Button>
            <Button mode="outlined" onPress={() => setShowOriginModal(false)} style={styles.destructiveButton} textColor="red">
              Cancelar
            </Button>
          </View>
        </View>
      </Modal>

      {/* Modal Confirmación de Borrado */}
      <Modal visible={showClearConfirmModal} transparent animationType="fade" onRequestClose={() => setShowClearConfirmModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Borrar todas las fotos?</Text>
            <View style={styles.rowButtons}>
              <Button mode="contained" onPress={() => {
                clearBatch();
                setShowClearConfirmModal(false);
                setBatchConfig(batchName, batchDescription); // Restore config
              }} style={[styles.primaryButton, { flex: 1, marginRight: 5 }]}>
                Sí
              </Button>
              <Button mode="outlined" onPress={() => setShowClearConfirmModal(false)} textColor="red" style={[styles.destructiveButton, { flex: 1, marginLeft: 5 }]}>
                No
              </Button>
            </View>
          </View>
        </View>
      </Modal>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d7f4d7",
    padding: 20,
    paddingLeft: 80,
  },
  containerGrid: {
    flex: 1,
    backgroundColor: "#d7f4d7",
    padding: 20,
    paddingLeft: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#2c7a2c",
    textAlign: "center",
  },
  titleGrid: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c7a2c",
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  addButton: {
    padding: 5,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputDisabled: {
    backgroundColor: "#eee",
    color: "#666",
  },
  rowButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  buttonGroupVertical: {
    width: "80%",
    gap: 15,
  },
  primaryButton: {
    backgroundColor: "#2c7a2c",
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: "#37c534",
    marginTop: 10,
  },
  destructiveButton: {
    borderColor: "#c0392b",
    marginTop: 10,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 16,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  boldText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginTop: 10,
  },
  helpButtonModal: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  thumbnailContainer: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 10,
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  deleteThumbnailBtn: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 12,
  },
  footerButtons: {
    marginTop: 20,
    paddingBottom: 20,
    gap: 15,
    width: "100%",
    height: 200,
  },
});
