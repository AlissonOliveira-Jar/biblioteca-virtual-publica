package com.biblioteca.backend.document;

import com.biblioteca.backend.entity.Autor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.UUID;

@Getter
@Setter
@Document(indexName = "idx_autores")
public class AutorDocument {

    @Id
    private UUID id;

    @Field(type = FieldType.Text)
    private String nome;

    @Field(type = FieldType.Keyword)
    private String nacionalidade;

    @Field(type = FieldType.Text)
    private String biografia;

    public static AutorDocument from(Autor autor) {
        AutorDocument doc = new AutorDocument();
        doc.setId(autor.getId());
        doc.setNome(autor.getNome());
        doc.setNacionalidade(autor.getNacionalidade());
        doc.setBiografia(autor.getBiografia());
        return doc;
    }
}
