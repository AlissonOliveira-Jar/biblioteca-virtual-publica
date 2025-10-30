import type { Autor } from './autor';

export interface Artigo {
  id?: string;
  titulo: string;
  doi: string;
  dataPublicacao?: string | null;
  resumo?: string | null;
  palavrasChave?: string | null;
  autoresIds: string[];
  autores?: Pick<Autor, 'id' | 'nome'>[];
  revista?: string | null;
  volume?: string | null;
  numero?: string | null;
  paginaInicial?: number | null;
  paginaFinal?: number | null;
}

export interface ArtigoFormData {
  titulo: string;
  doi: string;
  dataPublicacao?: string | null;
  resumo?: string | null;
  palavrasChave?: string | null;
  autoresIds: string[];
  revista?: string | null;
  volume?: string | null;
  numero?: string | null;
  paginaInicial?: number | string | null;
  paginaFinal?: number | string | null;
}

export interface AutorSelecao {
  id: string;
  nome: string;
}
