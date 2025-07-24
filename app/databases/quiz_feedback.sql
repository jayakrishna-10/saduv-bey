create table public.quiz_feedback (
  id serial not null,
  question_id text not null,
  question_text text null,
  paper text not null,
  feedback_type text not null default 'issue'::text,
  feedback_text text not null,
  contact_email text null,
  user_id uuid null,
  status text not null default 'pending'::text,
  admin_notes text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint quiz_feedback_pkey primary key (id),
  constraint quiz_feedback_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete set null,
  constraint quiz_feedback_feedback_type_check check (
    (
      feedback_type = any (array['issue'::text, 'explanation'::text])
    )
  ),
  constraint quiz_feedback_paper_check check (
    (
      paper = any (
        array['paper1'::text, 'paper2'::text, 'paper3'::text]
      )
    )
  ),
  constraint quiz_feedback_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'reviewed'::text,
          'resolved'::text,
          'dismissed'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_quiz_feedback_question_id on public.quiz_feedback using btree (question_id) TABLESPACE pg_default;

create index IF not exists idx_quiz_feedback_paper on public.quiz_feedback using btree (paper) TABLESPACE pg_default;

create index IF not exists idx_quiz_feedback_status on public.quiz_feedback using btree (status) TABLESPACE pg_default;

create index IF not exists idx_quiz_feedback_user_id on public.quiz_feedback using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_quiz_feedback_created_at on public.quiz_feedback using btree (created_at desc) TABLESPACE pg_default;

create trigger update_quiz_feedback_updated_at BEFORE
update on quiz_feedback for EACH row
execute FUNCTION update_updated_at_column ();
