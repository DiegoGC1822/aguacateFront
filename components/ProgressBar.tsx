import { View, Text } from "react-native";

export default function ProgressBar({
  percentage,
  backgroundColor,
}: {
  percentage: number;
  backgroundColor: string;
}) {
  return (
    <View style={{ width: "90%", marginVertical: 5 }}>
      <View
        style={{
          width: "100%",
          height: 20,
          backgroundColor: "#e0e0e0",
          borderRadius: 6,
          position: "relative",
        }}
      >
        <View
          style={{
            position: "absolute",
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: backgroundColor,
            borderRadius: 6,
          }}
        />

        <View
          style={{
            position: "absolute",
            left: `${percentage}%`,
            transform: [
              {
                translateX: percentage < 10 ? 0 : -54,
              },
            ],
            height: "100%",
            justifyContent: "center",
            paddingLeft: 4,
          }}
        >
          <Text
            style={{
              color: "black",
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {percentage}%
          </Text>
        </View>
      </View>
    </View>
  );
}
