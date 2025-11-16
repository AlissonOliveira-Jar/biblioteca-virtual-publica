import api from "./api";
import type { Livro } from "../types/livro";

export interface FavoritoResponse {
    id: string;
    livro: Livro;
}

export const favoritoService = {
    listar: async (): Promise<FavoritoResponse[]> => {
        const res = await api.get("/favoritos");
        return res.data;
    },

    adicionar: async (livroId: string) => {
        await api.post("/favoritos", { livroId });
    },

    remover: async (livroId: string) => {
        await api.delete(`/favoritos/${livroId}`);
    },
};
