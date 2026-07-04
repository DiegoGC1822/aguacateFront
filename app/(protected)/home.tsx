import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  UIManager,
  LayoutAnimation,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useAuth } from "../../presentation/viewmodel/useAuth";
import { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "¿Cómo tomo la foto correctamente?",
    answer:
      "Para obtener un buen diagnóstico, toma la foto a una distancia de 15 a 25 cm del aguacate utilizando " +
      "luz natural y evitando sombras directas o reflejos fuertes. Asegúrate de que el fondo sea lo más " +
      "uniforme posible sin objetos distractores y verifica que la imagen no esté borrosa antes de enviarla.",
  },
  {
    question: "¿Qué significan el 'Grado de certeza' y 'Nivel de confianza'?",
    answer:
      "El 'Grado de certeza' indica qué tanto se alinean los síntomas visuales de tu fruto con una plaga o " +
      "enfermedad específica de nuestro sistema, mientras que el 'Nivel de confianza' representa la seguridad " +
      "general que tiene la aplicación sobre el resultado final basándose en la claridad de las características encontradas.",
  },
  {
    question: "¿Cómo puedo cambiar una foto si me equivoqué?",
    answer:
      "No te preocupes, en la pantalla de carga verás una vista previa junto al botón 'Quitar imagen' (con el " +
      "ícono de un bote de basura). Al presionarlo, la foto se eliminará por completo del flujo de la pantalla " +
      "actual para que puedas seleccionar o capturar una nueva sin alterar tu historial.",
  },
  {
    question: "¿Cómo escaneo un nuevo fruto tras ver el resultado?",
    answer:
      "Una vez que revises el diagnóstico en pantalla, encontrarás un botón principal de color verde llamado " +
      "'Realizar otro análisis' con el ícono de una cámara. Al pulsarlo, la aplicación te redirigirá " +
      "automáticamente a la pantalla de captura para iniciar un nuevo proceso de forma rápida.",
  },
  {
    question: "¿Puedo guardar o compartir el reporte?",
    answer:
      "Sí, en la pantalla de resultados, justo debajo de la opción de nuevo análisis, verás el botón secundario " +
      "'Exportar a PDF'. Al presionarlo, se generará un documento digital limpio con todos los detalles " +
      "de la evaluación listo para guardarse en el almacenamiento de tu teléfono o compartirse por aplicaciones de mensajería.",
  },
];

const FaqAccordionItem = ({ item }: { item: FaqItem }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => !prev);
  };

  return (
    <View
      style={{
        marginBottom: 8,
        borderRadius: 10,
        backgroundColor: "white",
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      }}
    >
      <TouchableOpacity
        onPress={toggle}
        activeOpacity={0.8}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 14,
        }}
      >
        <Text style={{ flex: 1, fontSize: 14, fontWeight: "600", color: "#1a1a1a" }}>
          {item.question}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color="#2c7a2c"
        />
      </TouchableOpacity>

      {open && (
        <View
          style={{
            paddingHorizontal: 14,
            paddingBottom: 14,
            borderTopWidth: 1,
            borderTopColor: "#f0faf0",
          }}
        >
          <Text style={{ fontSize: 13, color: "#444", lineHeight: 20 }}>
            {item.answer}
          </Text>
        </View>
      )}
    </View>
  );
};

// ─── Componente acordeón principal ───────────────────────────────────────────
const FaqAccordion = ({ items }: { items: FaqItem[] }) => (
  <View>
    {items.map((item, index) => (
      <FaqAccordionItem key={index} item={item} />
    ))}
  </View>
);

// ─── Pantalla Home ────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { profile, getProfile, isHydrated } = useAuth();

  useEffect(() => {
    if (isHydrated) {
      getProfile();
    }
  }, [isHydrated]);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2c7a2c" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#d7f4d7" }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingLeft: 80,
        paddingRight: 16,
        paddingVertical: 32,
      }}
    >
      {/* Saludo */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: "#1a1a1a",
          marginBottom: 4,
        }}
      >
        ¡Bienvenido, {profile?.first_name}!
      </Text>
      <Text style={{ fontSize: 16, color: "#555", marginBottom: 32 }}>
        ¿Qué prefieres hacer hoy?
      </Text>

      {/* FAQ */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#1a1a1a",
          marginBottom: 12,
        }}
      >
        ¿Tienes dudas?
      </Text>
      <FaqAccordion items={FAQ_ITEMS} />
    </ScrollView>
  );
}
