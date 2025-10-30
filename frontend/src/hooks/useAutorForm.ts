import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { autorSchema } from "../schemas/autorSchema";
import type { AutorSchema } from "../schemas/autorSchema";

import type { UseFormProps } from "react-hook-form";

type FormValues = AutorSchema;

export const useAutorForm = (options?: UseFormProps<FormValues>) => {
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(autorSchema),
    mode: 'onTouched',
    defaultValues: {
      nome: '',
      nacionalidade: '',
      dataNascimento: '',
      dataFalescimento: '',
      biografia: '',
      ...options?.defaultValues,
    },
    ...options,
  });

  return formMethods;
};
