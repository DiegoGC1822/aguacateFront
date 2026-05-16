import { View, Text, Image } from "react-native";
import ProgressBar from "../../components/ProgressBar";
import { usePrediction } from "../../store/usePrediction";
import { useImageUpload } from "../../store/useImageUpload";

export default function AnalysisResult() {
  const { prediction } = usePrediction();
  const { image } = useImageUpload();

  console.log("Resultado de la predicción:", prediction);
  console.log("Imagen analizada:", image);

  const classColor: Record<string, string> = {
    antracnosis: "#e74c3c",
    pudricion: "#f39c12",
    saludable: "#2ecc71",
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
          fontSize: 40,
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
          fontSize: 18,
        }}
      >
        La imagen ha sido analizada exitosamente. Aquí están los resultados:
      </Text>
      <View style={{ marginVertical: 20, alignItems: "center", gap: 10 }}>
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
      </View>
      <Text style={{ color: "black", marginBottom: 15, fontSize: 16 }}>
        Probabilidad por clase:
      </Text>
      <Text style={{ fontWeight: "bold", color: "black" }}>Antracnosis</Text>
      <ProgressBar
        percentage={prediction?.raw_scores.antracnosis || 0}
        backgroundColor="#e74c3c"
      />
      <Text style={{ fontWeight: "bold", color: "black" }}>Pudricion</Text>
      <ProgressBar
        percentage={prediction?.raw_scores.pudricion || 0}
        backgroundColor="#f39c12"
      />
      <Text style={{ fontWeight: "bold", color: "black" }}>Saludable</Text>
      <ProgressBar
        percentage={prediction?.raw_scores.saludable || 0}
        backgroundColor="#2ecc71"
      />
    </View>
  );
}
