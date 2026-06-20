import { PredictionResponse } from "../../types";
import { Modal, Text, Button } from "react-native-paper";
import { View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "./ProgressBar";
import { analysisHTML } from "../../templates/reportHtml";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

interface ModalResultProps {
  prediction: PredictionResponse;
  setShowDetails: (show: boolean) => void;
  showDetails: boolean;
}

export default function ModalResult({
  prediction,
  setShowDetails,
  showDetails,
}: ModalResultProps) {
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

  const fechaCompleta = prediction.classified_at;
  const fecha = fechaCompleta.split("T")[0];

  return (
    <Modal
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
        <Text>{fecha}</Text>
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
            }}
          >
            {prediction?.predicted_category_display || "Error en la predicción"}
          </Text>
        </View>
        <Text style={{ color: "black" }}>
          Confianza: {Math.round((prediction?.confidence || 0) * 100)}%
        </Text>
        <ProgressBar
          percentage={prediction?.raw_scores.antracnosis || 0}
          backgroundColor="#e74c3c"
        />
        <ProgressBar
          percentage={prediction?.raw_scores.sarna || 0}
          backgroundColor="#f39c12"
        />
        <ProgressBar
          percentage={prediction?.raw_scores.saludable || 0}
          backgroundColor="#2ecc71"
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
              <Ionicons name="arrow-undo-outline" size={20} color="black" />
            )}
            onPress={() => setShowDetails(false)}
          >
            <Text style={{ fontWeight: "bold", color: "white" }}>
              Regresar al historial
            </Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}
