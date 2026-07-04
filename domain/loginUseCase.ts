import { login } from "../data/services/authService";

export const loginUseCase = async (email: string, password: string) => {
    if (!email.trim()) {
        throw new Error("Ingrese email");
    }

    if (!password.trim()) {
        throw new Error("Ingrese contraseña");
    }

    return await login(email, password);
};