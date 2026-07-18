import { View, Text, ScrollView } from "react-native";
import CardResult from "../../presentation/components/CardResult";
import { useState } from "react";
import { usePrediction } from "../../presentation/viewmodel/usePrediction";
import { SafeAreaView } from "react-native-safe-area-context";
import { Modal as PaperModal, Button } from "react-native-paper";
import { Modal as RNModal } from "react-native";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "../../presentation/components/ProgressBar";
import { analysisHTML } from "../../templates/reportHtml";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { router } from "expo-router";
import { PredictionResponse, BatchImage } from "../../types";
import { TextInput, TouchableOpacity as RNTouchableOpacity, StyleSheet } from "react-native";
import { useEffect } from "react";

// ---------------------------------------------------------------------------
// Modals Componentes Internos
// ---------------------------------------------------------------------------

const TooltipAyudaModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => (
  <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>¿Qué se debe poner?</Text>

        <Text style={styles.boldText}>Identificador árbol:</Text>
        <Text style={styles.modalText}>
          Código o nombre que le asignes al árbol del cual proviene el fruto.
        </Text>

        <Text style={styles.boldText}>Coordenadas (Norte / Este):</Text>
        <Text style={styles.modalText}>
          Ubicación geográfica del árbol en metros (UTM) para su fácil localización.
        </Text>

        <Button mode="contained" onPress={onClose} style={styles.primaryButton}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Entendido</Text>
        </Button>
      </View>
    </View>
  </RNModal>
);

const MetadataModal = ({
  visible,
  imageId,
  onClose,
}: {
  visible: boolean;
  imageId: string;
  onClose: () => void;
}) => {
  const { batchImages, updateClassificationOnServer } = usePrediction();
  const image = batchImages.find((img) => img.id === imageId);

  const [isEditing, setIsEditing] = useState(false);
  const [treeId, setTreeId] = useState("");
  const [coorNorte, setCoorNorte] = useState("");
  const [coorEste, setCoorEste] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (image) {
      setTreeId(image.treeId || "");
      setCoorNorte(image.coorNorte || "");
      setCoorEste(image.coorEste || "");
    }
  }, [image, visible]);

  if (!image) return null;

  const handleSave = async () => {
    try {
      await updateClassificationOnServer(imageId, treeId, coorNorte, coorEste);
      setIsEditing(false);
      onClose(); // Cierra el modal al guardar exitosamente
    } catch (e) {
      console.log(e);
      // Se podría mostrar un toast
    }
  };

  const handleCancel = () => {
    setTreeId(image.treeId || "");
    setCoorNorte(image.coorNorte || "");
    setCoorEste(image.coorEste || "");
    setIsEditing(false);
  };

  return (
    <RNModal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <RNTouchableOpacity
            style={styles.helpButtonModal}
            onPress={() => setShowTooltip(true)}
          >
            <Ionicons name="help-circle" size={28} color="#2c7a2c" />
          </RNTouchableOpacity>

          <Text style={styles.modalTitle}>Información Adicional</Text>

          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            placeholder="Identificador árbol"
            value={treeId}
            onChangeText={setTreeId}
            editable={isEditing}
          />
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            placeholder="coor norte"
            value={coorNorte}
            onChangeText={setCoorNorte}
            editable={isEditing}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            placeholder="coor este"
            value={coorEste}
            onChangeText={setCoorEste}
            editable={isEditing}
            keyboardType="numeric"
          />

          <View style={styles.rowButtons}>
            {!isEditing ? (
              <>
                <Button mode="contained" onPress={() => setIsEditing(true)} style={[styles.primaryButton, { flex: 1, marginRight: 5 }]}>
                  <Text style={{ color: "white", fontWeight: "bold" }}>Editar</Text>
                </Button>
                <Button mode="outlined" onPress={onClose} style={[styles.destructiveButton, { flex: 1, marginLeft: 5 }]}>
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button mode="contained" onPress={handleSave} style={[styles.primaryButton, { flex: 1, marginRight: 5 }]}>
                  <Text style={{ color: "white", fontWeight: "bold" }}>Guardar cambios</Text>
                </Button>
                <Button mode="outlined" onPress={handleCancel} style={[styles.destructiveButton, { flex: 1, marginLeft: 5 }]}>
                  Cancelar edición
                </Button>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Modal 4 (Tooltip) superpuesto */}
      <TooltipAyudaModal visible={showTooltip} onClose={() => setShowTooltip(false)} />
    </RNModal>
  );
};

// ---------------------------------------------------------------------------
// Modal de Detalles Específico para Lotes (Batch)
// ---------------------------------------------------------------------------
interface ModalResultBatchProps {
  prediction: PredictionResponse;
  batchImage?: BatchImage;
  setShowDetails: (show: boolean) => void;
  showDetails: boolean;
}

function ModalResultBatch({
  prediction,
  batchImage,
  setShowDetails,
  showDetails,
}: ModalResultBatchProps) {
  const classColor: Record<string, string> = {
    Antracnosis: "#e74c3c",
    Sarna: "#f39c12",
    Saludable: "#2ecc71",
    error: "#95a5a6",
  };

  const exportToPDF = async () => {
    const htmlContent = await analysisHTML({
      prediction,
      image: prediction?.image,
    });
    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Guardar reporte de análisis",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      console.error("Error al exportar a PDF:", error);
    }
  };

  const fechaCompleta = prediction.classified_at || "";
  const fecha = fechaCompleta.includes("T") ? fechaCompleta.split("T")[0] : fechaCompleta;

  return (
    <PaperModal
      visible={showDetails}
      contentContainerStyle={{
        padding: 10,
        borderRadius: 10,
        backgroundColor: "white",
        justifyContent: "center",
        alignContent: "center",
        marginLeft: 80,
        marginRight: 10,
      }}
    >
      <View
        style={{
          marginVertical: 20,
          gap: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Identificador del Árbol (si existe) */}
        {batchImage && batchImage.treeId ? (
          <View
            style={{
              backgroundColor: "#2c7a2c",
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 20,
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Ionicons name="leaf" size={18} color="white" />
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Árbol: {batchImage.treeId}
            </Text>
          </View>
        ) : null}

        <Text style={{ color: "black" }}>{fecha}</Text>
        <Image
          source={{ uri: prediction.image }}
          style={{
            width: 200,
            height: 200,
            borderRadius: 10,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "black" }}>Diagnostico:</Text>
          <Text
            style={{
              fontWeight: "bold",
              color: "black",
              backgroundColor:
                classColor[prediction?.predicted_category_display || "error"],
              padding: 5,
              borderRadius: 20,
              marginLeft: 5,
            }}
          >
            {prediction?.predicted_category_display || "Error en la predicción"}
          </Text>
        </View>
        <Text style={{ color: "black" }}>
          Confianza: {Math.round((prediction?.confidence || 0) * 100)}%
        </Text>
        <Text style={{ color: "black" }}>Grado de Certeza:</Text>
        <ProgressBar
          percentage={prediction?.raw_scores.antracnosis || 0}
          backgroundColor="#e74c3c"
          borderColor="#e74c3c"
        />
        <ProgressBar
          percentage={prediction?.raw_scores.sarna || 0}
          backgroundColor="#f39c12"
          borderColor="#f39c12"
        />
        <ProgressBar
          percentage={prediction?.raw_scores.saludable || 0}
          backgroundColor="#2ecc71"
          borderColor="#2ecc71"
        />
        <View style={{ flexDirection: "row", gap: 20 }}>
          <Text style={{ fontWeight: "bold", color: "#e74c3c" }}>
            Antracnosis
          </Text>
          <Text style={{ fontWeight: "bold", color: "#f39c12" }}>Sarna</Text>
          <Text style={{ fontWeight: "bold", color: "#2ecc71" }}>
            Saludable
          </Text>
        </View>
        <View>
          <Button
            mode="contained"
            style={{
              backgroundColor: "#2D2C7A",
              marginTop: 15,
            }}
            icon={() => (
              <Ionicons name="document-text" size={20} color="black" />
            )}
            onPress={exportToPDF}
          >
            <Text style={{ fontWeight: "bold", color: "white" }}>
              Exportar a pdf
            </Text>
          </Button>
          <Button
            mode="contained"
            style={{
              backgroundColor: "#FFAA00",
              marginTop: 15,
            }}
            icon={() => (
              <Ionicons name="close-circle-outline" size={20} color="black" />
            )}
            onPress={() => setShowDetails(false)}
          >
            <Text style={{ fontWeight: "bold", color: "white" }}>
              Cerrar detalles
            </Text>
          </Button>
        </View>
      </View>
    </PaperModal>
  );
}

// ---------------------------------------------------------------------------
// Pantalla Principal ResultsBatch
// ---------------------------------------------------------------------------
export default function ResultsBatchScreen() {
  const [showDetails, setShowDetails] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [selectedBatchImageId, setSelectedBatchImageId] = useState("");

  const { batchName, batchImages, clearBatch } = usePrediction();

  const [selectPrediction, setSelectPrediction] = useState<PredictionResponse>({
    id: 0,
    predicted_category_display: "",
    confidence: 0,
    raw_scores: { saludable: 0, antracnosis: 0, sarna: 0 },
    image: "",
    error_message: null,
    classified_at: "",
    status: "",
  });

  // Obtenemos las imágenes que tengan una predicción completada
  const analyzedImages = batchImages.filter((img) => img.prediction);

  // Encontramos el batchImage asociado a la predicción seleccionada
  const selectedBatchImage = batchImages.find(
    (img) => img.prediction?.id === selectPrediction.id
  );

  const handleEdit = (prediction: PredictionResponse) => {
    const image = batchImages.find((img) => img.prediction?.id === prediction.id);
    if (image) {
      setSelectedBatchImageId(image.id);
      setShowMetadata(true);
    }
  };

  const handleFinishAnalysis = () => {
    clearBatch();
    router.replace("/Analysis"); // o "/" dependiendo del dashboard principal
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d7f4d7" }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between", // Para que el botón de terminar quede abajo
          alignItems: "center",
          width: "100%",
          paddingBottom: 20, // Espacio extra al final
        }}
      >
        <View
          style={{
            paddingLeft: 70,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#d7f4d7",
            width: "100%",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20,
              color: "black",
              textAlign: "center",
              fontSize: 30,
            }}
          >
            Resultados de análisis - {batchName}
          </Text>

          <View style={{ width: "95%", gap: 10 }}>
            {analyzedImages.length > 0 ? (
              analyzedImages.map((img) => (
                <CardResult
                  key={img.id}
                  prediction={img.prediction!}
                  setShowDetails={setShowDetails}
                  setSelectPrediction={setSelectPrediction}
                  onEdit={handleEdit}
                />
              ))
            ) : (
              <Text style={{ textAlign: "center", color: "black", fontSize: 16 }}>
                No hay resultados disponibles en este lote.
              </Text>
            )}
          </View>
        </View>

      </ScrollView>
      {/* Botón Centralizado al final */}
      <View style={{ paddingLeft: 70, width: "100%", alignItems: "center", marginTop: 40 }}>
        <Button
          mode="contained"
          onPress={handleFinishAnalysis}
          style={{
            backgroundColor: "#2c7a2c",
            paddingVertical: 8,
            width: "80%",
          }}
          icon={() => <Ionicons name="checkmark-done" size={24} color="white" />}
        >
          <Text style={{ fontWeight: "bold", color: "white", fontSize: 16 }}>
            Terminar analisis
          </Text>
        </Button>
      </View>

      {/* Modal de Detalle */}
      <ModalResultBatch
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        prediction={selectPrediction}
        batchImage={selectedBatchImage}
      />

      {/* Modal de Metadata */}
      <MetadataModal
        visible={showMetadata}
        imageId={selectedBatchImageId}
        onClose={() => setShowMetadata(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  primaryButton: {
    backgroundColor: "#2c7a2c",
    marginTop: 10,
  },
  destructiveButton: {
    borderColor: "#c0392b",
    marginTop: 10,
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
  helpButtonModal: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
});
