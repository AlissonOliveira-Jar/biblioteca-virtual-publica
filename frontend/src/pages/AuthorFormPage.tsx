import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { autorService } from '../services/autorService';
import toast from 'react-hot-toast';
import { useAutorForm } from '../hooks/useAutorForm';
import type { AutorSchema } from '../schemas/autorSchema';
import * as Form from '@radix-ui/react-form';
import { FaSpinner, FaSave, FaUserPlus, FaUserEdit } from 'react-icons/fa';
import axios from 'axios';

const AuthorFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [isLoadingData, setIsLoadingData] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useAutorForm();

  useEffect(() => {
    if (isEditMode && id) {
      setIsLoadingData(true);
      autorService.getAutorById(id)
        .then(autorData => {
          const formData = {
            ...autorData,
            nacionalidade: autorData.nacionalidade ?? '',
            dataNascimento: autorData.dataNascimento ?? '',
            dataFalescimento: autorData.dataFalescimento ?? '',
            biografia: autorData.biografia ?? '',
          };
          reset(formData);
        })
        .catch(error => {
          console.error("Erro ao buscar autor para edição:", error);
          toast.error("Autor não encontrado ou erro ao carregar.");
          navigate('/autores');
        })
        .finally(() => setIsLoadingData(false));
    }
  }, [id, isEditMode, reset, navigate]);

  const onSubmit = async (data: AutorSchema) => {
    setIsSubmitting(true);

    const dataToSend = {
      ...data,
      nacionalidade: data.nacionalidade || null,
      dataNascimento: data.dataNascimento || null,
      dataFalescimento: data.dataFalescimento || null,
      biografia: data.biografia || null,
    };

    try {
      if (isEditMode && id) {
        await autorService.updateAutor(id, dataToSend);
        toast.success("Autor atualizado com sucesso!");
      } else {
        await autorService.createAutor(dataToSend);
        toast.success("Autor criado com sucesso!");
      }
      navigate('/autores');
    } catch (error) {
      console.error("Erro ao salvar autor:", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(`Erro: ${error.response.data.message}`);
      } else {
        toast.error(`Não foi possível ${isEditMode ? 'atualizar' : 'criar'} o autor.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <FaSpinner className="animate-spin text-primary text-4xl" />
        <p className="ml-4 text-gray-400">Carregando dados do autor...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-violet-500 mb-8 text-center flex items-center justify-center gap-3">
        {isEditMode ? <FaUserEdit /> : <FaUserPlus />}
        {isEditMode ? 'Editar Autor' : 'Adicionar Novo Autor'}
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

        <Form.Field name="nacionalidade" className="flex flex-col gap-1">
          <Form.Label className="text-gray-400 font-medium">Nacionalidade:</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              {...register("nacionalidade")}
              className="h-10 pl-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </Form.Control>
          {errors.nacionalidade && (
            <small className="text-red-500 italic">{errors.nacionalidade.message}</small>
          )}
        </Form.Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Field name="dataNascimento" className="flex flex-col gap-1">
            <Form.Label className="text-gray-400 font-medium">Data de Nascimento:</Form.Label>
            <Form.Control asChild>
              <input
                type="date"
                {...register("dataNascimento")}
                className="h-10 px-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary appearance-none" // appearance-none para estilo
                placeholder="YYYY-MM-DD"
              />
            </Form.Control>
            {errors.dataNascimento && (
              <small className="text-red-500 italic">{errors.dataNascimento.message}</small>
            )}
          </Form.Field>
          <Form.Field name="dataFalescimento" className="flex flex-col gap-1">
            <Form.Label className="text-gray-400 font-medium">Data de Falecimento:</Form.Label>
            <Form.Control asChild>
              <input
                type="date"
                {...register("dataFalescimento")}
                className="h-10 px-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                placeholder="YYYY-MM-DD"
              />
            </Form.Control>
            {errors.dataFalescimento && (
              <small className="text-red-500 italic">{errors.dataFalescimento.message}</small>
            )}
          </Form.Field>
        </div>

        <Form.Field name="biografia" className="flex flex-col gap-1">
          <Form.Label className="text-gray-400 font-medium">Biografia:</Form.Label>
          <Form.Control asChild>
            <textarea
              {...register("biografia")}
              rows={5}
              className="p-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary resize-y"
            />
          </Form.Control>
          {errors.biografia && (
            <small className="text-red-500 italic">{errors.biografia.message}</small>
          )}
        </Form.Field>

        <div className="flex justify-end gap-4 pt-4">
           <button
            type="button"
            onClick={() => navigate('/autores')}
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
              {isSubmitting ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Criar Autor')}
            </button>
          </Form.Submit>
        </div>
      </Form.Root>
    </div>
  );
};

export default AuthorFormPage;
