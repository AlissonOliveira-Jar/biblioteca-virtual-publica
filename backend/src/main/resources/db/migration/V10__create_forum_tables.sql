CREATE TABLE tb_forum_categories (
                                     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                     name VARCHAR(100) NOT NULL,
                                     slug VARCHAR(100) NOT NULL UNIQUE,
                                     description TEXT,
                                     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_forum_topics (
                                 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                 title VARCHAR(255) NOT NULL,
                                 content TEXT NOT NULL,
                                 author_id UUID NOT NULL,
                                 category_id UUID NOT NULL,
                                 is_closed BOOLEAN NOT NULL DEFAULT FALSE,
                                 view_count INTEGER NOT NULL DEFAULT 0,
                                 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                 CONSTRAINT fk_topic_author FOREIGN KEY (author_id)
                                     REFERENCES tb_users(id) ON DELETE CASCADE,
                                 CONSTRAINT fk_topic_category FOREIGN KEY (category_id)
                                     REFERENCES tb_forum_categories(id) ON DELETE CASCADE
);

CREATE TABLE tb_forum_posts (
                                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                content TEXT NOT NULL,
                                topic_id UUID NOT NULL,
                                author_id UUID NOT NULL,
                                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                CONSTRAINT fk_post_topic FOREIGN KEY (topic_id)
                                    REFERENCES tb_forum_topics(id) ON DELETE CASCADE,
                                CONSTRAINT fk_post_author FOREIGN KEY (author_id)
                                    REFERENCES tb_users(id) ON DELETE CASCADE
);

CREATE INDEX idx_topics_category ON tb_forum_topics(category_id);
CREATE INDEX idx_topics_author ON tb_forum_topics(author_id);
CREATE INDEX idx_topics_created ON tb_forum_topics(created_at DESC);
CREATE INDEX idx_posts_topic ON tb_forum_posts(topic_id);
CREATE INDEX idx_posts_created ON tb_forum_posts(created_at);

INSERT INTO tb_forum_categories (id, name, slug, description) VALUES
    (
    '550e8400-e29b-41d4-a716-446655440001',
    'Geral',
    'geral',
    'Discussões gerais sobre livros, leitura e cultura literária'
    ),
    (
     '550e8400-e29b-41d4-a716-446655440002',
     'Recomendações',
     'recomendacoes',
     'Compartilhe e peça recomendações de livros'
     ),
     (
     '550e8400-e29b-41d4-a716-446655440003',
     'Clube do Livro',
     'clube-do-livro',
     'Leitura conjunta e discussões organizadas sobre obras específicas'
     );