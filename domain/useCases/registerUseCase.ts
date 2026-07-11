import { register } from "../../data/services/authService";
import { AppError } from "../errors";

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

export interface EmailValidation {
    hasValue: boolean;
    hasValidFormat: boolean;
    isValid: boolean;
}

export const validateEmailField = (email: string): EmailValidation => {
    const hasValue = email.trim().length > 0;
    const hasValidFormat = /^\S+@\S+\.\S+$/.test(email);
    return { hasValue, hasValidFormat, isValid: hasValue && hasValidFormat };
};

export const validateChangePasswordRules = (
    password: string,
    password2: string,
): PasswordValidation => {
    const passwordsMatch = password === password2;
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return {
        hasMinLength,
        hasUppercase,
        hasNumber,
        passwordsMatch,
        isValid: hasMinLength && hasUppercase && hasNumber && passwordsMatch,
    };
};

export interface PasswordValidation {
    hasMinLength: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    passwordsMatch: boolean;
    isValid: boolean;
}

export const validatePasswordRules = (
    password: string,
    password2: string,
): PasswordValidation => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const passwordsMatch = password.length > 0 && password === password2;

    return {
        hasMinLength,
        hasUppercase,
        hasNumber,
        passwordsMatch,
        isValid: hasMinLength && hasUppercase && hasNumber && passwordsMatch,
    };
};

export interface RegisterFormValidation {
    email: EmailValidation;
    password: PasswordValidation;
    firstName: FieldValidation;
    lastName: FieldValidation;
    isFormValid: boolean;
}

export const validateRegisterForm = (
    email: string,
    password: string,
    password2: string,
    firstName: string,
    lastName: string,
): RegisterFormValidation => {
    const emailValidation = validateEmailField(email);
    const passwordValidation = validatePasswordRules(password, password2);
    const firstNameValidation = validateNameField(firstName);
    const lastNameValidation = validateNameField(lastName);

    return {
        email: emailValidation,
        password: passwordValidation,
        firstName: firstNameValidation,
        lastName: lastNameValidation,
        isFormValid:
            emailValidation.isValid &&
            passwordValidation.isValid &&
            firstNameValidation.isValid &&
            lastNameValidation.isValid,
    };
};

export const registerUseCase = async (
    email: string,
    password: string,
    password2: string,
    first_name: string,
    last_name: string,
) => {
    const validation = validateRegisterForm(
        email,
        password,
        password2,
        first_name,
        last_name,
    );

    if (!validation.isFormValid) {
        if (!validation.email.hasValue) throw new AppError("VALIDATION", "Ingrese su email");
        if (!validation.email.hasValidFormat) throw new AppError("VALIDATION", "El formato del email no es válido");
        if (!validation.password.hasMinLength) throw new AppError("VALIDATION", "La contraseña debe tener al menos 8 caracteres");
        if (!validation.password.hasUppercase) throw new AppError("VALIDATION", "La contraseña debe tener al menos una mayúscula");
        if (!validation.password.hasNumber) throw new AppError("VALIDATION", "La contraseña debe tener al menos un número");
        if (!validation.password.passwordsMatch) throw new AppError("VALIDATION", "Las contraseñas no coinciden");
        if (!validation.firstName.hasValue) throw new AppError("VALIDATION", "Ingrese su nombre");
        if (!validation.firstName.hasMinLength) throw new AppError("VALIDATION", "El nombre debe tener al menos 4 caracteres");
        if (!validation.lastName.hasValue) throw new AppError("VALIDATION", "Ingrese su apellido");
        if (!validation.lastName.hasMinLength) throw new AppError("VALIDATION", "El apellido debe tener al menos 4 caracteres");
    }

    return await register(email, password, password2, first_name, last_name);
};