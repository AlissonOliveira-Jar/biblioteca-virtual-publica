import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const optionalDate = z.string()
  .regex(dateRegex, { message: "Data inválida (use YYYY-MM-DD)." })
  .optional()
  .or(z.literal(''))
  .or(z.null());

const optionalUrl = z.string()
  .url({ message: "URL inválida." })
  .optional()
  .or(z.literal(''))
  .or(z.null());

export const editoraSchema = z.object({
  nome: z.string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres." })
    .max(100, { message: "O nome deve ter no máximo 100 caracteres." }),

  pais: z.string()
    .max(50, { message: "País deve ter no máximo 50 caracteres." })
    .optional().or(z.literal('')).or(z.null()),

  dataFundacao: optionalDate,

  website: optionalUrl,
});

export type EditoraSchema = z.infer<typeof editoraSchema>;
