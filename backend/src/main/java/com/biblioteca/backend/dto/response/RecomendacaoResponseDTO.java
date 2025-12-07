package com.biblioteca.backend.dto.response;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class RecomendacaoResponseDTO {
    private String livroId;
    private String titulo;
    private String autor;
    private List<String> genero;

    public RecomendacaoResponseDTO(String livroId, String titulo, String autor, List<String> genero) {
        this.livroId = livroId;
        this.titulo = titulo;
        this.autor = autor;
        this.genero = genero;
    }
}
