// presentation/components/AppToast.tsx
// Toast reutilizable basado en Snackbar de react-native-paper

import React from "react";
import { Snackbar, Text } from "react-native-paper";
import { StyleSheet } from "react-native";

export type ToastType = "success" | "error" | "info";

interface AppToastProps {
  visible: boolean;
  message: string;
  type: ToastType;
  onDismiss: () => void;
  duration?: number;
  hasSidebar?: boolean;
}

const BACKGROUND_COLORS: Record<ToastType, string> = {
  success: "#2c7a2c",
  error: "#c0392b",
  info: "#2980b9",
};

export default function AppToast({
  visible,
  message,
  type,
  onDismiss,
  duration = 3000,
  hasSidebar = false,
}: AppToastProps) {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      style={[styles.snackbar, { backgroundColor: BACKGROUND_COLORS[type] }]}
      wrapperStyle={[
        styles.wrapper,
        hasSidebar ? { paddingLeft: 70 } : undefined
      ]}
      theme={{ colors: { inversePrimary: "white" } }}
      action={{
        label: "✕",
        labelStyle: styles.actionLabel,
        onPress: onDismiss,
      }}
    >
      <Text numberOfLines={2} style={styles.messageText}>
        {message}
      </Text>
    </Snackbar>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    top: 10,
    bottom: undefined,
  },
  snackbar: {
    borderRadius: 8,
    minHeight: 40,
    paddingVertical: 0,
  },
  actionLabel: {
    color: "white",
    fontWeight: "bold",
    marginHorizontal: 0,
  },
  messageText: {
    color: "white",
    fontSize: 12,
    lineHeight: 20,
  }
});
