import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { livroService } from '../services/livroService';
import { autorService } from '../services/autorService';
import { editoraService } from '../services/editoraService';
import { driveService } from '../services/driveService';
import toast from 'react-hot-toast';
import { useLivroForm } from '../hooks/useLivroForm';
import type { LivroSchema } from '../schemas/livroSchema';
import type { Autor } from '../types/autor';
import type { Editora } from '../types/editora';
import type { DriveFile } from '../services/driveService';
import * as Form from '@radix-ui/react-form';
import { FaSpinner, FaSave, FaBook, FaUserEdit } from 'react-icons/fa';
import axios from 'axios';

const BookFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allAuthors, setAllAuthors] = useState<Autor[]>([]);
  const [allEditors, setAllEditors] = useState<Editora[]>([]);
  const [allDriveFiles, setAllDriveFiles] = useState<DriveFile[]>([]);

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useLivroForm();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [authorsData, editorsData, driveFilesData] = await Promise.all([
          autorService.getAllAutores(),
          editoraService.getAllEditoras(),
          driveService.getDriveFiles()
        ]);
        setAllAuthors(authorsData);
        setAllEditors(editorsData);
        setAllDriveFiles(driveFilesData);

        if (isEditMode && id) {
          const livroData = await livroService.getLivroById(id);
          
          const formData = {
            ...livroData,
            edicao: livroData.edicao ?? null,
            dataPublicacao: livroData.dataPublicacao ?? '',
            numeroPaginas: livroData.numeroPaginas ?? null,
            genero: livroData.genero ?? '',
            resumo: livroData.resumo ?? '',
            autorId: livroData.autorId ?? '', 
            editoraId: livroData.editoraId ?? '',
            googleDriveFileId: livroData.googleDriveFileId ?? ''
          };
          reset(formData);
        }
        
      } catch (error) {
        console.error("Erro ao carregar dados do formulário:", error);
        toast.error("Erro ao carregar dados. Voltando para a lista.");
        navigate('/livros');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [id, isEditMode, reset, navigate]);

  const onSubmit = async (data: LivroSchema) => {
    setIsSubmitting(true);

    const dataToSend = {
      ...data,
      edicao: data.edicao || null,
      dataPublicacao: data.dataPublicacao || null,
      numeroPaginas: data.numeroPaginas || null,
      genero: data.genero || null,
      resumo: data.resumo || null,
      editoraId: data.editoraId || null,
      googleDriveFileId: data.googleDriveFileId || null
    };

    try {
      if (isEditMode && id) {
        await livroService.updateLivro(id, dataToSend);
        toast.success("Livro atualizado com sucesso!");
      } else {
        await livroService.createLivro(dataToSend);
        toast.success("Livro criado com sucesso!");
      }
      navigate('/livros');
    } catch (error) {
      console.error("Erro ao salvar livro:", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(`Erro: ${error.response.data.message}`);
      } else {
        toast.error(`Não foi possível ${isEditMode ? 'atualizar' : 'criar'} o livro.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="grow flex items-center justify-center">
        <FaSpinner className="animate-spin text-primary text-4xl" />
        <p className="ml-4 text-gray-400">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-800 to-violet-500 mb-8 text-center flex items-center justify-center gap-3">
        {isEditMode ? <FaUserEdit /> : <FaBook />}
        {isEditMode ? 'Editar Livro' : 'Adicionar Novo Livro'}
      </h1>

      <Form.Root
        onSubmit={handleSubmit(onSubmit)}
        className="bg-zinc-800 p-8 rounded-lg border border-zinc-700 shadow-lg space-y-4"
      >
        {/* Título (Obrigatório) */}
        <Form.Field name="titulo" className="flex flex-col gap-1">
          <Form.Label className="text-gray-400 font-medium">Título:</Form.Label>
          <Form.Control asChild>
            <input 
              type="text" 
              {...register("titulo")} 
              className="h-10 px-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </Form.Control>
          {errors.titulo && <small className="text-red-500 italic">{errors.titulo.message}</small>}
        </Form.Field>

        {/* ISBN (Obrigatório) */}
        <Form.Field name="isbn" className="flex flex-col gap-1">
          <Form.Label className="text-gray-400 font-medium">ISBN:</Form.Label>
          <Form.Control asChild>
            <input 
              type="text" 
              {...register("isbn")} 
              className="h-10 px-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </Form.Control>
          {errors.isbn && <small className="text-red-500 italic">{errors.isbn.message}</small>}
        </Form.Field>

        {/* Autor (Obrigatório - Select) */}
        <Form.Field name="autorId" className="flex flex-col gap-1">
          <Form.Label className="text-gray-400 font-medium">Autor:</Form.Label>
          <Form.Control asChild>
            <select
              {...register("autorId")}
              className="h-10 px-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Selecione um autor...</option>
              {allAuthors.map((autor) => (
                <option key={autor.id} value={autor.id}>{autor.nome}</option>
              ))}
            </select>
          </Form.Control>
          {errors.autorId && <small className="text-red-500 italic">{errors.autorId.message}</small>}
        </Form.Field>

        {/* Editora (Opcional - Select) */}
        <Form.Field name="editoraId" className="flex flex-col gap-1">
          <Form.Label className="text-gray-400 font-medium">Editora (Opcional):</Form.Label>
          <Form.Control asChild>
            <select
              {...register("editoraId")}
              className="h-10 px-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Nenhuma editora</option>
              {allEditors.map((editora) => (
                <option key={editora.id} value={editora.id}>{editora.nome}</option>
              ))}
            </select>
          </Form.Control>
          {errors.editoraId && <small className="text-red-500 italic">{errors.editoraId.message}</small>}
        </Form.Field>

        {/* Linha para Edição, Páginas e Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Field name="edicao" className="flex flex-col gap-1">
            <Form.Label className="text-gray-400 font-medium">Edição:</Form.Label>
            <Form.Control asChild>
              <input 
                type="number" 
                {...register("edicao")} 
                className="h-10 px-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </Form.Control>
            {errors.edicao && <small className="text-red-500 italic">{errors.edicao.message}</small>}
          </Form.Field>
          
          <Form.Field name="numeroPaginas" className="flex flex-col gap-1">
            <Form.Label className="text-gray-400 font-medium">Nº de Páginas:</Form.Label>
            <Form.Control asChild>
              <input 
                type="number" 
                {...register("numeroPaginas")} 
                className="h-10 px-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </Form.Control>
            {errors.numeroPaginas && <small className="text-red-500 italic">{errors.numeroPaginas.message}</small>}
          </Form.Field>
          
          <Form.Field name="dataPublicacao" className="flex flex-col gap-1">
            <Form.Label className="text-gray-400 font-medium">Publicação:</Form.Label>
            <Form.Control asChild>
              <input 
                type="date" 
                {...register("dataPublicacao")} 
                className="h-10 px-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary appearance-none" 
              />
            </Form.Control>
            {errors.dataPublicacao && <small className="text-red-500 italic">{errors.dataPublicacao.message}</small>}
          </Form.Field>
        </div>

        {/* Gênero */}
        <Form.Field name="genero" className="flex flex-col gap-1">
          <Form.Label className="text-gray-400 font-medium">Gênero (separado por vírgula):</Form.Label>
          <Form.Control asChild>
            <input 
              type="text" 
              {...register("genero")} 
              className="h-10 px-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </Form.Control>
          {errors.genero && <small className="text-red-500 italic">{errors.genero.message}</small>}
        </Form.Field>

        {/* Resumo */}
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

        {/* Drive */}
        <Form.Field name="googleDriveFileId" className="flex flex-col gap-1">
          <Form.Label className="text-gray-400 font-medium">Arquivo do Google Drive (Opcional):</Form.Label>
          <Form.Control asChild>
            <select
              {...register("googleDriveFileId")}
              className="h-10 px-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="">Nenhum arquivo (somente metadados)</option>
              {allDriveFiles.map((file) => (
                <option key={file.id} value={file.id}>{file.name}</option>
              ))}
            </select>
          </Form.Control>
          {errors.googleDriveFileId && <small className="text-red-500 italic">{errors.googleDriveFileId.message}</small>}
        </Form.Field>

        {/* Botões */}
        <div className="flex justify-end gap-4 pt-4">
           <button
            type="button"
            onClick={() => navigate('/livros')}
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
              {isSubmitting ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Criar Livro')}
            </button>
          </Form.Submit>
        </div>
      </Form.Root>
    </div>
  );
};

export default BookFormPage;
