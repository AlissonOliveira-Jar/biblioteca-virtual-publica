import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { editoraService } from '../services/editoraService';
import toast from 'react-hot-toast';
import { useEditoraForm } from '../hooks/useEditoraForm';
import type { EditoraSchema } from '../schemas/editoraSchema';
import * as Form from '@radix-ui/react-form';
import { FaSpinner, FaSave, FaPlusCircle, FaEdit } from 'react-icons/fa';
import axios from 'axios';

const PublisherFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [isLoadingData, setIsLoadingData] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useEditoraForm();

  useEffect(() => {
    if (isEditMode && id) {
      setIsLoadingData(true);
      editoraService.getEditoraById(id)
        .then(editoraData => {
          const formData = {
            ...editoraData,
            pais: editoraData.pais ?? '',
            dataFundacao: editoraData.dataFundacao ?? '',
            website: editoraData.website ?? '',
          };
          reset(formData);
        })
        .catch(error => {
          console.error("Erro ao buscar editora para edição:", error);
          toast.error("Editora não encontrada ou erro ao carregar.");
          navigate('/editoras');
        })
        .finally(() => setIsLoadingData(false));
    }
  }, [id, isEditMode, reset, navigate]);

  const onSubmit = async (data: EditoraSchema) => {
    setIsSubmitting(true);

    const dataToSend = {
      ...data,
      pais: data.pais || null,
      dataFundacao: data.dataFundacao || null,
      website: data.website || null,
    };

    try {
      if (isEditMode && id) {
        await editoraService.updateEditora(id, dataToSend);
        toast.success("Editora atualizada com sucesso!");
      } else {
        await editoraService.createEditora(dataToSend);
        toast.success("Editora criada com sucesso!");
      }
      navigate('/editoras');
    } catch (error) {
      console.error("Erro ao salvar editora:", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(`Erro: ${error.response.data.message}`);
      } else {
        toast.error(`Não foi possível ${isEditMode ? 'atualizar' : 'criar'} a editora.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <FaSpinner className="animate-spin text-primary text-4xl" />
        <p className="ml-4 text-gray-400">Carregando dados da editora...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-violet-500 mb-8 text-center flex items-center justify-center gap-3">
        {isEditMode ? <FaEdit /> : <FaPlusCircle />}
        {isEditMode ? 'Editar Editora' : 'Adicionar Nova Editora'}
      </h1>

      <Form.Root
        onSubmit={handleSubmit(onSubmit)}
        className="bg-zinc-800 p-8 rounded-lg border border-zinc-700 shadow-lg space-y-4"
      >
        <Form.Field name="nome" className="flex flex-col gap-1">
          <Form.Label className="text-gray-400 font-medium">Nome:</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              {...register("nome")}
              className="h-10 pl-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </Form.Control>
          {errors.nome && (
            <small className="text-red-500 italic">{errors.nome.message}</small>
          )}
        </Form.Field>

        <Form.Field name="pais" className="flex flex-col gap-1">
          <Form.Label className="text-gray-400 font-medium">País:</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              {...register("pais")}
              className="h-10 pl-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </Form.Control>
          {errors.pais && (
            <small className="text-red-500 italic">{errors.pais.message}</small>
          )}
        </Form.Field>

        <Form.Field name="dataFundacao" className="flex flex-col gap-1">
          <Form.Label className="text-gray-400 font-medium">Data de Fundação:</Form.Label>
          <Form.Control asChild>
            <input
              type="date"
              {...register("dataFundacao")}
              className="h-10 px-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
            />
          </Form.Control>
          {errors.dataFundacao && (
            <small className="text-red-500 italic">{errors.dataFundacao.message}</small>
          )}
        </Form.Field>

        <Form.Field name="website" className="flex flex-col gap-1">
          <Form.Label className="text-gray-400 font-medium">Website:</Form.Label>
          <Form.Control asChild>
            <input
              type="url"
              placeholder="https://www.exemplo.com"
              {...register("website")}
              className="h-10 pl-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </Form.Control>
          {errors.website && (
            <small className="text-red-500 italic">{errors.website.message}</small>
          )}
        </Form.Field>

        {/* Botões */}
        <div className="flex justify-end gap-4 pt-4">
           <button
            type="button"
            onClick={() => navigate('/editoras')}
            className="px-6 py-2 bg-zinc-600 text-gray-200 rounded hover:bg-zinc-500 transition-colors font-medium"
          >
            Cancelar
          </button>
          <Form.Submit asChild>
            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className="px-6 py-2 bg-primary text-white rounded hover:bg-violet-700 transition-colors font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
              {isSubmitting ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Criar Editora')}
            </button>
          </Form.Submit>
        </div>
      </Form.Root>
    </div>
  );
};

export default PublisherFormPage;
