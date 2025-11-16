CREATE TABLE tb_favoritos (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    livro_id UUID NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_favoritos_user
        FOREIGN KEY (user_id) REFERENCES tb_users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_favoritos_livro
        FOREIGN KEY (livro_id) REFERENCES tb_livros(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_favorito_user_livro UNIQUE (user_id, livro_id)
);
