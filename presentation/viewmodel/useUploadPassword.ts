import { useState } from "react";
import { changePasswordUseCase, validateChangePasswordForm } from "../../domain/useCases/UploadUseCase";

export const useUploadPassword = () => {
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const validation = validateChangePasswordForm(password, password2);

    const submit = async () => {
        await changePasswordUseCase(password, password2);
    };

    return {
        password, setPassword,
        password2, setPassword2,
        validation,
        submit,
    };
};