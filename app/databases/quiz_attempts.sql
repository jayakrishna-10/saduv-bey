create table public.quiz_attempts (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  paper character varying(50) not null,
  selected_topic character varying(255) null,
  selected_year integer null,
  question_count integer not null,
  questions_data jsonb not null,
  answers jsonb not null,
  correct_answers integer not null default 0,
  total_questions integer not null,
  score numeric(5, 2) not null,
  time_taken integer null,
  completed_at timestamp with time zone null default now(),
  created_at timestamp with time zone null default now(),
  constraint quiz_attempts_pkey primary key (id),
  constraint quiz_attempts_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_quiz_attempts_user_id on public.quiz_attempts using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_quiz_attempts_paper on public.quiz_attempts using btree (paper) TABLESPACE pg_default;

create index IF not exists idx_quiz_attempts_completed_at on public.quiz_attempts using btree (completed_at) TABLESPACE pg_default;
