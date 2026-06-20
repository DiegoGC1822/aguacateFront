import { View, Image, TouchableOpacity, Text } from "react-native";
import { PredictionResponse } from "../../types";
import { Dispatch, SetStateAction } from "react";

interface CardResultProps {
  prediction: PredictionResponse;
  setShowDetails: Dispatch<SetStateAction<boolean>>;
  setSelectPrediction: Dispatch<SetStateAction<any>>;
}

export default function CardResult({
  prediction,
  setShowDetails,
  setSelectPrediction,
}: CardResultProps) {
  let color = { backgroundColor: "#c4c4c4", borderColor: "#c4c4c4" };
  let fecha;

  switch (prediction.predicted_category_display) {
    case "Sarna":
      color.backgroundColor = "#DFF38D";
      color.borderColor = "#f39c12";
      break;
    case "Antracnosis":
      color.backgroundColor = "#F38D8D";
      color.borderColor = "#e74c3c";
      break;
    case "Saludable":
      color.backgroundColor = "#8FF38D";
      color.borderColor = "#2ecc71";
      break;
    default:
      break;
  }

  if (prediction.classified_at) {
    const fechaCompleta = prediction.classified_at;
    fecha = fechaCompleta.split("T")[0];
  } else {
    fecha = "No encontrado";
  }

  const handleSelect = () => {
    setSelectPrediction(prediction);
    setShowDetails(true);
  };

  return (
    <View
      style={{
        backgroundColor: color.backgroundColor,
        borderColor: color.borderColor,
        opacity: 10,
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <Image
          source={{ uri: prediction.image }}
          style={{
            width: 110,
            height: 110,
            borderRadius: 10,
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            gap: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Estado</Text>
            <Text style={{ color: color.borderColor, fontWeight: "bold" }}>
              {prediction?.predicted_category_display || "Error"}
            </Text>
          </View>
          <Text style={{ fontWeight: "bold" }}>Fecha: {fecha || "Error"}</Text>
          <Text style={{ fontWeight: "bold" }}>
            Confianza: {Math.round((prediction?.confidence || 0) * 100)}%
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: "#23cafd", padding: 2, borderRadius: 4 }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
              }}
              onPress={handleSelect}
            >
              Ver detalle
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
