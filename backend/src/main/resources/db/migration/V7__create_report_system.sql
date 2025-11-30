
ALTER TABLE public.tb_users
    ADD COLUMN is_comment_banned BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE public.tb_reports (
                                   id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                                   reason              VARCHAR(50) NOT NULL,
                                   status              VARCHAR(50) NOT NULL,
                                   created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

                                   reporter_id         UUID NOT NULL,
                                   reported_comment_id UUID NULL,
                                   reported_user_id    UUID NULL,

                                   CONSTRAINT fk_report_reporter
                                       FOREIGN KEY (reporter_id)
                                           REFERENCES public.tb_users (id)
                                           ON DELETE CASCADE,

                                   CONSTRAINT fk_report_reported_comment
                                       FOREIGN KEY (reported_comment_id)
                                           REFERENCES public.tb_comments (id)
                                           ON DELETE SET NULL,

                                   CONSTRAINT fk_report_reported_user
                                       FOREIGN KEY (reported_user_id)
                                           REFERENCES public.tb_users (id)
                                           ON DELETE SET NULL
);

CREATE INDEX idx_reports_status ON public.tb_reports (status);
CREATE INDEX idx_reports_created_at ON public.tb_reports (created_at DESC);