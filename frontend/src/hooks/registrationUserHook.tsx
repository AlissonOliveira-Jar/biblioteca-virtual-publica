import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registrationUserSchema } from "../schemas/registrationUserSchema";
import type { RegistrationUserSchema } from "../schemas/registrationUserSchema";

export const useUserRegistrationHook = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<RegistrationUserSchema>({
        resolver: zodResolver(registrationUserSchema),
        mode: 'onTouched'
    });

    return { register, handleSubmit, errors, watch };
};
