import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginUserSchema } from "../schemas/loginUserSchema";
import type { LoginUserSchema } from "../schemas/loginUserSchema";

export const useLoginUserForm = () => {
    const { register, handleSubmit, formState: { errors },} = useForm<LoginUserSchema>({
        resolver: zodResolver(loginUserSchema),
    });

    return { register, handleSubmit, errors };
};
