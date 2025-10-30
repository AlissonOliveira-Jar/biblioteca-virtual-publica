import api from './api';
import type { Autor, AutorFormData } from '../types/autor';

const BASE_URL = '/autores';

const getAllAutores = async (): Promise<Autor[]> => {
  const response = await api.get<Autor[]>(BASE_URL);
  return response.data;
};

const getAutorById = async (id: string): Promise<Autor> => {
  const response = await api.get<Autor>(`${BASE_URL}/${id}`);
  return response.data;
};

const createAutor = async (data: AutorFormData): Promise<Autor> => {
  const response = await api.post<Autor>(BASE_URL, data);
  return response.data;
};

const updateAutor = async (id: string, data: AutorFormData): Promise<Autor> => {
  const response = await api.put<Autor>(`${BASE_URL}/${id}`, data);
  return response.data;
};

const deleteAutor = async (id: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};

export const autorService = {
  getAllAutores,
  getAutorById,
  createAutor,
  updateAutor,
  deleteAutor,
};
