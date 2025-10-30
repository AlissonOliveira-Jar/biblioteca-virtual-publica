import api from './api';
import type { Editora, EditoraFormData } from '../types/editora';

const BASE_URL = '/editoras';

const getAllEditoras = async (nome?: string): Promise<Editora[]> => {
  const params = nome ? { nome } : {};
  const response = await api.get<Editora[]>(BASE_URL, { params });
  return response.data;
};

const getEditoraById = async (id: string): Promise<Editora> => {
  const response = await api.get<Editora>(`${BASE_URL}/${id}`);
  return response.data;
};

const createEditora = async (data: EditoraFormData): Promise<Editora> => {
  const response = await api.post<Editora>(BASE_URL, data);
  return response.data;
};

const updateEditora = async (id: string, data: EditoraFormData): Promise<Editora> => {
  const response = await api.put<Editora>(`${BASE_URL}/${id}`, data);
  return response.data;
};

const deleteEditora = async (id: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};

export const editoraService = {
  getAllEditoras,
  getEditoraById,
  createEditora,
  updateEditora,
  deleteEditora,
};
