package com.biblioteca.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter

public class LivroRankingDTO {
    private int posicao;
    private String livroId;
    private String titulo;
    private String autor;
    private long totalPaginasLidas;
    private long totalVezesLido;

    public LivroRankingDTO(int posicao, String livroId, String titulo, String autor, long totalPaginasLidas, long totalVezesLido) {
        this.posicao = posicao;
        this.livroId = livroId;
        this.titulo = titulo;
        this.autor = autor;
        this.totalPaginasLidas = totalPaginasLidas;
        this.totalVezesLido = totalVezesLido;
    }
}