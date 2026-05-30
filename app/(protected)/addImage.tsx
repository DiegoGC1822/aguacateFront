import { View, Image } from "react-native";
import { Text, Button } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePrediction } from "../../presentation/viewmodel/usePrediction";
import { useImageUpload } from "../../presentation/viewmodel/useImageUpload";
import { router } from "expo-router";

export default function ImageUploader() {
  const { pickImage, takePhoto, image, resetImage } = useImageUpload();
  const { analyzeImage } = usePrediction();

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
      <Text
        variant="displaySmall"
        style={{
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
        {image && (
          <Button
            mode="contained"
            onPress={handleAnalyze}
            style={{
              backgroundColor: "blue",
              marginTop: 20,
            }}
            icon={() => <Ionicons name="analytics" size={20} color="white" />}
          >
            <Text style={{ fontWeight: "bold", color: "white" }}>Analizar</Text>
          </Button>
        )}
        <Button
          mode="contained"
          onPress={pickImage}
          style={{
            backgroundColor: "#37c534",
            marginTop: 20,
          }}
          icon={() => <Ionicons name="image" size={20} color="white" />}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>
            Cargar Imagen
          </Text>
        </Button>
        <Button
          mode="contained"
          onPress={takePhoto}
          style={{
            backgroundColor: "#37c534",
            marginTop: 20,
          }}
          icon={() => <Ionicons name="camera" size={20} color="white" />}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>Tomar Foto</Text>
        </Button>
        {image && (
          <Button
            mode="contained"
            onPress={resetImage}
            style={{
              backgroundColor: "red",
              marginTop: 20,
            }}
            icon={() => (
              <Ionicons name="close-circle" size={20} color="white" />
            )}
          >
            <Text style={{ fontWeight: "bold", color: "white" }}>
              Cancelar análisis
            </Text>
          </Button>
        )}
      </View>
    </View>
  );
}
