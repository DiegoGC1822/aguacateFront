import { View, Text, Image } from "react-native";
import ProgressBar from "../../components/ProgressBar";
import { usePrediction } from "../../store/usePrediction";
import { useImageUpload } from "../../store/useImageUpload";

export default function AnalysisResult() {
  const { prediction } = usePrediction();
  const { image } = useImageUpload();

  console.log("Resultado de la predicción:", prediction);
  console.log("Imagen analizada:", image);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#d7f4d7",
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
          style={{ width: 200, height: 200, borderRadius: 10, marginBottom: 20 }}
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
              backgroundColor: prediction?.color || "#ccc",
              padding: 5,
              borderRadius: 20,
            }}
          >
            {prediction?.clase}
          </Text>
        </View>
        <Text style={{ color: "black" }}>
          Confianza: {prediction?.confianza}%
        </Text>
      </View>
      <Text style={{ color: "black", marginBottom: 15, fontSize: 16 }}>
        Probabilidad por clase:
      </Text>
      <Text style={{ fontWeight: "bold", color: "black" }}>Antracnosis</Text>
      <ProgressBar
        percentage={prediction?.todas.Antracnosis || 0}
        backgroundColor="#e74c3c"
      />
      <Text style={{ fontWeight: "bold", color: "black" }}>Sarna</Text>
      <ProgressBar
        percentage={prediction?.todas["Roña / Sarna"] || 0}
        backgroundColor="#f39c12"
      />
      <Text style={{ fontWeight: "bold", color: "black" }}>Sano</Text>
      <ProgressBar
        percentage={prediction?.todas.Sano || 0}
        backgroundColor="#2ecc71"
      />
    </View>
  );
}
