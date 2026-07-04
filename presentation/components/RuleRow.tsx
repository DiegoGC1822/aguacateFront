import { Text, View } from "react-native";

export const RuleRow = ({ ok, label }: { ok: boolean; label: string }) => (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 3 }}>
        <Text style={{ color: ok ? "#2c7a2c" : "#c0392b", fontSize: 14, marginRight: 6 }}>
            {ok ? "✓" : "✗"}
        </Text>
        <Text style={{ color: ok ? "#2c7a2c" : "#c0392b", fontSize: 13 }}>
            {label}
        </Text>
    </View>
);