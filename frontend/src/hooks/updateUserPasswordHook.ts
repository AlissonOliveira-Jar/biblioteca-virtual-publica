import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateUserPasswordSchema } from "../schemas/updateUserPasswordSchema";
import type { UpdateUserPasswordSchema } from "../schemas/updateUserPasswordSchema";

export const useUpdateUserPasswordForm = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isDirty },
    reset
  } = useForm<UpdateUserPasswordSchema>({
    resolver: zodResolver(updateUserPasswordSchema),
    mode: 'onTouched',
  });

  return { register, handleSubmit, errors, isDirty, reset };
};
