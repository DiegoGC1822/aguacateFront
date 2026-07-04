import { View } from "react-native";

export const RulesPanel = ({ children }: { children: React.ReactNode }) => (
    <View
        style={{
            backgroundColor: "#f0faf0",
            borderRadius: 8,
            borderLeftWidth: 3,
            borderLeftColor: "#2c7a2c",
            padding: 10,
            marginBottom: 10,
        }}
    >
        {children}
    </View>
);