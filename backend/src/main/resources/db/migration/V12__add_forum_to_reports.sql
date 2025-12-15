ALTER TABLE tb_reports
    ADD COLUMN topic_id UUID,
    ADD COLUMN post_id UUID;

ALTER TABLE tb_reports
    ADD CONSTRAINT fk_reports_topic FOREIGN KEY (topic_id) REFERENCES tb_forum_topics(id) ON DELETE CASCADE;

ALTER TABLE tb_reports
    ADD CONSTRAINT fk_reports_post FOREIGN KEY (post_id) REFERENCES tb_forum_posts(id) ON DELETE CASCADE;