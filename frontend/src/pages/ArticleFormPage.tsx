import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { artigoService } from '../services/artigoService';
import { autorService } from '../services/autorService';
import toast from 'react-hot-toast';
import { useArtigoForm } from '../hooks/useArtigoForm';
import type { ArtigoSchema } from '../schemas/artigoSchema';
import type { Autor } from '../types/autor';
import * as Form from '@radix-ui/react-form';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { FaSpinner, FaSave, FaPlusCircle, FaUserEdit } from 'react-icons/fa';
import axios from 'axios';
import { Controller } from 'react-hook-form';

const ArticleFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allAuthors, setAllAuthors] = useState<Autor[]>([]);

  const { register, handleSubmit, formState: { errors, isDirty }, reset, control } = useArtigoForm();

useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const authorsData = await autorService.getAllAutores();
        setAllAuthors(authorsData);

        if (isEditMode && id) {
          const artigoData = await artigoService.getArtigoById(id);

          const formData = {
            ...artigoData,
            dataPublicacao: artigoData.dataPublicacao ?? '',
            resumo: artigoData.resumo ?? '',
            palavrasChave: artigoData.palavrasChave ?? '',
            revista: artigoData.revista ?? '',
            volume: artigoData.volume ?? '',
            numero: artigoData.numero ?? '',
            paginaInicial: artigoData.paginaInicial ?? null, 
            paginaFinal: artigoData.paginaFinal ?? null,
          };
          reset(formData);

        } else {
          setIsLoadingData(false);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados. Voltando para a lista.");
        navigate('/artigos');
      } finally {
        if (isEditMode) setIsLoadingData(false);
      }
    };

    fetchData();
  }, [id, isEditMode, reset, navigate]);

  const onSubmit = async (data: ArtigoSchema) => {
    setIsSubmitting(true);

    const dataToSend = {
      ...data,
      dataPublicacao: data.dataPublicacao || null,
      resumo: data.resumo || null,
      palavrasChave: data.palavrasChave || null,
      revista: data.revista || null,
      volume: data.volume || null,
      numero: data.numero || null,
      paginaInicial: data.paginaInicial || null,
      paginaFinal: data.paginaFinal || null,
    };

    try {
      if (isEditMode && id) {
        await artigoService.updateArtigo(id, dataToSend);
        toast.success("Artigo atualizado com sucesso!");
      } else {
        await artigoService.createArtigo(dataToSend);
        toast.success("Artigo criado com sucesso!");
      }
      navigate('/artigos');
    } catch (error) {
      console.error("Erro ao salvar artigo:", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(`Erro: ${error.response.data.message}`);
      } else {
        toast.error(`Não foi possível ${isEditMode ? 'atualizar' : 'criar'} o artigo.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <FaSpinner className="animate-spin text-primary text-4xl" />
        <p className="ml-4 text-gray-400">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-violet-500 mb-8 text-center flex items-center justify-center gap-3">
        {isEditMode ? <FaUserEdit /> : <FaPlusCircle />}
        {isEditMode ? 'Editar Artigo' : 'Adicionar Novo Artigo'}
      </h1>

      <Form.Root
        onSubmit={handleSubmit(onSubmit)}
        className="bg-zinc-800 p-8 rounded-lg border border-zinc-700 shadow-lg space-y-4"
      >
        <Form.Field name="titulo" className="flex flex-col gap-1">
          <Form.Label className="text-gray-400 font-medium">Título:</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              {...register("titulo")}
              className="h-10 pl-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </Form.Control>
          {errors.titulo && <small className="text-red-500 italic">{errors.titulo.message}</small>}
        </Form.Field>

        <Form.Field name="doi" className="flex flex-col gap-1">
          <Form.Label className="text-gray-400 font-medium">DOI (Digital Object Identifier):</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              {...register("doi")}
              className="h-10 pl-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </Form.Control>
          {errors.doi && <small className="text-red-500 italic">{errors.doi.message}</small>}
        </Form.Field>

        <Form.Field name="autoresIds" className="flex flex-col gap-1">
          <Form.Label className="text-gray-400 font-medium">Autores (Selecione pelo menos um):</Form.Label>
          <Controller
            control={control}
            name="autoresIds"
            render={({ field }) => (
              <div className="bg-zinc-900 border border-zinc-700 rounded-md p-3 max-h-60 overflow-y-auto space-y-2">
                {allAuthors.length === 0 ? (
                   <p className="text-gray-500 text-sm">Nenhum autor encontrado...</p>
                ) : (
                  allAuthors.map((autor) => (
                    <div className="flex items-center gap-2" key={autor.id}>
                      <Checkbox.Root
                        className="flex h-5 w-5 appearance-none items-center justify-center rounded bg-zinc-700 outline-none data-[state=checked]:bg-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-zinc-900"
                        id={`autor-${autor.id}`}
                        checked={field.value.includes(autor.id!)}
                        onCheckedChange={(checked) => {
                          const currentIds = field.value;
                          if (checked === true) {
                            field.onChange([...currentIds, autor.id!]);
                          } else {
                            field.onChange(currentIds.filter((id) => id !== autor.id!));
                          }
                        }}
                      >
                        <Checkbox.Indicator className="text-white"><CheckIcon /></Checkbox.Indicator>
                      </Checkbox.Root>
                      <label className="text-gray-300 text-sm select-none" htmlFor={`autor-${autor.id}`}>
                        {autor.nome}
                      </label>
                    </div>
                  ))
                )}
              </div>
            )}
          />
          {errors.autoresIds && <small className="text-red-500 italic">{errors.autoresIds.message}</small>}
        </Form.Field>

        <Form.Field name="dataPublicacao" className="flex flex-col gap-1">
          <Form.Label className="text-gray-400 font-medium">Data de Publicação:</Form.Label>
          <Form.Control asChild>
            <input
              type="date"
              {...register("dataPublicacao")}
              className="h-10 px-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
            />
          </Form.Control>
          {errors.dataPublicacao && <small className="text-red-500 italic">{errors.dataPublicacao.message}</small>}
        </Form.Field>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Field name="revista" className="flex flex-col gap-1">
            <Form.Label className="text-gray-400 font-medium">Revista:</Form.Label>
            <Form.Control asChild>
              <input type="text" {...register("revista")} className="h-10 pl-3 bg-zinc-900 text-white rounded-md border border-zinc-700" />
            </Form.Control>
            {errors.revista && <small className="text-red-500 italic">{errors.revista.message}</small>}
          </Form.Field>
          <Form.Field name="volume" className="flex flex-col gap-1">
            <Form.Label className="text-gray-400 font-medium">Volume:</Form.Label>
            <Form.Control asChild>
              <input type="text" {...register("volume")} className="h-10 pl-3 bg-zinc-900 text-white rounded-md border border-zinc-700" />
            </Form.Control>
            {errors.volume && <small className="text-red-500 italic">{errors.volume.message}</small>}
          </Form.Field>
          <Form.Field name="numero" className="flex flex-col gap-1">
            <Form.Label className="text-gray-400 font-medium">Número:</Form.Label>
            <Form.Control asChild>
              <input type="text" {...register("numero")} className="h-10 pl-3 bg-zinc-900 text-white rounded-md border border-zinc-700" />
            </Form.Control>
            {errors.numero && <small className="text-red-500 italic">{errors.numero.message}</small>}
          </Form.Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Field name="paginaInicial" className="flex flex-col gap-1">
            <Form.Label className="text-gray-400 font-medium">Página Inicial:</Form.Label>
            <Form.Control asChild>
              <input
                type="number"
                {...register("paginaInicial")}
                className="h-10 pl-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </Form.Control>
            {errors.paginaInicial && <small className="text-red-500 italic">{errors.paginaInicial.message}</small>}
          </Form.Field>
          <Form.Field name="paginaFinal" className="flex flex-col gap-1">
            <Form.Label className="text-gray-400 font-medium">Página Final:</Form.Label>
            <Form.Control asChild>
              <input
                type="number"
                {...register("paginaFinal")}
                className="h-10 pl-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </Form.Control>
            {errors.paginaFinal && <small className="text-red-500 italic">{errors.paginaFinal.message}</small>}
          </Form.Field>
        </div>

        <Form.Field name="palavrasChave" className="flex flex-col gap-1">
          <Form.Label className="text-gray-400 font-medium">Palavras-Chave (separadas por vírgula):</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              {...register("palavrasChave")}
              className="h-10 pl-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </Form.Control>
          {errors.palavrasChave && <small className="text-red-500 italic">{errors.palavrasChave.message}</small>}
        </Form.Field>

        <Form.Field name="resumo" className="flex flex-col gap-1">
          <Form.Label className="text-gray-400 font-medium">Resumo:</Form.Label>
          <Form.Control asChild>
            <textarea
              {...register("resumo")}
              rows={5}
              className="p-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary resize-y"
            />
          </Form.Control>
          {errors.resumo && <small className="text-red-500 italic">{errors.resumo.message}</small>}
        </Form.Field>

        <div className="flex justify-end gap-4 pt-4">
           <button
            type="button"
            onClick={() => navigate('/artigos')}
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
              {isSubmitting ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Criar Artigo')}
            </button>
          </Form.Submit>
        </div>
      </Form.Root>
    </div>
  );
};

export default ArticleFormPage;
