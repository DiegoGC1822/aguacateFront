import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { PaperProvider } from "react-native-paper";
import LoginScreen from "../../app/(auth)/login";
import { mock } from "../helpers/mockApi";
import { useAuth } from "../../presentation/viewmodel/useAuth";

const renderScreen = () =>
  render(
    <PaperProvider>
      <LoginScreen />
    </PaperProvider>,
  );

describe("Integración LoginScreen (render + store + red)", () => {
  beforeEach(() => {
    useAuth.setState({
      token: null,
      tokenRefresh: null,
      isAuthenticated: false,
      isHydrated: false,
      profile: null,
    });
  });

  afterEach(() => {
    mock.reset();
  });

  test("login exitoso guarda el token y autentica", async () => {
    mock.onPost("/auth/login/").reply(200, { access: "a.b.c", refresh: "r.e.f" });

    renderScreen();

    fireEvent.changeText(screen.getByPlaceholderText("Email"), "avo@example.com");
    fireEvent.changeText(screen.getByPlaceholderText("Contraseña"), "testpass123");
    fireEvent.press(screen.getByTestId("btn-login"));

    await waitFor(() => expect(useAuth.getState().isAuthenticated).toBe(true));
    expect(useAuth.getState().token).toBe("a.b.c");
  });

  test("login inválido muestra el modal de error y no autentica", async () => {
    mock.onPost("/auth/login/").reply(401, { detail: "Credenciales inválidas" });

    renderScreen();

    fireEvent.changeText(screen.getByPlaceholderText("Email"), "avo@example.com");
    fireEvent.changeText(screen.getByPlaceholderText("Contraseña"), "wrong");
    fireEvent.press(screen.getByTestId("btn-login"));

    // El interceptor NO reintenta rutas de auth, así que el 401 sube tal cual.
    await screen.findByText("Error de autenticación");
    expect(useAuth.getState().isAuthenticated).toBe(false);
  });
});
