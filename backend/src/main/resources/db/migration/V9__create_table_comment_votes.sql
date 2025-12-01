CREATE TABLE tb_comment_votes (
                                  id UUID NOT NULL PRIMARY KEY,
                                  is_helpful BOOLEAN NOT NULL,
                                  comment_id UUID NOT NULL,
                                  user_id UUID NOT NULL,

                                  CONSTRAINT fk_vote_comment FOREIGN KEY (comment_id) REFERENCES tb_comments(id) ON DELETE CASCADE,
                                  CONSTRAINT fk_vote_user FOREIGN KEY (user_id) REFERENCES tb_users(id) ON DELETE CASCADE,
                                  CONSTRAINT unique_user_comment_vote UNIQUE (user_id, comment_id)
);