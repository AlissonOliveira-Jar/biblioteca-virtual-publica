export interface Autor {
  id?: string;
  nome: string;
  nacionalidade?: string | null;
  dataNascimento?: string | null;
  dataFalescimento?: string | null;
  biografia?: string | null;
}

export interface AutorFormData {
  nome: string;
  nacionalidade?: string | null;
  dataNascimento?: string | null;
  dataFalescimento?: string | null;
  biografia?: string | null;
}
