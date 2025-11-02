import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { artigoService } from '../services/artigoService';
import type { Artigo } from '../types/artigo';
import toast from 'react-hot-toast';
import { FaSpinner, FaPlus, FaEdit, FaTrash, FaNewspaper } from 'react-icons/fa';
import axios from 'axios';
import * as Dialog from '@radix-ui/react-dialog';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';


const ArticlesListPage = () => {
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Artigo | null>(null);

  useEffect(() => {
    const fetchArtigos = async () => {
      try {
        setIsLoading(true);
        const data = await artigoService.getAllArtigos();
        setArtigos(data);
      } catch (error) {
        console.error("Erro ao buscar artigos:", error);
        toast.error("Não foi possível carregar a lista de artigos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtigos();
  }, []);

  const handleEdit = (id?: string) => {
    if (!id) return;
    navigate(`/artigos/editar/${id}`);
  };

  const handleDelete = (artigo: Artigo) => {
    setArticleToDelete(artigo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete || !articleToDelete.id) return;

    setIsDeleting(true);
    try {
      await artigoService.deleteArtigo(articleToDelete.id);
      setArtigos(prevArtigos => prevArtigos.filter(a => a.id !== articleToDelete.id));
      toast.success(`Artigo "${articleToDelete.titulo}" excluído com sucesso!`);
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Erro ao excluir artigo:", error);
       if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(`Erro: ${error.response.data.message}`);
      } else {
         toast.error(`Não foi possível excluir o artigo "${articleToDelete.titulo}".`);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
      setIsDeleteModalOpen(false);
      setArticleToDelete(null);
  }

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <FaSpinner className="animate-spin text-primary text-4xl" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-violet-500 flex items-center gap-3">
          <FaNewspaper /> Gerenciar Artigos
        </h1>
        <Link
          to="/artigos/novo"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-violet-700 transition-colors font-bold"
        >
          <FaPlus /> Adicionar Artigo
        </Link>
      </div>

      <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="border-b border-zinc-600">
              <tr>
                <th className="p-4 text-gray-400">Título</th>
                <th className="p-4 text-gray-400">DOI</th>
                <th className="p-4 text-gray-400">Publicação</th>
                <th className="p-4 text-gray-400">Revista</th>
                <th className="p-4 text-gray-400 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {artigos.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">Nenhum artigo cadastrado ainda.</td>
                </tr>
              ) : (
                artigos.map((artigo) => (
                  <tr key={artigo.id} className="border-b border-zinc-700 hover:bg-zinc-700/50">
                    <td className="p-4 text-gray-100 font-medium max-w-sm truncate" title={artigo.titulo}>{artigo.titulo}</td>
                    <td className="p-4 text-gray-300 font-mono text-sm">{artigo.doi}</td>
                    <td className="p-4 text-gray-300">
                      {artigo.dataPublicacao
                        ? new Date(artigo.dataPublicacao + 'T00:00:00').toLocaleDateString('pt-BR')
                        : '-'}
                    </td>
                    <td className="p-4 text-gray-300 max-w-xs truncate" title={artigo.revista ?? ''}>{artigo.revista || '-'}</td>
                    <td className="p-4 space-x-2 text-right">
                      <button
                        onClick={() => handleEdit(artigo.id)}
                        className="px-3 py-1 text-sm bg-yellow-600 hover:bg-yellow-500 text-white rounded transition-colors"
                        title="Editar Artigo"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(artigo)}
                        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
                        title="Deletar Artigo"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
         <Dialog.Portal>
          <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-zinc-800 border border-red-500/50 p-6 shadow-lg z-50 focus:outline-none">
             <Dialog.Title className="text-red-500 text-xl font-bold mb-4 flex items-center gap-2">
              <FaExclamationTriangle /> Confirmação Necessária
            </Dialog.Title>
            <Dialog.Description className="text-gray-300 mb-5 text-sm">
              Você tem certeza que deseja excluir permanentemente o artigo <strong>{articleToDelete?.titulo}</strong>? Esta ação não pode ser desfeita.
            </Dialog.Description>
             <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  className="px-4 py-2 bg-zinc-600 text-gray-200 rounded hover:bg-zinc-500 transition-colors"
                  onClick={handleCloseDeleteModal}
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[150px]"
              >
                {isDeleting ? <FaSpinner className="animate-spin"/> : 'Excluir Permanentemente'}
              </button>
            </div>
             <Dialog.Close asChild>
               <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-200" aria-label="Fechar" onClick={handleCloseDeleteModal}>
                 <FaTimes />
               </button>
             </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
};

export default ArticlesListPage;
