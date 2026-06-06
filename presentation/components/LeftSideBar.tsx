import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../viewmodel/useAuth";
import { Image } from "react-native";

export default function LeftSidebar() {
  const [expanded, setExpanded] = useState(false);
  const widthAnim = useRef(new Animated.Value(70)).current;

  const { logout } = useAuth();

  const toggleSidebar = () => {
    const newValue = expanded ? 70 : 220;

    Animated.timing(widthAnim, {
      toValue: newValue,
      duration: 250,
      useNativeDriver: false,
    }).start();

    setExpanded(!expanded);
  };

  const go = (route: string) => {
    router.push(route);
    setExpanded(false);
    Animated.timing(widthAnim, {
      toValue: 70,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <Animated.View style={[styles.sidebar, { width: widthAnim }]}>
      {/* Toggle */}
      {expanded ? (
        <Image
          source={require("../../assets/logo.png")}
          style={{ width: 150, height: 30, marginBottom: 20 }}
        />
      ) : (
        <Image
          source={require("../../assets/palta.png")}
          style={{ width: 30, height: 42, marginBottom: 20 }}
        />
      )}
      <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
        <Text style={styles.menuText}>☰</Text>
      </TouchableOpacity>

      {/* MENU */}
      {expanded && (
        <View style={styles.options}>
          <TouchableOpacity style={styles.item} onPress={() => go("/home")}>
            <Ionicons name="home" size={20} color="white" />
            <Text style={styles.text}>Inicio</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => go("/profile")}>
            <Ionicons name="person" size={20} color="white" />
            <Text style={styles.text}>Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => go("/addImage")}>
            <Ionicons name="camera" size={20} color="white" />
            <Text style={styles.text}>Analizar Imagen</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <Ionicons name="list" size={20} color="white" />
            <Text style={styles.text}>Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.item, { marginTop: 375 }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color="white" />
            <Text style={styles.text}>Salir</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 999,
    elevation: 10,
    backgroundColor: "#37c534",
    width: 70,
    paddingTop: 50,
    alignItems: "center",
  },
  menuButton: {
    padding: 10,
    backgroundColor: "#158000",
    borderRadius: 10,
    marginBottom: 20,
  },
  menuText: {
    color: "white",
    fontSize: 22,
  },
  options: {
    width: "100%",
    paddingLeft: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 10,
  },
  text: {
    color: "white",
    fontSize: 14,
    marginLeft: 10,
  },
});
