create table public.study_sessions (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  session_date date not null,
  questions_answered integer not null default 0,
  quiz_attempts integer not null default 0,
  test_attempts integer not null default 0,
  time_spent integer not null default 0,
  topics_studied text[] null default array[]::text[],
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  average_accuracy numeric(5, 2) null default 0,
  unique_chapters_studied integer null default 0,
  quiz_accuracy numeric(5, 2) null default 0,
  test_accuracy numeric(5, 2) null default 0,
  best_chapter character varying(255) null,
  weakest_chapter character varying(255) null,
  constraint study_sessions_pkey primary key (id),
  constraint study_sessions_user_id_session_date_key unique (user_id, session_date),
  constraint study_sessions_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_study_sessions_user_id on public.study_sessions using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_study_sessions_date on public.study_sessions using btree (session_date) TABLESPACE pg_default;

create trigger update_study_sessions_updated_at BEFORE
update on study_sessions for EACH row
execute FUNCTION update_updated_at_column ();
