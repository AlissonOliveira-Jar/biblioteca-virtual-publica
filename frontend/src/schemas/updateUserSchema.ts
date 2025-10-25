import { z } from 'zod';

export const updateUserProfileSchema = z.object({
  name: z.string()
    .min(3, { message: "O nome deve ter no mínimo 3 caracteres." })
    .max(50, { message: "O nome deve ter no máximo 50 caracteres." }),
  
  email: z.email({ message: "Utilize um e-mail válido." })
    .nonempty({ message: "O campo é obrigatório." }),
});

export type UpdateUserProfileSchema = z.infer<typeof updateUserProfileSchema>;
