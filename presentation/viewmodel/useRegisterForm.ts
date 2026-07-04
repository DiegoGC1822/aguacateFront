import { useState } from "react";
import { registerUseCase, validateRegisterForm } from "../../domain/registerUseCase";

export const useRegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const validation = validateRegisterForm(email, password, password2, firstName, lastName);

    const submit = async () => {
        await registerUseCase(email, password, password2, firstName, lastName);
    };

    return {
        email, setEmail,
        password, setPassword,
        password2, setPassword2,
        firstName, setFirstName,
        lastName, setLastName,
        validation,
        submit,
    };
};