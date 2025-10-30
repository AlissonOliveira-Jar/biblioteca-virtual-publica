import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { livroSchema } from "../schemas/livroSchema";

import type { LivroSchema } from "../schemas/livroSchema";
import type { UseFormProps, Resolver } from "react-hook-form";

type FormValues = LivroSchema;

export const useLivroForm = (options?: UseFormProps<FormValues>) => {
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(livroSchema) as Resolver<FormValues, any>, 
    mode: 'onTouched',
    defaultValues: {
      titulo: '',
      isbn: '',
      edicao: null,
      dataPublicacao: '',
      numeroPaginas: null,
      genero: '',
      resumo: '',
      autorId: '',
      editoraId: '',
      ...options?.defaultValues,
    },
    ...options,
  });

  return formMethods;
};
