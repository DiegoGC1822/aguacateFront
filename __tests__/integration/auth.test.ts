import { mock } from "../helpers/mockApi";
import { useAuth } from "../../presentation/viewmodel/useAuth";
import { register, getUserProfile } from "../../data/services/authService";
import { AppError } from "../../domain/errors";

const resetAuth = () =>
  useAuth.setState({
    token: null,
    tokenRefresh: null,
    isAuthenticated: false,
    isHydrated: false,
    profile: null,
  });

describe("Integración Auth (useAuth + authService + interceptores de api)", () => {
  beforeEach(() => {
    resetAuth();
  });

  afterEach(() => {
    mock.reset();
  });

  test("Login exitoso guarda tokens y autentica", async () => {
    mock.onPost("/auth/login/").reply(200, { access: "a.b.c", refresh: "r.e.f" });

    await useAuth.getState().login("avo@example.com", "testpass123");

    const state = useAuth.getState();
    expect(state.token).toBe("a.b.c");
    expect(state.tokenRefresh).toBe("r.e.f");
    expect(state.isAuthenticated).toBe(true);
  });

  test("Login inválido rechaza y deja el store sin autenticar", async () => {
    mock.onPost("/auth/login/").reply(401, { detail: "No active account" });

    await expect(
      useAuth.getState().login("avo@example.com", "wrong"),
    ).rejects.toBeInstanceOf(AppError);

    const state = useAuth.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
  });

  test("Registro envía password2 (y el resto de campos) en el body", async () => {
    let sentBody: any;
    mock.onPost("/auth/register/").reply((config) => {
      sentBody = JSON.parse(config.data as string);
      return [201, { id: 1, email: "avo@example.com" }];
    });

    await register("avo@example.com", "Testpass1", "Testpass1", "Avo", "Cado");

    expect(sentBody).toMatchObject({
      email: "avo@example.com",
      password: "Testpass1",
      password2: "Testpass1",
      first_name: "Avo",
      last_name: "Cado",
    });
    // Aserción explícita del contrato: password2 debe ir presente.
    expect(sentBody.password2).toBe("Testpass1");
  });

  test("Refresh automático usa /auth/token/refresh/ y reintenta (regresión Bug 1)", async () => {
    useAuth.setState({
      token: "old-access",
      tokenRefresh: "valid-refresh",
      isAuthenticated: true,
    });

    // 1ª vez profile devuelve 401 → dispara el refresh; el reintento devuelve 200.
    mock.onGet("/auth/profile/").replyOnce(401);
    mock
      .onPost("/auth/token/refresh/")
      .reply(200, { access: "new-access", refresh: "new-refresh" });
    mock.onGet("/auth/profile/").reply(200, {
      email: "avo@example.com",
      first_name: "Avo",
      last_name: "Cado",
    });

    const profile = await getUserProfile();

    expect(profile.email).toBe("avo@example.com");

    const state = useAuth.getState();
    expect(state.token).toBe("new-access");
    expect(state.tokenRefresh).toBe("new-refresh");

    // El interceptor debe golpear el path CORREGIDO, nunca el viejo.
    expect(
      mock.history.post.some((c) => c.url === "/auth/token/refresh/"),
    ).toBe(true);
    expect(
      mock.history.post.some((c) => c.url === "/auth/refresh/"),
    ).toBe(false);
  });

  test("Refresh que falla cierra la sesión (token null, no autenticado)", async () => {
    useAuth.setState({
      token: "old-access",
      tokenRefresh: "expired-refresh",
      isAuthenticated: true,
    });

    mock.onGet("/auth/profile/").reply(401);
    mock.onPost("/auth/token/refresh/").reply(401, { detail: "Token inválido" });

    await expect(getUserProfile()).rejects.toBeTruthy();

    const state = useAuth.getState();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
