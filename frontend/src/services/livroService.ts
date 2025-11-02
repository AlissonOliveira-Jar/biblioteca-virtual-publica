import api from './api';
import type { Livro, LivroFormData } from '../types/livro';

const BASE_URL = '/livros';

const getAllLivros = async (): Promise<Livro[]> => {
  const response = await api.get<Livro[]>(BASE_URL);
  return response.data;
};

const getLivroById = async (id: string): Promise<Livro> => {
  const response = await api.get<Livro>(`${BASE_URL}/${id}`);
  return response.data;
};

const createLivro = async (data: LivroFormData): Promise<Livro> => {
  const response = await api.post<Livro>(BASE_URL, data);
  return response.data;
};

const updateLivro = async (id: string, data: LivroFormData): Promise<Livro> => {
  const response = await api.put<Livro>(`${BASE_URL}/${id}`, data);
  return response.data;
};

const deleteLivro = async (id: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};

const findByTitulo = async (titulo: string): Promise<Livro[]> => {
  const response = await api.get<Livro[]>(`${BASE_URL}/titulo`, { params: { q: titulo } });
  return response.data;
};

const findByGenero = async (genero: string): Promise<Livro[]> => {
  const response = await api.get<Livro[]>(`${BASE_URL}/genero`, { params: { q: genero } });
  return response.data;
};

const findByAutor = async (autorId: string): Promise<Livro[]> => {
  const response = await api.get<Livro[]>(`${BASE_URL}/autor/${autorId}`);
  return response.data;
};

const findByEditora = async (editoraId: string): Promise<Livro[]> => {
  const response = await api.get<Livro[]>(`${BASE_URL}/editora/${editoraId}`);
  return response.data;
};

export const livroService = {
  getAllLivros,
  getLivroById,
  createLivro,
  updateLivro,
  deleteLivro,
  findByTitulo,
  findByGenero,
  findByAutor,
  findByEditora,
};
