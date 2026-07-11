import { useState } from "react";
import { updateProfileUseCase, validateUpdateProfileForm } from "../../domain/useCases/UploadUseCase";
import { useAuth } from "./useAuth";

export const useUploadProfile = () => {
    const { profile } = useAuth();
    const [firstName, setFirstName] = useState(profile?.first_name || "");
    const [lastName, setLastName] = useState(profile?.last_name || "");

    const validation = validateUpdateProfileForm(firstName, lastName);

    const submit = async () => {
        await updateProfileUseCase(firstName, lastName);
    };

    return {
        firstName, setFirstName,
        lastName, setLastName,
        validation,
        submit,
    };
};