export interface Livro {
  id?: string;
  titulo: string;
  isbn: string;
  edicao?: number | null;
  dataPublicacao?: string | null;
  numeroPaginas?: number | null;
  genero?: string | null;
  resumo?: string | null;
  autorId: string;
  editoraId?: string | null;
}

export interface LivroFormData {
  titulo: string;
  isbn: string;
  edicao?: number | string | null;
  dataPublicacao?: string | null;
  numeroPaginas?: number | string | null;
  genero?: string | null;
  resumo?: string | null;
  autorId: string;
  editoraId?: string | null;
}
