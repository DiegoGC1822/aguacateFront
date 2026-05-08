import { View, Text } from "react-native";

export default function HistoryScreen() {
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
          color: "black",
          textAlign: "center",
          fontSize: 24,
        }}
      >
        En progreso...
      </Text>
    </View>
  );
}
