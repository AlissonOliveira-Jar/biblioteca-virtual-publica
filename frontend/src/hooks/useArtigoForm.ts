import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { artigoSchema } from "../schemas/artigoSchema";

import type { ArtigoSchema } from "../schemas/artigoSchema";
import type { UseFormProps } from "react-hook-form";
import type { Resolver } from 'react-hook-form';

type FormValues = ArtigoSchema;

export const useArtigoForm = (options?: UseFormProps<FormValues>) => {
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(artigoSchema) as Resolver<FormValues, any>,
    mode: 'onTouched',
    defaultValues: {
      titulo: '',
      doi: '',
      dataPublicacao: '',
      resumo: '',
      palavrasChave: '',
      autoresIds: [],
      revista: '',
      volume: '',
      numero: '',
      paginaInicial: null,
      paginaFinal: null,
      ...options?.defaultValues,
    },
    ...options,
  });

  return formMethods;
};
