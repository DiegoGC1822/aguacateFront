# Instrucciones para Claude Code — Pruebas de integración (aguacateFront)

> **Cómo usar este documento:** abre Claude Code en el repo `aguacateFront` y dale
> como tarea "Implementa las pruebas de integración siguiendo `INTEGRATION_TESTING.md`".
> Este archivo es autocontenido: describe el contexto, los bugs de contrato que hay
> que arreglar antes, el setup de testing y las pruebas concretas a escribir con sus
> criterios de aceptación. Ejecuta las fases en orden y no pases a la siguiente hasta
> que la anterior esté verde.

---

## 0. Contexto

- **App:** `aguacateFront` — Expo (~54), expo-router, React 19 / RN 0.81.
- **Stack relevante:** `axios` (cliente HTTP), `zustand` (estado + persistencia con
  AsyncStorage), `react-native-paper` (UI), `expo-image-picker` (selección de imagen).
- **Backend:** Django REST API AvoClassifier, base URL
  `https://avoclassifier-api.onrender.com/api` (hardcodeada en `data/api/api.ts`).
- **Fuente de verdad del contrato:** el repo del backend tiene `test/test_api.py` y
  `classifications/tests.py`, que documentan el comportamiento real de cada endpoint.
  Las pruebas de este documento son el **espejo en el frontend** de ese contrato.

### Arquitectura (MVVM + clean) — dónde vive cada cosa

```
data/api/api.ts                 → instancia axios + interceptores (auth / refresh)
data/services/authService.ts    → login, register, profile, changePassword, refreshToken
data/services/predictionService.ts → postPrediction (subir imagen), getPredictions (historial)
domain/authUseCase.ts           → casos de uso de auth
presentation/viewmodel/useAuth.ts       → store zustand de sesión (persistida)
presentation/viewmodel/usePrediction.ts → store zustand de clasificación/historial
presentation/viewmodel/useImageUpload.ts→ store zustand de selección de imagen
app/(auth)/login.tsx, register.tsx      → pantallas de auth
app/(protected)/addImage.tsx, result.tsx, history.tsx, ... → pantallas protegidas
types.ts                        → Prediction, PredictionResponse, History, authResponse
```

---

## FASE 1 — Arreglar 2 bugs de contrato (prerrequisito obligatorio)

Las pruebas codifican el comportamiento **correcto** del backend. Si no arreglas estos
dos bugs primero, las pruebas fallarán contra código roto (que es justo lo que deben
detectar). Arréglalos y confirma manualmente antes de escribir tests.

### Bug 1 — URL de refresh de token incorrecta

- **Backend real:** `POST /api/auth/token/refresh/` (ver `users/urls.py`).
- **Frontend llama a:** `/auth/refresh/` en `data/services/authService.ts` (función
  `refreshToken`, la ruta `api.post("/auth/refresh/", ...)`).
- **Efecto:** cuando el access token expira (30 min), el interceptor de `api.ts` intenta
  refrescar, recibe **404**, cae al `catch` y **cierra la sesión**. La sesión se muere
  sola a los 30 minutos.
- **Fix:** cambiar la ruta a `/auth/token/refresh/` en `refreshToken`. Revisa también
  el chequeo `isAuthRoute` en `data/api/api.ts` (`originalRequest.url?.includes("/auth/refresh/")`)
  y actualízalo a `/auth/token/refresh/` para que siga excluyendo esa ruta del retry.

### Bug 2 — La clasificación no hace polling del resultado asíncrono

- **Backend real:** `POST /api/classifications/` responde **`202 Accepted`** con
  `{ id, status: "pending" }` — **sin** `raw_scores`, `confidence` ni
  `predicted_category_display`. El resultado se obtiene por **polling** a
  `GET /api/classifications/<id>/` hasta que `status` sea `"completed"` o `"failed"`.
- **Frontend actual:** `presentation/viewmodel/usePrediction.ts` → `analyzeImage` hace
  `const data = await postPrediction(uri); set({ prediction: data })`. Guarda la
  respuesta 202 (solo `{id, status: "pending"}`) como si fuera el resultado final. **No
  hay polling.** Luego `app/(protected)/result.tsx` accede a `prediction.raw_scores.sarna`
  (sin optional chaining en `raw_scores`) → **crashea** con `Cannot read property 'sarna'
  of undefined`. Además el estado real es `"pending"`, que no coincide con el chequeo de
  `"processing"` de esa pantalla.
- **Fix:** reescribir `analyzeImage` para:
  1. `POST` la imagen → obtener `{ id, status }`.
  2. Guardar estado intermedio (`loading` / `prediction` con status `pending|processing`).
  3. Hacer **polling** a `getPredictionById(id)` (nuevo método en `predictionService.ts`
     que llama `GET /classifications/${id}/`) cada ~2 s, con timeout (~60 s), hasta
     `completed` o `failed`.
  4. Guardar el resultado final en el store.
- **Endurecer `result.tsx`:** usar optional chaining en todos los accesos a `raw_scores`
  (`prediction?.raw_scores?.sarna ?? 0`) y manejar explícitamente los estados
  `pending`/`processing` mostrando el loader.

### (Opcional pero recomendado) baseURL configurable

`data/api/api.ts` tiene la baseURL hardcodeada. Para poder apuntar a local/staging en
tests y E2E, léela de una env var de Expo:
```ts
const baseURL = process.env.EXPO_PUBLIC_API_URL ?? "https://avoclassifier-api.onrender.com/api";
```

**Criterio de aceptación FASE 1:** la app compila (`npx tsc --noEmit`) y, contra el
backend real o local, clasificar una imagen ya no crashea y muestra el resultado tras
el polling.

---

## FASE 2 — Montar la infraestructura de testing

No existe ninguna hoy. Instala y configura:

```bash
npx expo install jest-expo jest
npm i -D @testing-library/react-native @testing-library/jest-native
# Mock de red — elige UNA estrategia (ver nota más abajo):
npm i -D axios-mock-adapter          # opción recomendada por robustez con axios
#   ó
npm i -D msw                          # opción "network-level" (msw/native)
```

### `package.json`

```jsonc
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "jest": {
    "preset": "jest-expo",
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.ts"],
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|zustand|axios))"
    ]
  }
}
```

### `jest.setup.ts`

```ts
import "@testing-library/jest-native/extend-expect";

// AsyncStorage (usado por la persistencia de zustand en useAuth)
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// expo-router: las pantallas llaman router.push(...)
jest.mock("expo-router", () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  Link: "Link",
}));

// expo-image-picker: se sobreescribe por test según se necesite
jest.mock("expo-image-picker");
```

### Nota sobre el mock de red — axios-mock-adapter vs MSW

- **`axios-mock-adapter` (recomendado aquí):** mockea a nivel del *adapter* de la
  instancia `api`, **por debajo de los interceptores**, así que los interceptores de
  auth/refresh de `api.ts` **sí se ejecutan** en los tests. Es determinista y no depende
  del entorno de red de jest-expo. Ideal para pruebas de integración de la capa
  service/viewmodel.
- **MSW (`msw/native`):** intercepta a nivel de red (más realista). En React Native se
  importa desde `msw/native`, **no** `msw/node`. Con axios bajo jest-expo la
  interceptación puede requerir polyfills y ser frágil; si eliges MSW y ves problemas de
  interceptación, cambia a `axios-mock-adapter`.

Los ejemplos de abajo usan `axios-mock-adapter`. Reutiliza un helper:

```ts
// __tests__/helpers/mockApi.ts
import MockAdapter from "axios-mock-adapter";
import api from "../../data/api/api";
export const mock = new MockAdapter(api, { onNoMatch: "throwException" });
```

Recuerda `mock.reset()` en `afterEach` y `useAuth.setState(...)`/`usePrediction.setState(...)`
para limpiar los stores entre tests.

---

## FASE 3 — Escribir las pruebas de integración

Ubicación sugerida: `__tests__/integration/`. Cada archivo debe cubrir el flujo real
extremo a extremo dentro de la app (viewmodel → service → axios → mock), y donde aplique,
también el render de la pantalla.

### 3.1 Auth — `__tests__/integration/auth.test.ts`

Ejercita `useAuth` + `authService` + interceptores de `api.ts`.

| Caso | Setup del mock | Aserción |
|------|----------------|----------|
| Login exitoso | `POST /auth/login/` → 200 `{access, refresh}` | tras `useAuth.getState().login(...)`, el store tiene `token`, `tokenRefresh`, `isAuthenticated === true` |
| Login inválido | `POST /auth/login/` → 401 `{detail}` | `login(...)` rechaza; el store queda **sin** autenticar (`isAuthenticated === false`) |
| Registro envía `password2` | `POST /auth/register/` → 201 | el body de la petición incluye `email, password, password2, first_name, last_name` (verifica que `password2` va presente) |
| Refresh automático (Bug 1) | `GET /auth/profile/` → 401 la 1ª vez; `POST /auth/token/refresh/` → 200 `{access, refresh}`; reintento de profile → 200 | el interceptor refresca contra **`/auth/token/refresh/`** (no `/auth/refresh/`), reintenta y la 2ª respuesta llega OK; el store actualiza `token` |
| Refresh falla → logout | `POST /auth/token/refresh/` → 401 | el store queda `token: null, isAuthenticated: false` |

> El caso de "refresh automático" es la prueba de regresión del Bug 1: debe apuntar al
> path corregido. Si alguien revierte el fix, esta prueba falla.

### 3.2 Clasificación con polling — `__tests__/integration/prediction.test.ts`

Prueba de regresión del Bug 2. Ejercita `usePrediction.analyzeImage`.

| Caso | Setup del mock | Aserción |
|------|----------------|----------|
| Flujo async feliz | `POST /classifications/` → 202 `{id:31, status:"pending"}`; `GET /classifications/31/` → 1ª `{status:"processing"}`, 2ª `{status:"completed", predicted_category_display:"Saludable", confidence:0.9423, raw_scores:{saludable:0.94, antracnosis:0.05, sarna:0.01}, status:"completed"}` | tras `await analyzeImage(uri)`, `usePrediction.getState().prediction.status === "completed"` y `raw_scores.saludable` está definido; `loading === false` |
| Estados intermedios | igual que arriba | en algún punto el store pasa por `pending`/`processing` antes de `completed` (puedes espiar los `set` o assertar el estado intermedio con timers falsos) |
| Clasificación fallida | `POST` → 202; `GET /classifications/31/` → `{status:"failed", error_message:"..."}` | el store termina con `prediction.status === "failed"` y expone `error_message`; no crashea |
| Timeout de polling | `GET` siempre `{status:"processing"}` | tras el timeout configurado, el store setea `error` y `loading === false` (no queda colgado) — usa `jest.useFakeTimers()` |
| Historial | `GET /classifications/history/` → array de `PredictionResponse` | `usePrediction.getState().getHistory()` llena `history` con la longitud correcta |

Usa timers falsos (`jest.useFakeTimers()` + `jest.advanceTimersByTimeAsync`) para no
esperar los intervalos reales de polling.

### 3.3 Render de pantalla — `__tests__/integration/loginScreen.test.tsx`

Renderiza `LoginScreen` real. Los inputs de `react-native-paper` exponen `placeholder`
(`"Email"`, `"Contraseña"`); el botón tiene el texto `"Iniciar Sesión"`.

```tsx
import { render, screen, userEvent } from "@testing-library/react-native";
import LoginScreen from "../../app/(auth)/login";
import { mock } from "../helpers/mockApi";

test("login exitoso guarda el token", async () => {
  mock.onPost("/auth/login/").reply(200, { access: "a.b.c", refresh: "r.e.f" });
  const user = userEvent.setup();
  render(<LoginScreen />);

  await user.type(screen.getByPlaceholderText("Email"), "avo@example.com");
  await user.type(screen.getByPlaceholderText("Contraseña"), "testpass123");
  await user.press(screen.getByText("Iniciar Sesión"));

  // findBy* espera la actualización async; assert sobre el store o la navegación
  const { useAuth } = require("../../presentation/viewmodel/useAuth");
  await waitFor(() => expect(useAuth.getState().isAuthenticated).toBe(true));
});
```

> **Robustez:** los inputs/botones no tienen `testID`. Añade `testID` a los `TextInput`
> y `Button` de `login.tsx`, `register.tsx` y `addImage.tsx` (p. ej. `testID="input-email"`,
> `testID="btn-login"`, `testID="btn-analizar"`) y consúltalos con `getByTestId`. Es más
> estable que `getByText`/`getByPlaceholderText` frente a cambios de copy, y reutilizable
> para futuras pruebas E2E con Detox/Maestro.

### 3.4 Render de pantalla — `__tests__/integration/addImage.test.tsx`

- Mockea `expo-image-picker.launchImageLibraryAsync` para devolver
  `{ canceled: false, assets: [{ uri: "file:///fake.jpg" }] }`.
- Presiona "Cargar Imagen" → aparece el botón "Analizar".
- Presiona "Analizar" → se dispara `analyzeImage` (mockea `POST /classifications/` → 202
  y el polling) y `router.push("/result")` es llamado.

### Reglas de RNTL (evitan tests flaky)

- Usa **`findBy*`** para elementos que aparecen tras una operación async (envuelve
  `waitFor`). No metas acciones (`press`/`type`) dentro de `waitFor`.
- Usa **`userEvent`** (`user.type`, `user.press`) en vez de `fireEvent`.
- Una sola aserción por `waitFor`; el resto, después.
- Prefiere `getByRole` / `getByTestId` sobre texto exacto.

---

## FASE 4 — Verificación y cierre

1. `npm test` → toda la suite en verde.
2. `npx tsc --noEmit` → sin errores de tipos.
3. Cobertura mínima esperada: auth (login ok/inválido, refresh ok/falla, register),
   predicción (202+polling completed/failed/timeout, historial), y render de Login y
   AddImage.
4. Deja los `testID` añadidos en las pantallas (habilitan E2E futuras).

### Definición de "hecho"

- [ ] Bug 1 (URL de refresh) arreglado + prueba de regresión que lo cubre.
- [ ] Bug 2 (polling de clasificación) arreglado + prueba de regresión que lo cubre.
- [ ] `result.tsx` endurecido contra `raw_scores` indefinido / estados intermedios.
- [ ] Infra de testing instalada y configurada (`jest-expo`, RNTL, mock de red).
- [ ] Pruebas de integración 3.1–3.4 escritas y en verde.
- [ ] `testID` añadidos en inputs/botones clave.

---

## Anexo — Contrato del backend (referencia rápida)

| Endpoint | Método | Éxito | Notas |
|----------|--------|-------|-------|
| `/api/auth/register/` | POST | 201 | requiere `password` **y** `password2` |
| `/api/auth/login/` | POST | 200 | devuelve `{access, refresh}` (401 si inválido) |
| `/api/auth/token/refresh/` | POST | 200 | body `{refresh}` → `{access, refresh}` |
| `/api/auth/profile/` | GET/PATCH | 200 | requiere Bearer token |
| `/api/auth/change-password/` | POST | 200 | `{current_password, new_password}` |
| `/api/classifications/` | POST | **202** | `multipart` campo `image`; devuelve `{id, status:"pending"}` |
| `/api/classifications/<id>/` | GET | 200 | polling: `status` ∈ `pending\|processing\|completed\|failed` |
| `/api/classifications/history/` | GET | 200 | lista de clasificaciones del usuario |
| `/api/classifications/history/export/` | GET | 200 | CSV (`text/csv`) |

Categorías reales: **`saludable`**, **`antracnosis`**, **`sarna`**. (El `CLAUDE.md` del
backend menciona `pudricion`, pero está desactualizado — el modelo y la API usan `sarna`.)
