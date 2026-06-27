import { useAuth } from "../../../presentation/viewmodel/useAuth";
import { loginUseCase } from "../../../domain/authUseCase";
import { logout as logoutService } from "../../../data/services/authService";

// Mock de casos de uso y servicios
jest.mock("../../../domain/authUseCase", () => ({
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
