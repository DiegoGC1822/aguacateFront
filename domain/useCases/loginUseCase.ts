import { login } from "../../data/services/authService";
import { AppError } from "../errors";

export const loginUseCase = async (email: string, password: string) => {
    if (!email.trim()) {
        throw new AppError("VALIDATION", "Ingrese su email");
    }

    if (!password.trim()) {
        throw new AppError("VALIDATION", "Ingrese su contraseña");
    }

    return await login(email, password);
};