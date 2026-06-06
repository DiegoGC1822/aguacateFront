import {
  login,
  register,
  updateUserProfile,
  changePassword,
} from "../data/services/authService";

export const loginUseCase = async (email: string, password: string) => {
  if (!email.trim()) {
    throw new Error("Ingrese email");
  }

  if (!password.trim()) {
    throw new Error("Ingrese contraseña");
  }

  return await login(email, password);
};

export const registerUseCase = async (
  email: string,
  password: string,
  password2: string,
  first_name: string,
  last_name: string,
) => {
  if (!email.trim()) {
    throw new Error("Ingrese email");
  }
  if (!password.trim()) {
    throw new Error("Ingrese contraseña");
  }
  if (!password2.trim()) {
    throw new Error("Confirme su contraseña");
  }
  if (password !== password2) {
    throw new Error("Las contraseñas no coinciden");
  }
  if (!first_name.trim()) {
    throw new Error("Ingrese su nombre");
  }
  if (!last_name.trim()) {
    throw new Error("Ingrese su apellido");
  }
  return await register(email, password, password2, first_name, last_name);
};

export const updateProfileUseCase = async (
  first_name?: string,
  last_name?: string,
  password?: string,
) => {
  if (first_name !== undefined && !first_name.trim()) {
    throw new Error("Ingrese su nombre");
  }
  if (last_name !== undefined && !last_name.trim()) {
    throw new Error("Ingrese su apellido");
  }
  if (password !== undefined && !password.trim()) {
    throw new Error("Ingrese una contraseña válida");
  }
  return await updateUserProfile(first_name, last_name, password);
};

export const changePasswordUseCase = async (
  current_password: string,
  new_password: string,
) => {
  if (!current_password.trim()) {
    throw new Error("Ingrese su contraseña actual");
  }
  if (!new_password.trim()) {
    throw new Error("Ingrese una nueva contraseña");
  }
  return await changePassword(current_password, new_password);
};
