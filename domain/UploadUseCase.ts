import {
  login,
  updateUserProfile,
  changePassword,
} from "../data/services/authService";

export interface FieldValidation {
  hasValue: boolean;
  hasMinLength: boolean;
  isValid: boolean;
}

export const validateNameField = (value: string): FieldValidation => {
  const hasValue = value.trim().length > 0;
  const hasMinLength = value.trim().length > 3;
  return { hasValue, hasMinLength, isValid: hasValue && hasMinLength };
};

export interface UpdateProfileFormValidation {
  firstName: FieldValidation;
  lastName: FieldValidation;
  isFormValid: boolean;
}

export const validateUpdateProfileForm = (
  firstName: string,
  lastName: string,
): UpdateProfileFormValidation => {
  const firstNameValidation = validateNameField(firstName);
  const lastNameValidation = validateNameField(lastName);

  return {
    firstName: firstNameValidation,
    lastName: lastNameValidation,
    isFormValid:
      firstNameValidation.isValid &&
      lastNameValidation.isValid,
  };
};

export interface Password1Validation {
  hasValue: boolean;
  isValid: boolean;
}

export const validatePassword1 = (value: string): Password1Validation => {
  const hasValue = value.trim().length > 0;
  const isValid = hasValue;
  return { hasValue: hasValue, isValid: isValid };
};

export interface Password2Validation {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  isValid: boolean;
}

export const validatePassword2 = (value: string, password2: string): Password2Validation => {
  const hasMinLength = value.trim().length >= 8;
  const hasUppercase = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  return { hasMinLength, hasUppercase, hasNumber, isValid: hasMinLength && hasUppercase && hasNumber };
};

export const updateProfileUseCase = async (
  first_name: string,
  last_name: string,
) => {
  const validation = validateUpdateProfileForm(first_name, last_name);

  if (!validation.isFormValid) {
    if (!validation.firstName.hasValue) throw new Error("Ingrese su nombre");
    if (!validation.firstName.hasMinLength) throw new Error("El nombre debe tener al menos 4 caracteres");
    if (!validation.lastName.hasValue) throw new Error("Ingrese su apellido");
    if (!validation.lastName.hasMinLength) throw new Error("El apellido debe tener al menos 4 caracteres");
  }
  return await updateUserProfile(first_name, last_name);
};

export interface ChangePasswordFormValidation {
  password: Password1Validation;
  password2: Password2Validation;
  isFormValid: boolean;
}

export const validateChangePasswordForm = (
  password: string,
  password2: string,
): ChangePasswordFormValidation => {
  const password1Validation = validatePassword1(password);
  const password2Validation = validatePassword2(password2, password);

  return {
    password: password1Validation,
    password2: password2Validation,
    isFormValid:
      password1Validation.isValid &&
      password2Validation.isValid,
  };
};

export const changePasswordUseCase = async (
  password: string,
  password2: string,
) => {
  const validation = validateChangePasswordForm(password, password2);

  if (!validation.isFormValid) {
    if (!validation.password.hasValue) throw new Error("Ingrese su contraseña");
    if (!validation.password2.hasMinLength) throw new Error("La contraseña debe tener al menos 8 caracteres");
    if (!validation.password2.hasUppercase) throw new Error("La contraseña debe tener al menos una mayúscula");
    if (!validation.password2.hasNumber) throw new Error("La contraseña debe tener al menos un número");
  }
  return await changePassword(password, password2);
};
