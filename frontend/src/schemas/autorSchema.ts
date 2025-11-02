import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const optionalDate = z.string()
  .regex(dateRegex, { message: "Data inválida (use YYYY-MM-DD)." })
  .optional()
  .or(z.literal(''))
  .or(z.null());

export const autorSchema = z.object({
  nome: z.string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." })
    .max(100, { message: "O nome deve ter no máximo 100 caracteres." }),

  nacionalidade: z.string()
    .max(50, { message: "Nacionalidade deve ter no máximo 50 caracteres." })
    .optional().or(z.literal('')).or(z.null()),

  dataNascimento: optionalDate,

  dataFalescimento: optionalDate,

  biografia: z.string()
    .max(2000, { message: "Biografia muito longa (máx 2000 caracteres)." })
    .optional().or(z.literal('')).or(z.null()),
})
.refine((data) => {
  if (data.dataNascimento && data.dataFalescimento) {
    const nascimento = new Date(data.dataNascimento + 'T00:00:00');
    const falecimento = new Date(data.dataFalescimento + 'T00:00:00');
    return falecimento >= nascimento;
  }
  return true;
}, {
  message: "Data de falecimento não pode ser anterior à data de nascimento.",
  path: ["dataFalescimento"],
});

export type AutorSchema = z.infer<typeof autorSchema>;
