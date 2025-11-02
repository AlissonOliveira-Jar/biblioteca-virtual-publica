import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateUserProfileSchema } from "../schemas/updateUserSchema";

import type { UpdateUserProfileSchema } from "../schemas/updateUserSchema";
import type { UseFormProps } from "react-hook-form";

type FormValues = UpdateUserProfileSchema;

export const useUpdateUserProfileForm = (options?: UseFormProps<FormValues>) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isDirty },
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(updateUserProfileSchema),
    mode: 'onTouched',
    ...options,
  });

  return { register, handleSubmit, errors, isDirty, reset };
};
