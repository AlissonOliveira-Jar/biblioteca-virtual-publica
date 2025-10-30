export interface Editora {
  id?: string;
  nome: string;
  pais?: string | null;
  dataFundacao?: string | null;
  website?: string | null;
}

export interface EditoraFormData {
  nome: string;
  pais?: string | null;
  dataFundacao?: string | null;
  website?: string | null;
}
