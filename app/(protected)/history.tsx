import { View, Text, ScrollView } from "react-native";
import CardResult from "../../presentation/components/CardResult";
import ModalResult from "../../presentation/components/ModalResult";
import { useState, useEffect } from "react";
import { usePrediction } from "../../presentation/viewmodel/usePrediction";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const [showDetails, setShowDetails] = useState(false);
  const { history, getHistory, loading } = usePrediction();
  const [selectPrediction, setSelectPrediction] = useState({
    id: 3000,
    predicted_category_display: "",
    confidence: 0,
    raw_scores: {
      saludable: 0,
      antracnosis: 0,
      sarna: 0,
    },
    image: "",
    error_message: null,
    classified_at: "",
    status: "",
  });

  useEffect(() => {
    getHistory();
  }, []);

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
          Cargando datos..
        </Text>
      </View>
    );
  }

  console.log(history);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d7f4d7" }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
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
              marginTop: 0,
              marginBottom: 10,
              color: "black",
              textAlign: "center",
              fontSize: 30,
            }}
          >
            Historial de resultados
          </Text>
          <View style={{ width: "95%", gap: 10 }}>
            {history && history.length > 0 ? (
              history.map((prediction) => (
                <CardResult
                  key={String(prediction.id)}
                  prediction={prediction}
                  setShowDetails={setShowDetails}
                  setSelectPrediction={setSelectPrediction}
                />
              ))
            ) : (
              <Text style={{ textAlign: "center", color: "black" }}>
                No hay resultados
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
      <ModalResult
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        prediction={selectPrediction}
      />
    </SafeAreaView>
  );
}
