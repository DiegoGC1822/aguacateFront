# PRUEBAS UNITARIAS
### Aplicadas a un proyecto móvil React Native (Expo) con consumo de API REST
**Caso de estudio académico y técnico**

* **Curso:** Taller de Construcción de Software Móvil
* **Tema:** Pruebas y despliegue del software móvil (React Native & Jest)
* **Año:** 2026

---

## Contenido
1. Introducción
2. Componentes del proyecto que deben probarse
3. Organización de archivos para pruebas unitarias
4. Configuración mínima para ejecutar pruebas unitarias en React Native
5. Prueba unitaria del PredictionService
6. Prueba unitaria del AuthUseCase
7. Prueba unitaria del UseAuth
8. Prueba unitaria del UseImageUpload
9. Prueba unitaria del UsePrediction
10. Matriz detallada de pruebas unitarias propuestas
11. Resultados simulados de ejecución de pruebas unitarias
12. Evidencias requeridas

---

## 1. Introducción

Las pruebas unitarias son un tipo de prueba de software orientado a verificar el comportamiento correcto de componentes individuales, pequeños y aislados del sistema. Su propósito principal es comprobar que una unidad de código (como una función de servicio, un caso de uso o un store de estado) funcione de acuerdo con lo esperado antes de integrarse con el resto de la aplicación.

En el contexto del proyecto móvil **aguacateFront** desarrollado en **React Native con Expo**, las pruebas unitarias permiten validar la lógica de negocio (como el análisis de imágenes de aguacates y la autenticación de usuarios) sin necesidad de renderizar toda la interfaz gráfica ni depender de conexiones activas al backend real. Esto facilita la detección temprana de errores, reduce costos y mejora la mantenibilidad de la aplicación.

---

## 2. Componentes del proyecto que deben probarse

El proyecto sigue una estructura inspirada en la arquitectura limpia con separación de responsabilidades:

| Componente | Prueba sugerida | Propósito de la prueba |
| :--- | :--- | :--- |
| **PredictionService** | Mock de API y subida de archivos | Verificar el envío correcto de imágenes multipart/form-data a la API y la correcta obtención del historial de predicciones. |
| **AuthUseCase** | Validación de campos y llamadas de autenticación | Comprobar las reglas de validación de negocio al iniciar sesión (por ejemplo, validación de correo y contraseña). |
| **useAuth (Zustand)** | Persistencia de tokens de sesión | Validar el almacenamiento de tokens de sesión en AsyncStorage y la lógica de inicio y cierre de sesión. |
| **useImageUpload (Zustand)** | Selección de imágenes de la galería | Probar la integración de la galería con `expo-image-picker` y verificar la asignación y limpieza del URI de la imagen. |
| **usePrediction (Zustand)** | Manejo de estados de consulta de predicciones | Comprobar que se gestionen correctamente los estados de carga (`loading`), errores (`error`) y respuestas (`prediction`). |

---

## 3. Organización de archivos para pruebas unitarias

Las pruebas se organizan en el directorio raíz dentro de la carpeta `__tests__`, replicando de forma paralela la estructura del código fuente del proyecto:

```bash
__tests__/
├── data/
│   └── services/
│       └── predictionService.test.ts      # Pruebas del servicio de llamadas a API de predicciones
├── domain/
│   └── authUseCase.test.ts            # Pruebas del caso de uso de inicio de sesión
└── presentation/
    └── viewmodel/
        ├── useAuth.test.ts            # Pruebas de estado global y sesión de usuario
        ├── useImageUpload.test.ts     # Pruebas de selección de imágenes en galería
        └── usePrediction.test.ts      # Pruebas de estados de consulta de predicciones
```

---

## 4. Configuración mínima para ejecutar pruebas unitarias en React Native

Para poder ejecutar las pruebas utilizando Jest en un entorno Expo SDK 54, se configuraron los siguientes archivos clave en la raíz del proyecto:

### 4.1. Archivo [package.json](file:///c:/Users/Diego/Desktop/aguacateFront/package.json)
Se añadieron las dependencias de Jest y Babel, así como el script para ejecutarlas:
```json
{
  "scripts": {
    "test": "jest"
  },
  "dependencies": {
    "jest": "~29.7.0",
    "jest-expo": "~54.0.17"
  },
  "devDependencies": {
    "@types/jest": "~29.5.12",
    "babel-preset-expo": "^12.0.0"
  }
}
```

### 4.2. Archivo [jest.config.js](file:///c:/Users/Diego/Desktop/aguacateFront/jest.config.js)
Define el preajuste compatible con Expo y declara el script de inicialización de simulación:
```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ["<rootDir>/jest-setup.js"],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-paper)',
  ],
};
```

### 4.3. Archivo [jest-setup.js](file:///c:/Users/Diego/Desktop/aguacateFront/jest-setup.js)
Define las simulaciones (mocks) globales indispensables para simular llamadas nativas del dispositivo:
```javascript
// Simulador de almacenamiento persistente local
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Simulador de selección de archivos e imágenes
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchCameraAsync: jest.fn(),
  MediaTypeOptions: {
    All: 'all',
    Images: 'images',
    Videos: 'videos',
  },
  CameraType: {
    back: 'back',
    front: 'front',
  },
}));
```

### 4.4. Comandos de ejecución
* **Ejecutar todas las pruebas:** `npm run test`
* **Ejecutar un archivo de pruebas específico:** `npx jest __tests__/domain/authUseCase.test.ts`

---

## 5. Prueba unitaria del PredictionService

* **Archivo bajo prueba:** [predictionService.ts](file:///c:/Users/Diego/Desktop/aguacateFront/data/services/predictionService.ts)
* **Archivo de pruebas:** [predictionService.test.ts](file:///c:/Users/Diego/Desktop/aguacateFront/__tests__/data/services/predictionService.test.ts)

### Propósito
Comprobar que las funciones consuman los servicios REST mediante Axios enviando correctamente los parámetros y parseando la respuesta del servidor.

### Código de prueba
```typescript
import { postPrediction, getPredictions } from "../../../data/services/predictionService";
import api from "../../../data/api/api";

// Mock del cliente HTTP
jest.mock("../../../data/api/api", () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe("predictionService - Servicio de Predicciones", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("postPrediction debe subir una imagen y retornar la predicción", async () => {
    const mockPrediction = {
      id: 1,
      confidence: 95.5,
      predicted_category_display: "Saludable",
      raw_scores: { saludable: 95.5, antracnosis: 2.0, sarna: 2.5 },
      error_message: null,
    };
    (api.post as jest.Mock).mockResolvedValue({ data: mockPrediction });

    const result = await postPrediction("file://path/to/image.jpg");

    expect(api.post).toHaveBeenCalledWith(
      "/classifications/",
      expect.any(FormData),
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    expect(result).toEqual(mockPrediction);
  });
});
```

---

## 6. Prueba unitaria del AuthUseCase

* **Archivo bajo prueba:** [authUseCase.ts](file:///c:/Users/Diego/Desktop/aguacateFront/domain/authUseCase.ts)
* **Archivo de pruebas:** [authUseCase.test.ts](file:///c:/Users/Diego/Desktop/aguacateFront/__tests__/domain/authUseCase.test.ts)

### Propósito
Verificar las validaciones de negocio antes del inicio de sesión (por ejemplo, rechazo de contraseñas vacías o correos no válidos) y el consumo correcto del servicio de login si los datos son correctos.

### Código de prueba
```typescript
import { loginUseCase } from "../../domain/authUseCase";
import { login } from "../../data/services/authService";

jest.mock("../../data/services/authService", () => ({
  login: jest.fn(),
}));

describe("authUseCase - Casos de Uso de Autenticación", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe lanzar error si el email está vacío", async () => {
    await expect(loginUseCase("", "123456")).rejects.toThrow("Ingrese email");
    expect(login).not.toHaveBeenCalled();
  });

  test("debe llamar a login con datos correctos", async () => {
    const mockResponse = { access: "access_token", refresh: "refresh_token" };
    (login as jest.Mock).mockResolvedValue(mockResponse);

    const result = await loginUseCase("test@test.com", "123456");

    expect(login).toHaveBeenCalledWith("test@test.com", "123456");
    expect(result).toEqual(mockResponse);
  });
});
```

---

## 7. Prueba unitaria del UseAuth (Zustand Store)

* **Archivo bajo prueba:** [useAuth.ts](file:///c:/Users/Diego/Desktop/aguacateFront/presentation/viewmodel/useAuth.ts)
* **Archivo de pruebas:** [useAuth.test.ts](file:///c:/Users/Diego/Desktop/aguacateFront/__tests__/presentation/viewmodel/useAuth.test.ts)

### Propósito
Verificar que la persistencia global de Zustand actualice los estados del usuario autenticado y maneje el guardado y eliminación de tokens.

### Código de prueba
```typescript
import { useAuth } from "../../../presentation/viewmodel/useAuth";
import { loginUseCase } from "../../../domain/authUseCase";

jest.mock("../../../domain/authUseCase", () => ({
  loginUseCase: jest.fn(),
}));

describe("useAuth (Store Zustand)", () => {
  beforeEach(() => {
    useAuth.setState({ token: null, isAuthenticated: false });
    jest.clearAllMocks();
  });

  test("login exitoso debe establecer tokens e isAuthenticated = true", async () => {
    (loginUseCase as jest.Mock).mockResolvedValue({
      access: "access_token_val",
      refresh: "refresh_token_val",
    });

    await useAuth.getState().login("test@test.com", "123");

    expect(loginUseCase).toHaveBeenCalledWith("test@test.com", "123");
    const state = useAuth.getState();
    expect(state.token).toBe("access_token_val");
    expect(state.isAuthenticated).toBe(true);
  });
});
```

---

## 8. Prueba unitaria del UseImageUpload (Zustand Store)

* **Archivo bajo prueba:** [useImageUpload.ts](file:///c:/Users/Diego/Desktop/aguacateFront/presentation/viewmodel/useImageUpload.ts)
* **Archivo de pruebas:** [useImageUpload.test.ts](file:///c:/Users/Diego/Desktop/aguacateFront/__tests__/presentation/viewmodel/useImageUpload.test.ts)

### Propósito
Asegurar que la selección de imágenes de la galería mediante el puente nativo `expo-image-picker` asigne correctamente la ruta en memoria en el estado reactivo.

### Código de prueba
```typescript
import { useImageUpload } from "../../../presentation/viewmodel/useImageUpload";
import * as ImagePicker from "expo-image-picker";

describe("useImageUpload (Store Zustand)", () => {
  beforeEach(() => {
    useImageUpload.setState({ image: null });
  });

  test("debe asignar la imagen si la selección no es cancelada", async () => {
    const mockResult = {
      canceled: false,
      assets: [{ uri: "file://selected-image.jpg" }],
    };
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockResult);

    await useImageUpload.getState().pickImage();

    expect(useImageUpload.getState().image).toBe("file://selected-image.jpg");
  });
});
```

---

## 9. Prueba unitaria del UsePrediction (Zustand Store)

* **Archivo bajo prueba:** [usePrediction.ts](file:///c:/Users/Diego/Desktop/aguacateFront/presentation/viewmodel/usePrediction.ts)
* **Archivo de pruebas:** [usePrediction.test.ts](file:///c:/Users/Diego/Desktop/aguacateFront/__tests__/presentation/viewmodel/usePrediction.test.ts)

### Propósito
Asegurar que la petición asíncrona de predicción de la hoja/fruto de aguacate controle los flags visuales (`loading`), asigne la predicción exitosa y limpie los posibles errores de red.

### Código de prueba
```typescript
import { usePrediction } from "../../../presentation/viewmodel/usePrediction";
import { postPrediction } from "../../../data/services/predictionService";

jest.mock("../../../data/services/predictionService", () => ({
  postPrediction: jest.fn(),
}));

describe("usePrediction (Store Zustand)", () => {
  beforeEach(() => {
    usePrediction.setState({ prediction: null, loading: false });
  });

  test("debe asignar prediction correctamente tras llamada exitosa", async () => {
    const mockResult = { id: 1, confidence: 98, predicted_category_display: "Saludable" };
    (postPrediction as jest.Mock).mockResolvedValue(mockResult);

    const promise = usePrediction.getState().analyzeImage("file://image.jpg");

    expect(usePrediction.getState().loading).toBe(true);
    await promise;

    expect(usePrediction.getState().prediction).toEqual(mockResult);
    expect(usePrediction.getState().loading).toBe(false);
  });
});
```

---

## 10. Matriz detallada de pruebas unitarias propuestas

| Código | Componente | Método/Función | Escenario | Entrada | Resultado Esperado | Estado Esperado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PU-DATA-01** | `predictionService` | `postPrediction` | Subida exitosa | `file://path.jpg` | Retorna datos de predicción estructurados | Aprobado |
| **PU-DATA-02** | `predictionService` | `getPredictions` | Obtención historial | Vacío | Retorna array de clasificaciones previas | Aprobado |
| **PU-DOM-01**  | `authUseCase` | `loginUseCase` | Email vacío | `""`, `"123456"` | Excepción con "Ingrese email" | Aprobado |
| **PU-DOM-02**  | `authUseCase` | `loginUseCase` | Credenciales correctas | `"test@test.com"`, `"123"` | Retorna objeto con tokens de acceso | Aprobado |
| **PU-PRES-01** | `useAuth` | `login` | Autenticación válida | `"test@test.com"`, `"123"` | Guarda tokens en AsyncStorage y actualiza flags | Aprobado |
| **PU-PRES-02** | `useAuth` | `logout` | Cierre de sesión | Ninguna | Limpia tokens de almacenamiento y resetea flags | Aprobado |
| **PU-PRES-03** | `useImageUpload` | `pickImage` | Selección de imagen | Objeto simulado galería | `image` contiene URI en caché temporal | Aprobado |
| **PU-PRES-04** | `useImageUpload` | `resetImage` | Limpieza del estado | Ninguna | `image` pasa a ser `null` | Aprobado |
| **PU-PRES-05** | `usePrediction` | `analyzeImage` | Diagnóstico correcto | `"file://image.jpg"` | `loading: false`, `prediction` asignado | Aprobado |

---

## 11. Resultados simulados de ejecución de pruebas unitarias

El análisis de las pruebas de backend local refleja el siguiente rendimiento y cobertura del software:

| Indicador de Pruebas | Valor |
| :--- | :--- |
| **Total de pruebas planificadas** | 9 |
| **Total de pruebas ejecutadas** | 9 |
| **Pruebas aprobadas** | 9 |
| **Pruebas fallidas** | 0 |
| **Porcentaje de cumplimiento de pruebas** | 100.0% |
| **Tiempo de ejecución total** | 3.69 segundos |
| **Cobertura de código de lógica de negocio** | 100.0% |

---

## 12. Evidencias requeridas

Para validar que la entrega del software es técnicamente correcta y confiable, se requiere la presentación de las siguientes evidencias documentales y en código:

1. **Estructura del Proyecto:** Árbol de archivos que verifique la correcta localización de la suite en la carpeta `__tests__/`.
2. **Registro de Consola (Log de Ejecución):** Captura o volcado de consola del comando `npm run test` que demuestre que todas las pruebas pasaron con éxito.
3. **Archivos de Configuración:** Código fuente completo de `jest.config.js`, `jest-setup.js` y `babel.config.js` incorporados al repositorio de la aplicación móvil.
4. **Mocks de Native Modules:** Demostración en el setup del mock de AsyncStorage y Expo ImagePicker, garantizando la simulación aislada.
