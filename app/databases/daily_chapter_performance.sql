create table public.daily_chapter_performance (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  date date not null,
  paper character varying(50) not null,
  chapter_name character varying(255) not null,
  questions_attempted integer not null default 0,
  correct_answers integer not null default 0,
  accuracy numeric(5, 2) not null default 0,
  time_spent integer not null default 0,
  source_type character varying(20) not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint daily_chapter_performance_pkey primary key (id),
  constraint daily_chapter_performance_user_id_date_paper_chapter_name_key unique (user_id, date, paper, chapter_name),
  constraint daily_chapter_performance_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_daily_chapter_performance_user_date on public.daily_chapter_performance using btree (user_id, date) TABLESPACE pg_default;

create index IF not exists idx_daily_chapter_performance_chapter on public.daily_chapter_performance using btree (chapter_name) TABLESPACE pg_default;

create trigger update_daily_chapter_performance_updated_at BEFORE
update on daily_chapter_performance for EACH row
execute FUNCTION update_updated_at_column ();
