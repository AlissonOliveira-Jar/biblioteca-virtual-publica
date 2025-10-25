import { z } from 'zod';

export const updateUserPasswordSchema = z.object({
  currentPassword: z.string()
    .nonempty("A senha atual é obrigatória."),
  
  newPassword: z.string()
    .min(8, { message: "A nova senha deve ter no mínimo 8 caracteres." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "A senha deve conter maiúscula, minúscula, número e caractere especial."
    }),
  
  confirmNewPassword: z.string()
    .nonempty("A confirmação é obrigatória."),
})
.refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "As novas senhas não correspondem.",
  path: ["confirmNewPassword"],
});

export type UpdateUserPasswordSchema = z.infer<typeof updateUserPasswordSchema>;
