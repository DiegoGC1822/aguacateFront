import { View, Text, Image } from "react-native";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "../../presentation/components/ProgressBar";
import { usePrediction } from "../../presentation/viewmodel/usePrediction";
import { useImageUpload } from "../../presentation/viewmodel/useImageUpload";
import { router } from "expo-router";
import { analysisHTML } from "../../templates/reportHtml";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function AnalysisResult() {
  const { prediction, loading } = usePrediction();
  const { image, resetImage } = useImageUpload();

  const finishAnalysis = () => {
    resetImage();
    router.push("/addImage");
  };

  console.log(
    "Resultado de la predicción sarna:",
    prediction?.raw_scores.sarna,
  );
  console.log(
    "Resultado de la predicción antracnosis:",
    prediction?.raw_scores.antracnosis,
  );
  console.log(
    "Resultado de la predicción saludable:",
    prediction?.raw_scores.saludable,
  );

  console.log("Resultado de la predicción:", prediction);
  console.log("Imagen analizada:", image);

  const exportToPDF = async () => {
    const htmlContent = await analysisHTML({ prediction, image });
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

  if (loading) {
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
        <Text
          style={{
            fontWeight: "bold",
            marginBottom: 10,
            color: "black",
            textAlign: "center",
            fontSize: 40,
          }}
        >
          Analizando imagen...
        </Text>
      </View>
    );
  }

  const classColor: Record<string, string> = {
    Antracnosis: "#e74c3c",
    Sarna: "#f39c12",
    Saludable: "#2ecc71",
    error: "#95a5a6",
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
      <Text
        style={{
          fontWeight: "bold",
          marginBottom: 10,
          color: "black",
          textAlign: "center",
          fontSize: 30,
        }}
      >
        ¡Análisis Completo!
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
      <Text
        style={{
          fontWeight: "bold",
          color: "black",
          textAlign: "center",
          fontSize: 14,
        }}
      >
        La imagen ha sido analizada exitosamente. Aquí están los resultados:
      </Text>
      <View
        style={{
          marginVertical: 20,
          width: "80%",
          gap: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
        <Text style={{ color: "black", fontSize: 16 }}>
          Probabilidad por clase:
        </Text>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <Text style={{ fontWeight: "bold", color: "#e74c3c" }}>
            Antracnosis
          </Text>
          <Text style={{ fontWeight: "bold", color: "#f39c12" }}>Sarna</Text>
          <Text style={{ fontWeight: "bold", color: "#2ecc71" }}>
            Saludable
          </Text>
        </View>
      </View>
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
      <Button
        mode="contained"
        style={{
          backgroundColor: "#2D2C7A",
          marginTop: 20,
          width: "80%",
        }}
        icon={() => <Ionicons name="document-text" size={20} color="black" />}
        onPress={exportToPDF}
      >
        <Text style={{ fontWeight: "bold" }}>Exportar a pdf</Text>
      </Button>
      <Button
        mode="contained"
        style={{
          backgroundColor: "#FFAA00",
          marginTop: 20,
          width: "80%",
        }}
        icon={() => (
          <Ionicons name="arrow-undo-outline" size={20} color="black" />
        )}
        onPress={finishAnalysis}
      >
        <Text style={{ fontWeight: "bold" }}>Terminar analisis</Text>
      </Button>
    </View>
  );
}
