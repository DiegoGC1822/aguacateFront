import { PredictionResponse } from "../../types";
import { Modal, Text, Button } from "react-native-paper";
import { View, Image, ScrollView } from "react-native";
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
      <ScrollView
        contentContainerStyle={{
          marginVertical: 20,
          gap: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "black" }}>{fecha}</Text>
        <Image
          source={{ uri: prediction.image }}
          style={{
            width: 200,
            height: 200,
            borderRadius: 10,
          }}
        />

        {prediction.predicted_category_display !== "Saludable" && (
          <View style={{ width: "100%", alignItems: "center", marginTop: 5, gap: 5 }}>
            {prediction.lot_name && (
              <View style={{ backgroundColor: "#34495e", paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15 }}>
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>
                  Lote: {prediction.lot_name}
                </Text>
              </View>
            )}
            {prediction.tree_code && (
              <View style={{ backgroundColor: "#2c7a2c", paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15, flexDirection: "row", alignItems: "center", gap: 5 }}>
                <Ionicons name="leaf" size={16} color="white" />
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>
                  Árbol: {prediction.tree_code}
                </Text>
              </View>
            )}
            {prediction.north_coordinate != null && prediction.east_coordinate != null && (
              <View style={{ backgroundColor: "#ecf0f1", paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15, borderWidth: 1, borderColor: "#bdc3c7", flexDirection: "row", alignItems: "center", gap: 5 }}>
                <Ionicons name="location" size={16} color="#7f8c8d" />
                <Text style={{ color: "#2c3e50", fontWeight: "bold", fontSize: 14 }}>
                  UTM: N {prediction.north_coordinate} m | E {prediction.east_coordinate} m
                </Text>
              </View>
            )}
          </View>
        )}

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
      </ScrollView>
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
    </Modal>
  );
}
