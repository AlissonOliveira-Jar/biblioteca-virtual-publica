package com.biblioteca.backend.document;

import com.biblioteca.backend.entity.Livro;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.UUID;

@Getter
@Setter
@Document(indexName = "idx_livros")
public class LivroDocument {

    @Id
    private UUID id;

    @Field(type = FieldType.Text)
    private String titulo;

    @Field(type = FieldType.Text)
    private String resumo;

    @Field(type = FieldType.Keyword)
    private String isbn;

    @Field(type = FieldType.Keyword)
    private String genero;

    @Field(type = FieldType.Text)
    private String autorNome;

    @Field(type = FieldType.Keyword)
    private String editoraNome;

    public LivroDocument() {
    }

    public static LivroDocument from(Livro livro) {
        LivroDocument doc = new LivroDocument();
        doc.setId(livro.getId());
        doc.setTitulo(livro.getTitulo());
        doc.setResumo(livro.getResumo());
        doc.setIsbn(livro.getIsbn());
        doc.setGenero(livro.getGenero());

        if (livro.getAutor() != null) {
            doc.setAutorNome(livro.getAutor().getNome());
        }
        if (livro.getEditora() != null) {
            doc.setEditoraNome(livro.getEditora().getNome());
        }
        return doc;
    }
}
