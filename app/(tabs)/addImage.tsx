import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text, Button } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { usePrediction } from "../../store/usePrediction";
import { useImageUpload } from "../../store/useImageUpload";

export default function ImageUploader() {
  const { analyzeImage, loading } = usePrediction();
  const { image, pickImage } = useImageUpload();

  const handleAnalyze = async () => {
    console.log("Analizando imagen:", image);
    if (image) {
      await analyzeImage(image);
      router.push("/result");
    }
  };

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
      <Text
        variant="headlineSmall"
        style={{ color: "gray", marginBottom: 20, textAlign: "center" }}
      >
        Selecciona una imagen para analizar su contenido
      </Text>
      <TouchableOpacity style={styles.container} onPress={pickImage}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={{
              width: 200,
              height: 200,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={32} color="#37c534" />
            <Text style={{ textAlign: "center", color: "#333" }}>
              Haz clic para seleccionar una imagen
            </Text>
            <Text style={{ color: "#37c534", fontWeight: "bold" }}>
              JPG, JPEG o PNG — máx. 10 MB
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <Button
        mode="contained"
        onPress={handleAnalyze}
        disabled={!image || loading}
        loading={loading}
        style={{
          backgroundColor: image ? "#37c534" : "#83f578",
          marginTop: 20,
          width: "80%",
        }}
        icon={() => <Ionicons name="camera" size={20} color="black" />}
      >
        <Text style={{ color: image ? "white" : "gray", fontWeight: "bold" }}>
          Analizar Imagen
        </Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    borderWidth: 1.5,
    borderColor: "#37c534",
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: "#f0fdf0",
    padding: 50,
    alignItems: "center",
  },
  placeholder: {
    alignItems: "center",
    gap: 8,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
});
