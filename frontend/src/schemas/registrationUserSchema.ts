import { z } from 'zod';

export const registrationUserSchema = z.object({
    name: z.string()
        .min(3, { message: "O nome deve ter no mínimo 3 caracteres." })
        .max(50, { message: "O nome deve ter no máximo 50 caracteres." }),
    
    email: z.email({ message: "Utilize um e-mail válido." })
        .nonempty({ message: "O campo é obrigatório." }),

    password: z.string()
        .min(8, { message: "A senha deve ter no mínimo 8 caracteres." })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
            message: "A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número."
    }),
    
    confirmPassword: z.string()
        .min(8, { message: "A confirmação de senha é obrigatória." }),

    agreeToTerms: z.literal(true, {
        message: "Você precisa aceitar os termos e condições.",
    }),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não correspondem.",
    path: ["confirmPassword"],
});

export type RegistrationUserSchema = z.infer<typeof registrationUserSchema>;
