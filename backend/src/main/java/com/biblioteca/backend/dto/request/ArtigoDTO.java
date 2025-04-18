package com.biblioteca.backend.dto.request;

import com.biblioteca.backend.entity.Artigo;
import com.biblioteca.backend.entity.Autor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record ArtigoDTO(
        UUID id,
        String titulo,
        String doi,
        LocalDate dataPublicacao,
        String resumo,
        String palavrasChave,
        List<UUID> autoresIds,
        String revista,
        String volume,
        String numero,
        Integer paginaInicial,
        Integer paginaFinal
) {
    public static ArtigoDTO fromEntity(Artigo artigo) {
        return new ArtigoDTO(
                artigo.getId(),
                artigo.getTitulo(),
                artigo.getDoi(),
                artigo.getDataPublicacao(),
                artigo.getResumo(),
                artigo.getPalavrasChave(),
                artigo.getAutores().stream().map(Autor::getId).collect(Collectors.toList()),
                artigo.getRevista(),
                artigo.getVolume(),
                artigo.getNumero(),
                artigo.getPaginaInicial(),
                artigo.getPaginaFinal()
        );
    }
}
