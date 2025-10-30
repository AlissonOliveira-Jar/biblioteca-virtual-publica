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

export const artigoSchema = z.object({
  titulo: z.string()
    .min(3, { message: "O título deve ter pelo menos 3 caracteres." })
    .max(255, { message: "Título muito longo." }),

  doi: z.string()
    .min(5, { message: "DOI inválido ou muito curto." })
    .max(100, { message: "DOI muito longo."})
    .nonempty("DOI é obrigatório."),

  dataPublicacao: optionalDate,

  resumo: z.string()
    .max(5000, { message: "Resumo muito longo (máx 5000 caracteres)." })
    .optional().or(z.literal('')).or(z.null()),

  palavrasChave: z.string()
    .max(255, { message: "Palavras-chave muito longas."})
    .optional().or(z.literal('')).or(z.null()),

  autoresIds: z.array(
      z.uuid({ message: "ID de autor inválido." })
    )
    .min(1, { message: "Selecione pelo menos um autor." }),

  revista: z.string()
    .max(150, { message: "Nome da revista muito longo." })
    .optional().or(z.literal('')).or(z.null()),

  volume: z.string()
    .max(20, { message: "Volume muito longo." })
    .optional().or(z.literal('')).or(z.null()),

  numero: z.string()
    .max(20, { message: "Número muito longo." })
    .optional().or(z.literal('')).or(z.null()),

  paginaInicial: optionalInteger,

  paginaFinal: optionalInteger,
})
.refine((data) => {
  if (data.paginaInicial != null && data.paginaFinal != null) {
    return data.paginaFinal >= data.paginaInicial;
  }
  return true;
}, {
  message: "Página final não pode ser menor que a página inicial.",
  path: ["paginaFinal"],
});

export type ArtigoSchema = z.infer<typeof artigoSchema>;
