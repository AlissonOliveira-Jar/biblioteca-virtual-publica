package com.biblioteca.backend.document;

import com.biblioteca.backend.entity.Editora;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.UUID;

@Getter
@Setter
@Document(indexName = "idx_editoras")
public class EditoraDocument {

    @Id
    private UUID id;

    @Field(type = FieldType.Text)
    private String nome;

    @Field(type = FieldType.Keyword)
    private String pais;
    
    public static EditoraDocument from(Editora editora) {
        EditoraDocument doc = new EditoraDocument();
        doc.setId(editora.getId());
        doc.setNome(editora.getNome());
        doc.setPais(editora.getPais());
        return doc;
    }
}
