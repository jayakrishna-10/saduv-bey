create table public.test_attempts (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  test_mode character varying(50) not null,
  test_type character varying(50) not null,
  test_config jsonb not null,
  questions_data jsonb not null,
  answers jsonb not null,
  flagged_questions jsonb null,
  correct_answers integer not null default 0,
  incorrect_answers integer not null default 0,
  unanswered integer not null default 0,
  total_questions integer not null,
  score numeric(5, 2) not null,
  time_taken integer null,
  time_limit integer null,
  completed_at timestamp with time zone null default now(),
  created_at timestamp with time zone null default now(),
  constraint test_attempts_pkey primary key (id),
  constraint test_attempts_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_test_attempts_user_id on public.test_attempts using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_test_attempts_test_type on public.test_attempts using btree (test_type) TABLESPACE pg_default;

create index IF not exists idx_test_attempts_completed_at on public.test_attempts using btree (completed_at) TABLESPACE pg_default;
