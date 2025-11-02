import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { autorService } from '../services/autorService';
import type { Autor } from '../types/autor';
import toast from 'react-hot-toast';
import { FaSpinner, FaPlus, FaEdit, FaTrash, FaUserTie } from 'react-icons/fa';

const AuthorsListPage = () => {
  const [autores, setAutores] = useState<Autor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAutores = async () => {
      try {
        setIsLoading(true);
        const data = await autorService.getAllAutores();
        setAutores(data);
      } catch (error) {
        console.error("Erro ao buscar autores:", error);
        toast.error("Não foi possível carregar a lista de autores.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAutores();
  }, []);

  const handleEdit = (id?: string) => {
    if (!id) return;
    navigate(`/autores/editar/${id}`);
  };

  const handleDelete = async (id?: string, nome?: string) => {
    if (!id || !nome) return;
    if (window.confirm(`Tem certeza que deseja excluir o autor "${nome}"? Esta ação não pode ser desfeita.`)) {
      setIsLoading(true);
      try {
        await autorService.deleteAutor(id);
        setAutores(prevAutores => prevAutores.filter(a => a.id !== id));
        toast.success(`Autor "${nome}" excluído com sucesso!`);
      } catch (error) {
        console.error("Erro ao excluir autor:", error);
        toast.error(`Não foi possível excluir o autor "${nome}".`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <FaSpinner className="animate-spin text-primary text-4xl" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-violet-500 flex items-center gap-3">
          <FaUserTie /> Gerenciar Autores
        </h1>
        <Link
          to="/autores/novo"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-violet-700 transition-colors font-bold"
        >
          <FaPlus /> Adicionar Autor
        </Link>
      </div>

      <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="border-b border-zinc-600">
              <tr>
                <th className="p-4 text-gray-400">Nome</th>
                <th className="p-4 text-gray-400">Nacionalidade</th>
                <th className="p-4 text-gray-400">Nascimento</th>
                <th className="p-4 text-gray-400 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {autores.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">Nenhum autor cadastrado ainda.</td>
                </tr>
              ) : (
                autores.map((autor) => (
                  <tr key={autor.id} className="border-b border-zinc-700 hover:bg-zinc-700/50">
                    <td className="p-4 text-gray-100 font-medium">{autor.nome}</td>
                    <td className="p-4 text-gray-300">{autor.nacionalidade || '-'}</td>
                    <td className="p-4 text-gray-300">
                      {autor.dataNascimento
                        ? new Date(autor.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR')
                        : '-'}
                    </td>
                    <td className="p-4 space-x-2 text-right">
                      <button
                        onClick={() => handleEdit(autor.id)}
                        className="px-3 py-1 text-sm bg-yellow-600 hover:bg-yellow-500 text-white rounded transition-colors"
                        title="Editar Autor"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(autor.id, autor.nome)}
                        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
                        title="Deletar Autor"
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
    </div>
  );
};

export default AuthorsListPage;
