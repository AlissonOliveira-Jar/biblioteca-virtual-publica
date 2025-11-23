package com.biblioteca.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
@Getter
@Setter

public class UserRankingDTO {
    private int posicao;
    private String userId;
    private String nome;
    private Long pontos;
    private int nivel;

    public UserRankingDTO(int posicao, String userId, String nome, Long pontos, int nivel) {
        this.posicao = posicao;
        this.userId = userId;
        this.nome = nome;
        this.pontos = pontos;
        this.nivel = nivel;
    }
}