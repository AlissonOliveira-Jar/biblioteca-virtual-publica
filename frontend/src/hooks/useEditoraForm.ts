import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { editoraSchema } from "../schemas/editoraSchema";

import type { EditoraSchema } from "../schemas/editoraSchema";
import type { UseFormProps } from "react-hook-form";

type FormValues = EditoraSchema;

export const useEditoraForm = (options?: UseFormProps<FormValues>) => {
  const formMethods = useForm<FormValues>({
    resolver: zodResolver(editoraSchema),
    mode: 'onTouched',
    defaultValues: {
      nome: '',
      pais: '',
      dataFundacao: '',
      website: '',
      ...options?.defaultValues,
    },
    ...options,
  });

  return formMethods;
};
