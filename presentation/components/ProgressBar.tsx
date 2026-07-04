import { View, Text } from "react-native";

export default function ProgressBar({
  percentage,
  backgroundColor,
  label,
  borderColor,
}: {
  percentage: number;
  backgroundColor: string;
  label?: string; // etiqueta opcional sobre la barra
  borderColor: string;
}) {
  const finalPercentage = Math.min(Math.max(percentage * 100, 0), 100);
  const displayText = `${parseFloat(finalPercentage.toFixed(1))}%`;

  return (
    <View style={{ width: "80%", marginBottom: 12 }}>
      {label && (
        <Text style={{ fontSize: 12, color: "#555", marginBottom: 3 }}>
          {label}
        </Text>
      )}
      <View
        style={{
          height: 28,
          backgroundColor: "#e0e0e0",
          borderWidth: 1,
          borderColor: borderColor,
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${finalPercentage}%`,
            height: "100%",
            backgroundColor: backgroundColor,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "flex-end",
            paddingRight: finalPercentage >= 20 ? 6 : 0,
          }}
        >
          {finalPercentage >= 20 && (
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 12 }}>
              {displayText}
            </Text>
          )}
        </View>
        {/* % fuera de la barra cuando el valor es muy bajo */}
        {finalPercentage < 20 && (
          <Text
            style={{
              color: "#444",
              fontWeight: "bold",
              fontSize: 12,
              marginLeft: 6,
            }}
          >
            {displayText}
          </Text>
        )}
      </View>
    </View>
  );
}
