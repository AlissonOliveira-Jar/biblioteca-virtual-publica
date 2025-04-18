package com.biblioteca.backend.dto.request;

import com.biblioteca.backend.entity.Livro;

import java.time.LocalDate;
import java.util.UUID;

public record LivroDTO(
        UUID id,
        String titulo,
        String isbn,
        Integer edicao,
        LocalDate dataPublicacao,
        Integer numeroPaginas,
        String genero,
        String resumo,
        UUID autorId,
        UUID editoraId
) {
    public static LivroDTO fromEntity(Livro livro) {
        return new LivroDTO(
                livro.getId(),
                livro.getTitulo(),
                livro.getIsbn(),
                livro.getEdicao(),
                livro.getDataPublicacao(),
                livro.getNumeroPaginas(),
                livro.getGenero(),
                livro.getResumo(),
                livro.getAutor().getId(),
                livro.getEditora() != null ? livro.getEditora().getId() : null
        );
    }
}
