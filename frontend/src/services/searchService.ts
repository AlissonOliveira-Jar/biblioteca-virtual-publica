import api from './api';

export interface SearchResult {
  id: string;
  tipo: 'Livro' | 'Autor' | 'Artigo' | 'Editora' | 'Usuário';
  tituloPrincipal: string;
  descricao: string;
}

export const searchGlobal = async (query: string): Promise<SearchResult[]> => {
  const response = await api.get<SearchResult[]>(`/search`, { 
    params: { q: query }
  });
  return response.data;
};
