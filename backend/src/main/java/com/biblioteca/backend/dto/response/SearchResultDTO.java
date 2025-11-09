package com.biblioteca.backend.dto.response;

import com.biblioteca.backend.document.ArtigoDocument;
import com.biblioteca.backend.document.AutorDocument;
import com.biblioteca.backend.document.EditoraDocument;
import com.biblioteca.backend.document.LivroDocument;
import com.biblioteca.backend.document.UserDocument;
import lombok.Data;

import java.util.UUID;

@Data
public class SearchResultDTO {
    
    private UUID id;
    private String tipo;
    private String tituloPrincipal;
    private String descricao;
    
    public static SearchResultDTO from(LivroDocument doc) {
        SearchResultDTO dto = new SearchResultDTO();
        dto.setId(doc.getId());
        dto.setTipo("Livro");
        dto.setTituloPrincipal(doc.getTitulo());
        dto.setDescricao("Por: " + (doc.getAutorNome() != null ? doc.getAutorNome() : "Desconhecido"));
        return dto;
    }
    
    public static SearchResultDTO from(AutorDocument doc) {
        SearchResultDTO dto = new SearchResultDTO();
        dto.setId(doc.getId());
        dto.setTipo("Autor");
        dto.setTituloPrincipal(doc.getNome());
        dto.setDescricao(doc.getNacionalidade() != null ? doc.getNacionalidade() : "Biografia não disponível");
        return dto;
    }
    
    public static SearchResultDTO from(ArtigoDocument doc) {
        SearchResultDTO dto = new SearchResultDTO();
        dto.setId(doc.getId());
        dto.setTipo("Artigo");
        dto.setTituloPrincipal(doc.getTitulo());
        dto.setDescricao("Revista: " + (doc.getRevista() != null ? doc.getRevista() : "Não informada"));
        return dto;
    }
    
    public static SearchResultDTO from(EditoraDocument doc) {
        SearchResultDTO dto = new SearchResultDTO();
        dto.setId(doc.getId());
        dto.setTipo("Editora");
        dto.setTituloPrincipal(doc.getNome());
        dto.setDescricao("País: " + (doc.getPais() != null ? doc.getPais() : "Não informado"));
        return dto;
    }
    
    public static SearchResultDTO from(UserDocument doc) {
        SearchResultDTO dto = new SearchResultDTO();
        dto.setId(doc.getId());
        dto.setTipo("Usuário");
        dto.setTituloPrincipal(doc.getName());
        dto.setDescricao(doc.getEmail());
        return dto;
    }
}
