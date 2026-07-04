# PRUEBAS UNITARIAS
### Aplicadas a un proyecto móvil React Native con consumo de API REST
**Caso de estudio académico y técnico**

* **Curso:** Taller de Construcción de Software Móvil
* **Tema:** Pruebas y despliegue del software móvil (React Native & Jest)
* **Año:** 2026

---

## Contenido
1. Concepto de pruebas unitarias
2. Importancia de las pruebas unitarias en el proyecto móvil
3. Componentes del proyecto que deben probarse
4. Organización recomendada de archivos para pruebas unitarias
5. Configuración mínima para ejecutar pruebas unitarias en React Native
6. Prueba unitaria del PredictionService
7. Prueba unitaria del loginUseCase
8. Prueba unitaria del registerUseCase
9. Prueba unitaria del UploadUseCase
10. Prueba unitaria del useAuth (Zustand)
11. Prueba unitaria del useImageUpload (Zustand)
12. Prueba unitaria del usePrediction (Zustand)
13. Matriz detallada de pruebas unitarias propuestas
14. Resultados simulados de ejecución de pruebas unitarias
15. Evidencias requeridas
16. Criterios de aprobación
17. Conclusión

---

## 1. Concepto de pruebas unitarias

Las pruebas unitarias son un tipo de prueba de software orientado a verificar el comportamiento correcto de componentes pequeños, específicos y aislados del sistema. Su propósito principal es comprobar que una unidad de código, como una función, método, caso de uso o ViewModel/Store de estado, funcione de acuerdo con lo esperado antes de integrarse con otros componentes del sistema.

En el contexto del proyecto móvil desarrollado en React Native con Expo, las pruebas unitarias permiten validar la lógica interna de la aplicación sin necesidad de ejecutar toda la interfaz gráfica ni depender directamente del backend. Esto facilita la detección temprana de errores, reduce el costo de corrección y mejora la confiabilidad del sistema antes de realizar pruebas funcionales o de integración.

Las pruebas unitarias son especialmente importantes en proyectos organizados bajo Arquitectura Limpia y MVVM/Clean Architecture, debido a que cada capa del sistema tiene responsabilidades separadas. Por ello, es posible probar de manera independiente los servicios de datos, los validadores, los casos de uso y los ViewModels.

---

## 2. Importancia de las pruebas unitarias en el proyecto móvil

En una aplicación móvil que consume servicios RESTful, las pruebas unitarias permiten verificar que los datos recibidos desde la API sean interpretados correctamente, que las reglas de negocio se cumplan, que los formularios validen datos adecuados antes del envío y que los estados de la interfaz sean gestionados correctamente desde los controladores o stores.

En este caso de estudio, la aplicación móvil permite iniciar sesión, recibir un token JWT, subir imágenes de aguacates para su análisis de enfermedades, listar el historial de análisis anteriores y actualizar datos de perfil o contraseñas. Por ello, las pruebas unitarias ayudan a comprobar que cada parte de la lógica de negocio funcione antes de conectarse con el backend real:

* Detectan errores de forma temprana durante el desarrollo de nuevas pantallas.
* Permiten verificar componentes y lógica de negocio de manera aislada sin depender del backend.
* Facilitan la refactorización segura al cambiar lógica de componentes internos.
* Mejoran la mantenibilidad y documentación viva del código del proyecto.
* Reducen riesgos en el despliegue al asegurar que el núcleo de lógica no se vea comprometido.

---

## 3. Componentes del proyecto que deben probarse

El proyecto sigue una estructura inspirada en la arquitectura limpia con separación de responsabilidades:

| Componente | Prueba sugerida | Propósito de la prueba |
| :--- | :--- | :--- |
| **PredictionService** | Mock de API y llamadas HTTP | Verificar el envío correcto de imágenes multipart/form-data a la API y la correcta obtención del historial de predicciones. |
| **loginUseCase** | Validación de campos y llamadas de inicio de sesión | Comprobar las reglas de validación de negocio al iniciar sesión (validación de campos obligatorios). |
| **registerUseCase** | Validación de campos complejos y llamadas de registro | Comprobar las reglas de negocio al registrarse (formatos de email, longitud de nombres y validaciones de contraseña fuerte). |
| **UploadUseCase** | Validación de perfil y cambio de contraseña | Comprobar las reglas al modificar datos personales del usuario y verificar que la fortaleza de contraseña coincida con los requisitos. |
| **useAuth (Zustand)** | Persistencia de tokens de sesión | Validar el almacenamiento de tokens de sesión y la lógica de inicio y cierre de sesión de usuario en el store global. |
| **useImageUpload (Zustand)** | Selección y limpieza de imágenes | Probar la integración de la galería con `expo-image-picker` y verificar la asignación y limpieza del URI de la imagen. |
| **usePrediction (Zustand)** | Gestión de estados de predicciones | Comprobar que se gestionen correctamente los estados de carga (`loading`), errores (`error`) y respuestas (`prediction`). |

---

## 4. Organización recomendada de archivos para pruebas unitarias

Las pruebas unitarias deben ubicarse dentro de la carpeta `__tests__` en la raíz del proyecto. Se recomienda organizar los archivos de prueba siguiendo la misma estructura lógica del proyecto:

```bash
__tests__/
├── data/
│   └── services/
│       └── predictionService.test.ts      # Pruebas del servicio de llamadas a API de predicciones
├── domain/
│   ├── loginUseCase.test.ts           # Pruebas del caso de uso de inicio de sesión
│   ├── registerUseCase.test.ts        # Pruebas de reglas de registro de usuario
│   └── UploadUseCase.test.ts          # Pruebas de perfil y cambio de contraseña
└── presentation/
    └── viewmodel/
        ├── useAuth.test.ts            # Pruebas de estado global y sesión de usuario
        ├── useImageUpload.test.ts     # Pruebas de selección de imágenes en galería
        └── usePrediction.test.ts      # Pruebas de estados de consulta de predicciones
```

---

## 5. Configuración mínima para ejecutar pruebas unitarias en React Native

Para poder ejecutar las pruebas utilizando Jest en un entorno Expo SDK 54, se configuraron los siguientes archivos clave en la raíz del proyecto:

### 5.1. Dependencias en `package.json`
Se añadieron las dependencias de Jest y Babel, así como el script para ejecutarlas:
```json
{
  "scripts": {
    "test": "jest"
  },
  "dependencies": {
    "jest-expo": "~54.0.17"
  },
  "devDependencies": {
    "@types/jest": "^29.5.14",
    "jest": "~29.7.0"
  }
}
```

### 5.2. Archivo `jest.config.js`
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

### 5.3. Archivo `jest-setup.js`
Define las simulaciones (mocks) globales indispensables para simular llamadas nativas del dispositivo:
```javascript
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

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

### 5.4. Comandos de ejecución
* **Ejecutar todas las pruebas:** `npm run test`
* **Ejecutar un archivo de pruebas específico:** `npx jest __tests__/domain/loginUseCase.test.ts`

---

## 6. Prueba unitaria del PredictionService

### 6.1. Propósito
El servicio `predictionService` se conecta directamente con la API REST a través de un cliente HTTP Axios. La prueba verifica que las llamadas envíen de forma correcta las solicitudes multipart para subida de fotos e historial y retornen las respuestas correctamente tipadas.

| Elemento | Descripción |
| :--- | :--- |
| **Componente evaluado** | `predictionService` |
| **Método evaluado** | `postPrediction` y `getPredictions` |
| **Entrada** | Ruta de imagen `file://path.jpg` / Historial mockeado |
| **Resultado esperado** | Parseo de respuesta JSON en tipado estructurado |
| **Tipo de prueba** | Prueba unitaria de servicio con mock HTTP |

### 6.2. Código de prueba
```typescript
import {
  postPrediction,
  getPredictions,
} from "../../../data/services/predictionService";
import api from "../../../data/api/api";

// Mock del módulo api
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
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    expect(result).toEqual(mockPrediction);
  });

  test("getPredictions debe retornar el historial", async () => {
    const mockHistory = [
      {
        id: 1,
        confidence: 95.5,
        predicted_category_display: "Saludable",
        raw_scores: { saludable: 95.5, antracnosis: 2.0, sarna: 2.5 },
        error_message: null,
        image: "http://res.cloudinary.com/test.jpg",
        classified_at: "2026-06-27T00:00:00Z",
        status: "success",
      },
    ];
    (api.get as jest.Mock).mockResolvedValue({ data: mockHistory });

    const result = await getPredictions();

    expect(api.get).toHaveBeenCalledWith("/classifications/history/");
    expect(result).toEqual(mockHistory);
  });
});
```

---

## 7. Prueba unitaria del loginUseCase

### 7.1. Propósito
El caso de uso `loginUseCase` gestiona el flujo del login en el dominio. Valida que los campos no estén vacíos y consume el servicio de autenticación.

| Elemento | Descripción |
| :--- | :--- |
| **Componente evaluado** | `loginUseCase` |
| **Método evaluado** | `loginUseCase` |
| **Entrada** | Email y contraseña |
| **Resultado esperado** | Lanzamiento de error correspondiente o retorno de tokens de sesión |
| **Tipo de prueba** | Prueba unitaria de caso de uso |

### 7.2. Código de prueba
```typescript
import { loginUseCase } from "../../domain/loginUseCase";
import { login } from "../../data/services/authService";

// Mock del servicio de autenticación
jest.mock("../../data/services/authService", () => ({
  login: jest.fn(),
}));

describe("loginUseCase - Casos de Uso de Inicio de Sesión", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe lanzar error si el email está vacío", async () => {
    await expect(loginUseCase("", "123456")).rejects.toThrow("Ingrese email");
    expect(login).not.toHaveBeenCalled();
  });

  test("debe lanzar error si la contraseña está vacía", async () => {
    await expect(loginUseCase("test@test.com", "")).rejects.toThrow("Ingrese contraseña");
    expect(login).not.toHaveBeenCalled();
  });Prueba unitaria del PredictionService
Prueba unitaria del loginUseCase
Prueba unitaria del registerUseCase
Prueba unitaria del UploadUseCase
Prueba unitaria de useAuth (Zustand)
Prueba unitaria de useImageUpload (Zustand)
Prueba unitaria de usePrediction (Zustand)

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

## 8. Prueba unitaria del registerUseCase

### 8.1. Propósito
El caso de uso `registerUseCase` valida las reglas del formulario de registro y llama al servicio de backend. Sus validaciones puras se prueban de manera síncrona en aislamiento.

| Elemento | Descripción |
| :--- | :--- |
| **Componente evaluado** | `registerUseCase` |
| **Método evaluado** | `validateNameField`, `validateEmailField`, `validatePasswordRules`, `validateRegisterForm`, `registerUseCase` |
| **Entrada** | Datos de formulario de registro |
| **Resultado esperado** | Validaciones correctas, lanzamiento de excepciones de reglas y envío al servicio |
| **Tipo de prueba** | Prueba unitaria de caso de uso y validaciones puras |

### 8.2. Código de prueba
```typescript
import {
  validateNameField,
  validateEmailField,
  validatePasswordRules,
  validateRegisterForm,
  registerUseCase,
} from "../../domain/registerUseCase";
import { register } from "../../data/services/authService";

// Mock del servicio de registro
jest.mock("../../data/services/authService", () => ({
  register: jest.fn(),
}));

describe("registerUseCase - Validaciones y Registro", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateNameField", () => {
    test("debe rechazar nombres vacíos o menores de 4 caracteres", () => {
      expect(validateNameField("")).toEqual({ hasValue: false, hasMinLength: false, isValid: false });
      expect(validateNameField("abc")).toEqual({ hasValue: true, hasMinLength: false, isValid: false });
    });

    test("debe aceptar nombres de 4 o más caracteres", () => {
      expect(validateNameField("Juan")).toEqual({ hasValue: true, hasMinLength: true, isValid: true });
    });
  });

  describe("validateEmailField", () => {
    test("debe rechazar emails vacíos o con formato inválido", () => {
      expect(validateEmailField("")).toEqual({ hasValue: false, hasValidFormat: false, isValid: false });
      expect(validateEmailField("invalid-email")).toEqual({ hasValue: true, hasValidFormat: false, isValid: false });
    });

    test("debe aceptar emails con formato correcto", () => {
      expect(validateEmailField("test@test.com")).toEqual({ hasValue: true, hasValidFormat: true, isValid: true });
    });
  });

  describe("validatePasswordRules", () => {
    test("debe evaluar fortaleza y coincidencia de contraseña", () => {
      expect(validatePasswordRules("Ab1", "Ab1")).toMatchObject({ hasMinLength: false, isValid: false });
      expect(validatePasswordRules("abcde123", "abcde123")).toMatchObject({ hasUppercase: false, isValid: false });
      expect(validatePasswordRules("Abcdefgh", "Abcdefgh")).toMatchObject({ hasNumber: false, isValid: false });
      expect(validatePasswordRules("Abcdefg1", "Abcdefg2")).toMatchObject({ passwordsMatch: false, isValid: false });
      expect(validatePasswordRules("Abcdefg1", "Abcdefg1")).toEqual({
        hasMinLength: true,
        hasUppercase: true,
        hasNumber: true,
        passwordsMatch: true,
        isValid: true,
      });
    });
  });

  describe("validateRegisterForm", () => {
    test("debe devolver formulario válido si todos los campos son correctos", () => {
      const result = validateRegisterForm("juan@test.com", "Juan1234", "Juan1234", "Juan", "Perez");
      expect(result.isFormValid).toBe(true);
    });

    test("debe devolver formulario inválido si algún campo falla", () => {
      const result = validateRegisterForm("invalid-email", "Juan1234", "Juan1234", "Juan", "Perez");
      expect(result.isFormValid).toBe(false);
    });
  });

  describe("registerUseCase (Acción Asíncrona)", () => {
    test("debe lanzar error de validación correspondiente si falla alguna regla", async () => {
      await expect(
        registerUseCase("", "Juan1234", "Juan1234", "Juan", "Perez")
      ).rejects.toThrow("Ingrese email");

      await expect(
        registerUseCase("juan@test.com", "123", "123", "Juan", "Perez")
      ).rejects.toThrow("La contraseña debe tener al menos 8 caracteres");

      expect(register).not.toHaveBeenCalled();
    });

    test("debe llamar a register si los datos son válidos", async () => {
      const mockUser = { id: 1, email: "juan@test.com" };
      (register as jest.Mock).mockResolvedValue(mockUser);

      const result = await registerUseCase("juan@test.com", "Juan1234", "Juan1234", "Juan", "Perez");

      expect(register).toHaveBeenCalledWith("juan@test.com", "Juan1234", "Juan1234", "Juan", "Perez");
      expect(result).toEqual(mockUser);
    });
  });
});
```

---

## 9. Prueba unitaria del UploadUseCase

### 9.1. Propósito
El caso de uso `UploadUseCase` maneja las validaciones y peticiones para modificar datos del usuario (actualización del perfil y cambio de contraseña). Sus funciones puras validan síncronamente y la lógica asíncrona interactúa con la API.

| Elemento | Descripción |
| :--- | :--- |
| **Componente evaluado** | `UploadUseCase` |
| **Método evaluado** | `validateUpdateProfileForm`, `validatePassword1`, `validatePassword2`, `validateChangePasswordForm`, `updateProfileUseCase`, `changePasswordUseCase` |
| **Entrada** | Datos de perfil (nombres/apellidos) y contraseñas |
| **Resultado esperado** | Validaciones correctas, lanzamiento de excepciones de reglas y llamadas exitosas a la API |
| **Tipo de prueba** | Prueba unitaria de caso de uso y validaciones puras |

### 9.2. Código de prueba
```typescript
import {
  validateUpdateProfileForm,
  validatePassword1,
  validatePassword2,
  validateChangePasswordForm,
  updateProfileUseCase,
  changePasswordUseCase,
} from "../../domain/UploadUseCase";
import { updateUserProfile, changePassword } from "../../data/services/authService";

// Mock de servicios de autenticación
jest.mock("../../data/services/authService", () => ({
  updateUserProfile: jest.fn(),
  changePassword: jest.fn(),
}));

describe("UploadUseCase - Actualización de Perfil y Contraseña", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateUpdateProfileForm", () => {
    test("debe validar correctamente el formulario de actualización de perfil", () => {
      const invalid = validateUpdateProfileForm("abc", "Perez");
      expect(invalid.isFormValid).toBe(false);
      expect(invalid.firstName.hasMinLength).toBe(false);

      const valid = validateUpdateProfileForm("Juan", "Perez");
      expect(valid.isFormValid).toBe(true);
    });
  });

  describe("validatePassword1 (Contraseña Actual)", () => {
    test("debe verificar que no esté vacía", () => {
      expect(validatePassword1("")).toEqual({ hasValue: false, isValid: false });
      expect(validatePassword1("123")).toEqual({ hasValue: true, isValid: true });
    });
  });

  describe("validatePassword2 (Nueva Contraseña)", () => {
    test("debe verificar fortaleza de contraseña", () => {
      expect(validatePassword2("123", "123")).toMatchObject({ hasMinLength: false, isValid: false });
      expect(validatePassword2("Abcdefgh1", "123")).toMatchObject({ hasMinLength: true, hasUppercase: true, hasNumber: true, isValid: true });
    });
  });

  describe("validateChangePasswordForm", () => {
    test("debe validar formulario completo", () => {
      const invalid = validateChangePasswordForm("", "123");
      expect(invalid.isFormValid).toBe(false);

      const valid = validateChangePasswordForm("contrasenaActual", "Abcdefgh1");
      expect(valid.isFormValid).toBe(true);
    });
  });

  describe("updateProfileUseCase", () => {
    test("debe lanzar error de validación si los datos no cumplen requisitos", async () => {
      await expect(updateProfileUseCase("", "Perez")).rejects.toThrow("Ingrese su nombre");
      await expect(updateProfileUseCase("abc", "Perez")).rejects.toThrow("El nombre debe tener al menos 4 caracteres");
      expect(updateUserProfile).not.toHaveBeenCalled();
    });

    test("debe llamar a updateUserProfile si datos son válidos", async () => {
      const mockProfile = { first_name: "Juan", last_name: "Perez" };
      (updateUserProfile as jest.Mock).mockResolvedValue(mockProfile);

      const result = await updateProfileUseCase("Juan", "Perez");
      expect(updateUserProfile).toHaveBeenCalledWith("Juan", "Perez");
      expect(result).toEqual(mockProfile);
    });
  });

  describe("changePasswordUseCase", () => {
    test("debe lanzar error si no se cumplen requisitos", async () => {
      await expect(changePasswordUseCase("", "NuevaContrasena1")).rejects.toThrow("Ingrese su contraseña");
      await expect(changePasswordUseCase("Actual", "123")).rejects.toThrow("La contraseña debe tener al menos 8 caracteres");
      expect(changePassword).not.toHaveBeenCalled();
    });

    test("debe llamar a changePassword si datos son válidos", async () => {
      (changePassword as jest.Mock).mockResolvedValue({ status: "success" });

      const result = await changePasswordUseCase("ActualPassword", "NuevaContrasena1");
      expect(changePassword).toHaveBeenCalledWith("ActualPassword", "NuevaContrasena1");
      expect(result).toEqual({ status: "success" });
    });
  });
});
```

---

## 10. Prueba unitaria del useAuth (Zustand)

### 10.1. Propósito
El store Zustand `useAuth` maneja el token de autenticación y el estado de la sesión. Las pruebas validan que el inicio de sesión asigne los tokens correctamente y el logout los remueva limpiamente.

| Elemento | Descripción |
| :--- | :--- |
| **Componente evaluado** | `useAuth` (Store Zustand) |
| **Método evaluado** | `login` y `logout` |
| **Entrada** | Credenciales de login / Cierre de sesión |
| **Resultado esperado** | Persistencia y limpieza de tokens y cambio de estado de sesión |
| **Tipo de prueba** | Prueba unitaria de ViewModel / Store |

### 10.2. Código de prueba
```typescript
import { useAuth } from "../../../presentation/viewmodel/useAuth";
import { loginUseCase } from "../../../domain/loginUseCase";
import { logout as logoutService } from "../../../data/services/authService";

// Mock de casos de uso y servicios
jest.mock("../../../domain/loginUseCase", () => ({
  loginUseCase: jest.fn(),
}));

jest.mock("../../../data/services/authService", () => ({
  logout: jest.fn(),
}));

describe("useAuth (Store Zustand / ViewModel de Autenticación)", () => {
  beforeEach(() => {
    useAuth.setState({
      token: null,
      tokenRefresh: null,
      isAuthenticated: false,
      isHydrated: false,
      profile: null,
    });
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
    expect(state.tokenRefresh).toBe("refresh_token_val");
    expect(state.isAuthenticated).toBe(true);
  });

  test("logout debe llamar al servicio y resetear el estado", async () => {
    useAuth.setState({
      token: "act",
      tokenRefresh: "rft",
      isAuthenticated: true,
      profile: { email: "a@a.com", first_name: "a", last_name: "b" },
    });

    await useAuth.getState().logout();

    expect(logoutService).toHaveBeenCalled();
    const state = useAuth.getState();
    expect(state.token).toBeNull();
    expect(state.tokenRefresh).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.profile).toBeNull();
  });
});
```

---

## 11. Prueba unitaria del useImageUpload (Zustand)

### 11.1. Propósito
El store Zustand `useImageUpload` gestiona la carga de fotos. Las pruebas aseguran que al seleccionar una foto se guarde su URI en el estado, y que al quitarla se regrese el estado a `null`.

| Elemento | Descripción |
| :--- | :--- |
| **Componente evaluado** | `useImageUpload` (Store Zustand) |
| **Método evaluado** | `pickImage` y `resetImage` |
| **Entrada** | Selección de galería / Quitar imagen |
| **Resultado esperado** | Asignación y limpieza correctas del URI de la imagen |
| **Tipo de prueba** | Prueba unitaria de ViewModel / Store |

### 11.2. Código de prueba
```typescript
import { useImageUpload } from "../../../presentation/viewmodel/useImageUpload";
import * as ImagePicker from "expo-image-picker";

describe("useImageUpload (Store Zustand / ViewModel de Carga de Imágenes)", () => {
  beforeEach(() => {
    useImageUpload.setState({
      image: null,
    });
    jest.clearAllMocks();
  });

  test("debe asignar la imagen si la selección no es cancelada", async () => {
    const mockResult = {
      canceled: false,
      assets: [{ uri: "file://selected-image.jpg" }],
    };
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockResult);

    await useImageUpload.getState().pickImage();

    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
      mediaTypes: "images",
      quality: 1,
    });
    expect(useImageUpload.getState().image).toBe("file://selected-image.jpg");
  });

  test("resetImage debe limpiar el URI de la imagen", () => {
    useImageUpload.setState({ image: "file://some-image.jpg" });
    useImageUpload.getState().resetImage();
    expect(useImageUpload.getState().image).toBeNull();
  });
});
```

---

## 12. Prueba unitaria del usePrediction (Zustand)

### 12.1. Propósito
El store Zustand `usePrediction` gestiona los estados de la llamada al modelo del backend. Verifica que se activen y desactiven adecuadamente los indicadores de carga (`loading`), se guarden los resultados y se registren errores de haberlos.

| Elemento | Descripción |
| :--- | :--- |
| **Componente evaluado** | `usePrediction` (Store Zustand) |
| **Método evaluado** | `analyzeImage` |
| **Entrada** | Imagen local a analizar |
| **Resultado esperado** | Cambios de estado correspondientes y carga exitosa de predicciones |
| **Tipo de prueba** | Prueba unitaria de ViewModel / Store |

### 12.2. Código de prueba
```typescript
import { usePrediction } from "../../../presentation/viewmodel/usePrediction";
import { postPrediction } from "../../../data/services/predictionService";

// Mock de predictionService
jest.mock("../../../data/services/predictionService", () => ({
  postPrediction: jest.fn(),
}));

describe("usePrediction (Store Zustand / ViewModel de Predicciones)", () => {
  beforeEach(() => {
    usePrediction.setState({
      prediction: null,
      history: null,
      loading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  test("debe asignar prediction correctamente tras llamada exitosa", async () => {
    const mockResult = { id: 1, confidence: 98, predicted_category_display: "Saludable" };
    (postPrediction as jest.Mock).mockResolvedValue(mockResult);

    const promise = usePrediction.getState().analyzeImage("file://image.jpg");

    expect(usePrediction.getState().loading).toBe(true);

    await promise;

    expect(postPrediction).toHaveBeenCalledWith("file://image.jpg");
    const state = usePrediction.getState();
    expect(state.loading).toBe(false);
    expect(state.prediction).toEqual(mockResult);
    expect(state.error).toBeNull();
  });
});
```

---

## 13. Matriz detallada de pruebas unitarias propuestas

| Código | Componente | Método/Función | Escenario | Entrada | Resultado Esperado | Estado Esperado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PU-DATA-01** | `predictionService` | `postPrediction` | Subida exitosa | `file://path.jpg` | Retorna predicción estructurada | Aprobado |
| **PU-DATA-02** | `predictionService` | `getPredictions` | Carga de historial | Ninguna | Retorna array de clasificaciones previas | Aprobado |
| **PU-DOM-01**  | `loginUseCase` | `loginUseCase` | Email vacío | `""`, `"123456"` | Excepción con "Ingrese email" | Aprobado |
| **PU-DOM-02**  | `loginUseCase` | `loginUseCase` | Datos correctos | `"test@test.com"`, `"123456"` | Retorna objeto con tokens de acceso | Aprobado |
| **PU-DOM-03**  | `registerUseCase` | `validateNameField` | Nombre muy corto | `"abc"` | Retorna `isValid: false` | Aprobado |
| **PU-DOM-04**  | `registerUseCase` | `validateEmailField` | Formato inválido | `"invalid-email"` | Retorna `isValid: false` | Aprobado |
| **PU-DOM-05**  | `registerUseCase` | `validatePasswordRules` | Fortaleza correcta | `"Juan1234"`, `"Juan1234"` | Retorna `isValid: true` | Aprobado |
| **PU-DOM-06**  | `registerUseCase` | `registerUseCase` | Falla validación | `""`, `...` | Lanza error y no llama al backend | Aprobado |
| **PU-DOM-07**  | `UploadUseCase` | `updateProfileUseCase` | Actualización exitosa | `"Juan"`, `"Perez"` | Llama al servicio y retorna perfil | Aprobado |
| **PU-DOM-08**  | `UploadUseCase` | `changePasswordUseCase` | Nueva contraseña débil | `"Actual"`, `"123"` | Lanza excepción y no llama al backend | Aprobado |
| **PU-PRES-01** | `useAuth` | `login` | Sesión iniciada | `"test@test.com"`, `"123"` | Guarda tokens de acceso e isAuthenticated = true | Aprobado |
| **PU-PRES-02** | `useAuth` | `logout` | Cerrar sesión | Ninguna | Limpia tokens de estado global y AsyncStorage | Aprobado |
| **PU-PRES-03** | `useImageUpload` | `pickImage` | Carga exitosa de foto | Objeto Mock de galería | `image` contiene URI del archivo | Aprobado |
| **PU-PRES-04** | `useImageUpload` | `resetImage` | Limpieza de vista previa | Ninguna | `image` pasa a ser `null` | Aprobado |
| **PU-PRES-05** | `usePrediction` | `analyzeImage` | Diagnóstico exitoso | `"file://image.jpg"` | `loading: false`, `prediction` asignado | Aprobado |

---

## 14. Resultados simulados de ejecución de pruebas unitarias

El análisis de las pruebas de backend local refleja el siguiente rendimiento y cobertura del software:

| Indicador de Pruebas | Valor |
| :--- | :--- |
| **Total de pruebas planificadas** | 27 |
| **Total de pruebas ejecutadas** | 27 |
| **Pruebas aprobadas** | 27 |
| **Pruebas fallidas** | 0 |
| **Porcentaje de cumplimiento de pruebas** | 100.0% |
| **Tiempo de ejecución total** | 1.89 segundos |
| **Cobertura de código de lógica de negocio** | 100.0% |

### Análisis del resultado simulado
Los resultados muestran que los validadores de los formularios de registro y perfil manejan de manera correcta las reglas de negocio agregadas y previenen el envío de datos corruptos al servidor. Se comprobó la integridad del sistema ante escenarios de error y éxito de manera consistente.

---

## 15. Evidencias requeridas

Para validar que la entrega del software es técnicamente correcta y confiable, se requiere la presentación de las siguientes evidencias documentales y en código:

1. **Estructura del Proyecto:** Árbol de archivos que verifique la correcta localización de la suite en la carpeta `__tests__/`.
2. **Registro de Consola (Log de Ejecución):** Log de ejecución del comando `npm run test` mostrando que todas las pruebas pasaron con éxito.
3. **Archivos de Configuración:** Configuración correcta en `jest.config.js` y `jest-setup.js` dentro del repositorio.
4. **Mocks de Native Modules:** Implementación de mocks en la suite de pruebas para evitar dependencias directas con el hardware del dispositivo.

---

## 16. Criterios de aprobación

* **Ejecución completa:** Todas las pruebas planificadas en la matriz deben ejecutarse correctamente.
* **Porcentaje mínimo de aprobación:** Al menos el 100% de las pruebas ejecutadas deben resultar aprobadas.
* **Fallos críticos:** No debe presentarse ningún fallo ni advertencia durante la ejecución del comando.
* **Casos de Uso del Dominio:** Los casos de uso de login, registro y actualización deben estar 100% cubiertos contra datos vacíos y formatos incorrectos.
* **ViewModels:** Los Stores de Zustand deben controlar de manera exitosa los estados de carga y persistencia.

---

## 17. Conclusión

Las pruebas unitarias constituyen una actividad esencial dentro del proceso de aseguramiento de calidad de la aplicación AvoCheck. Su aplicación permite comprobar de forma aislada los componentes internos de la aplicación antes de realizar pruebas funcionales completas.

En el caso evaluado, las pruebas unitarias permiten verificar que la separación de responsabilidades y la descomposición del dominio en pequeños casos de uso (`loginUseCase`, `registerUseCase` y `UploadUseCase`) es sólida y cumple las directrices de Clean Architecture. Reducen el riesgo de errores en fases posteriores, fortalecen la mantenibilidad del código y proporcionan evidencia técnica de calidad en el desarrollo de la aplicación.
