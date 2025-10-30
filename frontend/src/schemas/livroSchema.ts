import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const optionalDate = z.string()
  .regex(dateRegex, { message: "Data inválida (use YYYY-MM-DD)." })
  .optional().or(z.literal('')).or(z.null());

const optionalInteger = z.coerce
    .number("Deve ser um número.")
    .int({ message: "Deve ser um número inteiro." })
    .positive({ message: "Deve ser positivo." })
    .optional()
    .nullable();

export const livroSchema = z.object({
  titulo: z.string()
    .min(1, { message: "O título é obrigatório." })
    .max(255, { message: "Título muito longo." }),

  isbn: z.string()
    .min(10, { message: "ISBN deve ter pelo menos 10 caracteres (ISBN-10)." })
    .max(17, { message: "ISBN muito longo (ex: 978-3-16-148410-0)." })
    .nonempty({ message: "ISBN é obrigatório." }),

  edicao: optionalInteger,

  dataPublicacao: optionalDate,

  numeroPaginas: optionalInteger,

  genero: z.string()
    .max(100, { message: "Gênero muito longo." })
    .optional().or(z.literal('')).or(z.null()),

  resumo: z.string()
    .max(5000, { message: "Resumo muito longo (máx 5000 caracteres)." })
    .optional().or(z.literal('')).or(z.null()),

  autorId: z.string()
    .uuid({ message: "ID de autor inválido." })
    .nonempty({ message: "Selecione um autor." }),

  editoraId: z.string()
    .uuid({ message: "ID de editora inválido." })
    .optional().or(z.literal('')).or(z.null()),
});

export type LivroSchema = z.infer<typeof livroSchema>;
