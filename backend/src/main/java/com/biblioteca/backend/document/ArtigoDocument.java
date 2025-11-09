package com.biblioteca.backend.document;

import com.biblioteca.backend.entity.Artigo;
import com.biblioteca.backend.entity.Autor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Getter
@Setter
@Document(indexName = "idx_artigos")
public class ArtigoDocument {

    @Id
    private UUID id;

    @Field(type = FieldType.Text)
    private String titulo;

    @Field(type = FieldType.Text)
    private String resumo;

    @Field(type = FieldType.Text)
    private String palavrasChave;

    @Field(type = FieldType.Keyword)
    private String revista;

    @Field(type = FieldType.Text) 
    private List<String> autoresNomes;

    public static ArtigoDocument from(Artigo artigo) {
        ArtigoDocument doc = new ArtigoDocument();
        doc.setId(artigo.getId());
        doc.setTitulo(artigo.getTitulo());
        doc.setResumo(artigo.getResumo());
        doc.setPalavrasChave(artigo.getPalavrasChave());
        doc.setRevista(artigo.getRevista());

        if (artigo.getAutores() != null) {
            doc.setAutoresNomes(
                artigo.getAutores().stream()
                    .map(Autor::getNome)
                    .collect(Collectors.toList())
            );
        }
        return doc;
    }
}
