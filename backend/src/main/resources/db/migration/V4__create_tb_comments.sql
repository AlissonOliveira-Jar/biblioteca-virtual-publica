CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE public.tb_comments (

    id                UUID PRIMARY KEY      DEFAULT gen_random_uuid(),

    content           VARCHAR(500) NOT NULL,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    user_id           UUID         NOT NULL,
    livro_id          UUID         NOT NULL,
    parent_comment_id UUID         NULL,

    helpful_count     INT          NOT NULL DEFAULT 0,
    not_helpful_count INT          NOT NULL DEFAULT 0,

    CONSTRAINT fk_comment_user
        FOREIGN KEY (user_id)
            REFERENCES public.tb_users (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_comment_livro
        FOREIGN KEY (livro_id)
            REFERENCES public.tb_livros (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_comment_parent
        FOREIGN KEY (parent_comment_id)
            REFERENCES public.tb_comments (id)
            ON DELETE CASCADE
);

CREATE INDEX idx_comments_livro_id ON public.tb_comments (livro_id);
CREATE INDEX idx_comments_user_id ON public.tb_comments (user_id);
CREATE INDEX idx_comments_parent_comment_id ON public.tb_comments (parent_comment_id);
CREATE INDEX idx_comments_created_at ON public.tb_comments (created_at DESC);
