create table public.user_progress (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  chapter character varying(255) not null,
  paper character varying(50) not null,
  total_questions_attempted integer not null default 0,
  correct_answers integer not null default 0,
  accuracy numeric(5, 2) not null default 0,
  best_streak integer not null default 0,
  current_streak integer not null default 0,
  last_practiced timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint user_progress_pkey primary key (id),
  constraint user_progress_user_id_chapter_paper_key unique (user_id, chapter, paper),
  constraint user_progress_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_user_progress_user_id on public.user_progress using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_user_progress_chapter on public.user_progress using btree (chapter) TABLESPACE pg_default;

create index IF not exists idx_user_progress_paper on public.user_progress using btree (paper) TABLESPACE pg_default;

create trigger update_user_progress_updated_at BEFORE
update on user_progress for EACH row
execute FUNCTION update_updated_at_column ();
