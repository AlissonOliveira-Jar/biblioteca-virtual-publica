import api from "./api";

export interface AvaliacaoRequest {
  titulo: string;
  email: string;
  nota: number;
  comentario?: string;
}

export const avaliacaoService = {
  avaliarLivro: (data: AvaliacaoRequest) =>
    api.post("/avaliacao", data),

  obterMedia: (titulo: string) =>
    api.get<number>("/avaliacao/media", {
      params: { titulo },
    }),
};
