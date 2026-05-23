import { View, Text } from "react-native";

export default function ProgressBar({
  percentage,
  backgroundColor,
}: {
  percentage: number;
  backgroundColor: string;
}) {
  const finalPercentage = Math.min(Math.max(percentage * 100, 0), 100);

  return (
    <View
      style={{
        height: 21,
        backgroundColor: "#e0e0e0",
        borderRadius: 6,
        width: "80%",
        marginBottom: 10,
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: `${finalPercentage}%`,
          height: "100%",
          backgroundColor: backgroundColor,
          borderRadius: 6,
          alignItems: "flex-end",
        }}
      >
        {finalPercentage >= 20 && (
          <Text style={{ color: "white", fontWeight: "bold", paddingRight: 5 }}>
            {parseFloat(finalPercentage.toFixed(2))}
          </Text>
        )}
      </View>
      {finalPercentage < 20 && (
        <Text
          style={{
            color: "black",
            fontWeight: "bold",
          }}
        >
          {parseFloat(finalPercentage.toFixed(2))}%
        </Text>
      )}
    </View>
  );
}
