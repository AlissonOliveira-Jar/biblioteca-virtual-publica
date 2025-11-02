import api from './api';
import type { Artigo, ArtigoFormData } from '../types/artigo';

const BASE_URL = '/artigos';

const getAllArtigos = async (): Promise<Artigo[]> => {
  const response = await api.get<Artigo[]>(BASE_URL);
  return response.data;
};

const getArtigoById = async (id: string): Promise<Artigo> => {
  const response = await api.get<Artigo>(`${BASE_URL}/${id}`);
  return response.data;
};

const createArtigo = async (data: ArtigoFormData): Promise<Artigo> => {
  const response = await api.post<Artigo>(BASE_URL, data);
  return response.data;
};

const updateArtigo = async (id: string, data: ArtigoFormData): Promise<Artigo> => {
  const response = await api.put<Artigo>(`${BASE_URL}/${id}`, data);
  return response.data;
};

const deleteArtigo = async (id: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};

const findArtigosByTitulo = async (titulo: string): Promise<Artigo[]> => {
    const response = await api.get<Artigo[]>(`${BASE_URL}/titulo`, { params: { q: titulo } });
    return response.data;
};

const findArtigosByAutor = async (autorId: string): Promise<Artigo[]> => {
    const response = await api.get<Artigo[]>(`${BASE_URL}/autor/${autorId}`);
    return response.data;
};


export const artigoService = {
  getAllArtigos,
  getArtigoById,
  createArtigo,
  updateArtigo,
  deleteArtigo,
  findArtigosByTitulo,
  findArtigosByAutor,
};
