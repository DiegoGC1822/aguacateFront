import React from "react";
import { View, StyleSheet } from "react-native";
import { Modal, Text, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export type ModalType = "error" | "success" | "info";

interface AppModalProps {
  visible: boolean;
  type: ModalType;
  title: string;
  message: string;
  onDismiss: () => void;
  actionLabel?: string;
  hasSidebar?: boolean;
}

const ICON_CONFIG: Record<
  ModalType,
  { name: React.ComponentProps<typeof Ionicons>["name"]; color: string }
> = {
  error: { name: "close-circle", color: "#c0392b" },
  success: { name: "checkmark-circle", color: "#2c7a2c" },
  info: { name: "information-circle", color: "#2980b9" },
};

const BUTTON_COLORS: Record<ModalType, string> = {
  error: "#c0392b",
  success: "#2c7a2c",
  info: "#2980b9",
};

export default function AppModal({
  visible,
  type,
  title,
  message,
  onDismiss,
  actionLabel = "Cerrar",
  hasSidebar = false,
}: AppModalProps) {
  const icon = ICON_CONFIG[type];

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={[styles.container, hasSidebar ? { marginLeft: 115 } : undefined]}
    >
      <View style={styles.iconRow}>
        <Ionicons name={icon.name} size={48} color={icon.color} />
      </View>

      <Text style={[styles.title, { color: icon.color }]}>{title}</Text>

      <Text style={styles.message}>{message}</Text>

      <Button
        mode="contained"
        onPress={onDismiss}
        style={[styles.button, { backgroundColor: BUTTON_COLORS[type] }]}
        labelStyle={styles.buttonLabel}
      >
        {actionLabel}
      </Button>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 32,
    alignItems: "center",
    gap: 12,
  },
  iconRow: {
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 8,
  },
  button: {
    width: "100%",
    marginTop: 4,
  },
  buttonLabel: {
    color: "white",
    fontWeight: "bold",
  },
});
