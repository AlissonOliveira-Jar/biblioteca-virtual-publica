import { z } from 'zod';

export const loginUserSchema = z.object({
    email: z.email({ message: "Utilize um e-mail válido." })
        .nonempty({ message: "O campo é obrigatório." }),
    
    password: z.string()
        .nonempty("A senha é obrigatória."),
});

export type LoginUserSchema = z.infer<typeof loginUserSchema>;
